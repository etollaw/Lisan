import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';
import { UserProgressService } from './services/UserProgressService';

interface UserStats {
  totalXP: number;
  streak: number;
  hearts: number;
  level: number;
  completedLessons: number;
  unlockedLessons: number;
}

export default function ProfileScreen() {
  const router = useRouter();
  const auth = getAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const stats = await UserProgressService.getUserStats(user.uid);
        setUserStats(stats);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        router.replace('/auth');
      })
      .catch(error => console.error('Sign out error:', error));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={handleSignOut}>
            <Feather name="log-out" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarContainer}>
            <Feather name="user" size={40} color="#fff" />
          </View>
          <Text style={styles.userName}>
            {auth.currentUser?.displayName || auth.currentUser?.email || 'Amharic Learner'}
          </Text>
          <Text style={styles.userLevel}>Level {userStats?.level || 1}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Feather name="zap" size={24} color="#FFD700" />
            </View>
            <Text style={styles.statNumber}>{userStats?.totalXP || 0}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Feather name="calendar" size={24} color="#FF6B6B" />
            </View>
            <Text style={styles.statNumber}>{userStats?.streak || 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Feather name="heart" size={24} color="#FF6B6B" />
            </View>
            <Text style={styles.statNumber}>{userStats?.hearts || 5}</Text>
            <Text style={styles.statLabel}>Hearts</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Feather name="book" size={24} color="#58CC02" />
            </View>
            <Text style={styles.statNumber}>{userStats?.completedLessons || 0}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Learning Progress</Text>
          
          <View style={styles.progressCard}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>Lessons Unlocked</Text>
              <Text style={styles.progressSubtitle}>
                {userStats?.unlockedLessons || 0} lessons available
              </Text>
            </View>
            <View style={styles.progressValue}>
              <Text style={styles.progressNumber}>{userStats?.unlockedLessons || 0}</Text>
            </View>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>Next Level</Text>
              <Text style={styles.progressSubtitle}>
                {Math.max(0, ((userStats?.level || 1) * 100) - (userStats?.totalXP || 0))} XP needed
              </Text>
            </View>
            <View style={styles.progressValue}>
              <Feather name="arrow-right" size={20} color="#58CC02" />
            </View>
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          
          <View style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <Feather name="award" size={24} color="#FFD700" />
            </View>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>First Steps</Text>
              <Text style={styles.achievementDescription}>Complete your first lesson</Text>
            </View>
            <View style={styles.achievementStatus}>
              {(userStats?.completedLessons || 0) > 0 ? (
                <Feather name="check-circle" size={20} color="#58CC02" />
              ) : (
                <Feather name="circle" size={20} color="#666" />
              )}
            </View>
          </View>

          <View style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <Feather name="trending-up" size={24} color="#FFD700" />
            </View>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>Week Warrior</Text>
              <Text style={styles.achievementDescription}>Learn for 7 days in a row</Text>
            </View>
            <View style={styles.achievementStatus}>
              {(userStats?.streak || 0) >= 7 ? (
                <Feather name="check-circle" size={20} color="#58CC02" />
              ) : (
                <Feather name="circle" size={20} color="#666" />
              )}
            </View>
          </View>

          <View style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <Feather name="star" size={24} color="#FFD700" />
            </View>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>XP Collector</Text>
              <Text style={styles.achievementDescription}>Earn 100 XP</Text>
            </View>
            <View style={styles.achievementStatus}>
              {(userStats?.totalXP || 0) >= 100 ? (
                <Feather name="check-circle" size={20} color="#58CC02" />
              ) : (
                <Feather name="circle" size={20} color="#666" />
              )}
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Feather name="volume-2" size={20} color="#fff" />
            <Text style={styles.settingText}>Audio Settings</Text>
            <Feather name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Feather name="bell" size={20} color="#fff" />
            <Text style={styles.settingText}>Notifications</Text>
            <Feather name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Feather name="help-circle" size={20} color="#fff" />
            <Text style={styles.settingText}>Help & Support</Text>
            <Feather name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleSignOut}>
            <Feather name="log-out" size={20} color="#FF6B6B" />
            <Text style={[styles.settingText, { color: '#FF6B6B' }]}>Sign Out</Text>
            <Feather name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111111',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userLevel: {
    color: '#58CC02',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  statCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    marginBottom: 15,
  },
  statIcon: {
    marginBottom: 10,
  },
  statNumber: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    color: '#666',
    fontSize: 14,
  },
  progressSection: {
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  progressCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  progressSubtitle: {
    color: '#666',
    fontSize: 14,
  },
  progressValue: {
    alignItems: 'center',
  },
  progressNumber: {
    color: '#58CC02',
    fontSize: 18,
    fontWeight: 'bold',
  },
  achievementsSection: {
    padding: 20,
    paddingTop: 0,
  },
  achievementCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementIcon: {
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  achievementDescription: {
    color: '#666',
    fontSize: 14,
  },
  achievementStatus: {
    marginLeft: 10,
  },
  settingsSection: {
    padding: 20,
    paddingTop: 0,
  },
  settingItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    marginLeft: 15,
  },
});
