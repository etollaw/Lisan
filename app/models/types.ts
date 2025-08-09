// Core data models for the Amharic learning app

export interface User {
  id: string;
  email: string;
  displayName?: string;
  currentLevel: number;
  totalXP: number;
  streak: number;
  hearts: number;
  unlockedLessons: string[];
  completedLessons: string[];
  createdAt: Date;
  lastLoginAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  level: number;
  icon: string;
  color: string;
  isLocked: boolean;
  requiredXP: number;
  exercises: Exercise[];
  audioIntro?: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  amharicText: string;
  englishText: string;
  pronunciation?: string;
  audioFile?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export enum ExerciseType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRANSLATION = 'translation',
  LISTENING = 'listening',
  PRONUNCIATION = 'pronunciation',
  FILL_BLANK = 'fill_blank',
  MATCH_PAIRS = 'match_pairs',
  TRUE_FALSE = 'true_false'
}

export interface UserProgress {
  userId: string;
  lessonId: string;
  exerciseId: string;
  isCompleted: boolean;
  attempts: number;
  bestScore: number;
  timeSpent: number;
  lastAttemptAt: Date;
}

export interface LessonProgress {
  lessonId: string;
  userId: string;
  completedExercises: string[];
  totalExercises: number;
  score: number;
  isCompleted: boolean;
  startedAt: Date;
  completedAt?: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  lessons: string[]; // lesson IDs
  order: number;
}

// Audio-related types for your Amharic voice files
export interface AudioFile {
  id: string;
  filename: string;
  category: string;
  amharicText: string;
  englishTranslation: string;
  pronunciation: string;
  localPath: string;
}

// Achievement system
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'streak' | 'lessons' | 'xp' | 'time';
  requirement: number;
  points: number;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress: number;
}
