import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { User, UserProgress, LessonProgress } from '../models/types';

const db = getFirestore();

export class UserProgressService {
  
  /**
   * Initialize user data when they first sign up
   */
  static async initializeUser(userId: string, email: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    
    const newUser: User = {
      id: userId,
      email,
      currentLevel: 1,
      totalXP: 0,
      streak: 0,
      hearts: 5,
      unlockedLessons: ['1', '2'], // First two lessons unlocked by default
      completedLessons: [],
      createdAt: new Date(),
      lastLoginAt: new Date()
    };

    await setDoc(userRef, newUser);
  }

  /**
   * Get user data
   */
  static async getUserData(userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data() as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  /**
   * Update user XP and unlock new lessons
   */
  static async updateUserXP(userId: string, xpGained: number): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        const newTotalXP = userData.totalXP + xpGained;
        
        // Check what lessons should be unlocked
        const newUnlockedLessons = this.calculateUnlockedLessons(newTotalXP);
        
        await updateDoc(userRef, {
          totalXP: newTotalXP,
          unlockedLessons: newUnlockedLessons,
          lastLoginAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error updating user XP:', error);
    }
  }

  /**
   * Complete a lesson and update progress
   */
  static async completeLesson(userId: string, lessonId: string, score: number): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        
        // Add lesson to completed if not already there
        const completedLessons = userData.completedLessons.includes(lessonId) 
          ? userData.completedLessons 
          : [...userData.completedLessons, lessonId];

        await updateDoc(userRef, {
          completedLessons,
          totalXP: userData.totalXP + score,
          lastLoginAt: new Date()
        });

        // Save lesson progress
        await this.saveLessonProgress(userId, lessonId, score);
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  }

  /**
   * Save detailed lesson progress
   */
  static async saveLessonProgress(userId: string, lessonId: string, score: number): Promise<void> {
    try {
      const progressRef = collection(db, 'lessonProgress');
      
      const lessonProgress: LessonProgress = {
        lessonId,
        userId,
        completedExercises: [], // This would be populated during the lesson
        totalExercises: 0, // This would be set based on the lesson
        score,
        isCompleted: true,
        startedAt: new Date(),
        completedAt: new Date()
      };

      await addDoc(progressRef, lessonProgress);
    } catch (error) {
      console.error('Error saving lesson progress:', error);
    }
  }

  /**
   * Update user hearts (lives)
   */
  static async updateHearts(userId: string, heartsChange: number): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        const newHearts = Math.max(0, Math.min(5, userData.hearts + heartsChange));
        
        await updateDoc(userRef, {
          hearts: newHearts,
          lastLoginAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error updating hearts:', error);
    }
  }

  /**
   * Update user streak
   */
  static async updateStreak(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        const today = new Date();
        const lastLogin = userData.lastLoginAt;
        
        let newStreak = userData.streak;
        
        // Check if it's a consecutive day
        if (lastLogin) {
          const lastLoginDate = new Date(lastLogin);
          const daysDifference = Math.floor((today.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDifference === 1) {
            // Consecutive day - increment streak
            newStreak = userData.streak + 1;
          } else if (daysDifference > 1) {
            // Missed a day - reset streak
            newStreak = 1;
          }
          // Same day - no change to streak
        } else {
          // First login
          newStreak = 1;
        }
        
        await updateDoc(userRef, {
          streak: newStreak,
          lastLoginAt: today
        });
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }

  /**
   * Calculate which lessons should be unlocked based on XP
   */
  private static calculateUnlockedLessons(totalXP: number): string[] {
    const unlockedLessons = ['1', '2']; // Always unlock first two lessons
    
    // Unlock lesson 3 (Numbers) at 50 XP
    if (totalXP >= 50) {
      unlockedLessons.push('3');
    }
    
    // Unlock lesson 4 (Colors) at 100 XP
    if (totalXP >= 100) {
      unlockedLessons.push('4');
    }
    
    // Add more unlock conditions as you create more lessons
    
    return unlockedLessons;
  }

  /**
   * Get current user from auth
   */
  static getCurrentUser() {
    const auth = getAuth();
    return auth.currentUser;
  }

  /**
   * Get user statistics for profile/dashboard
   */
  static async getUserStats(userId: string) {
    try {
      const userData = await this.getUserData(userId);
      if (!userData) return null;

      return {
        totalXP: userData.totalXP,
        streak: userData.streak,
        hearts: userData.hearts,
        level: userData.currentLevel,
        completedLessons: userData.completedLessons.length,
        unlockedLessons: userData.unlockedLessons.length
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return null;
    }
  }
}
