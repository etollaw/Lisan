import { Lesson, Exercise, ExerciseType } from '../models/types';

// Sample lessons with real audio files from the user's collection
export const sampleLessons: Lesson[] = [
  {
    id: '1',
    title: 'Greetings',
    description: 'Learn basic Amharic greetings',
    category: 'basic',
    level: 1,
    icon: 'smile',
    color: '#FF6B6B',
    isLocked: false,
    requiredXP: 0,
    exercises: [
      {
        id: '1-1',
        type: ExerciseType.LISTENING,
        question: 'Listen and select the correct translation',
        amharicText: 'ሰላም',
        englishText: 'Hello',
        pronunciation: 'se-lam',
        audioFile: 'greetings/hello',
        options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
        correctAnswer: 'Hello',
        explanation: 'ሰላም (selam) is the most common greeting in Amharic',
        points: 10
      },
      {
        id: '1-2',
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'How do you say "Good morning" in Amharic?',
        amharicText: 'እንደምን አደርክ',
        englishText: 'Good morning',
        pronunciation: 'en-de-min a-derk',
        audioFile: 'greetings/goodmorning',
        options: ['ሰላም', 'እንደምን አደርክ', 'ደህና ሁን', 'አመሰግናለሁ'],
        correctAnswer: 'እንደምን አደርክ',
        explanation: 'This is a common morning greeting',
        points: 15
      }
    ]
  },
  {
    id: '2',
    title: 'Numbers',
    description: 'Learn Amharic numbers 1-10',
    category: 'basic',
    level: 1,
    icon: 'hash',
    color: '#4ECDC4',
    isLocked: false,
    requiredXP: 50,
    exercises: [
      {
        id: '2-1',
        type: ExerciseType.LISTENING,
        question: 'Listen and select the number you hear',
        amharicText: 'አንድ',
        englishText: 'One',
        pronunciation: 'and',
        audioFile: 'numbers/1',
        options: ['1', '2', '3', '4'],
        correctAnswer: '1',
        explanation: 'አንድ (and) means one in Amharic',
        points: 10
      },
      {
        id: '2-2',
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'What number is "ሁለት"?',
        amharicText: 'ሁለት',
        englishText: 'Two',
        pronunciation: 'hu-let',
        audioFile: 'numbers/2',
        options: ['1', '2', '3', '4'],
        correctAnswer: '2',
        explanation: 'ሁለት (hulet) means two in Amharic',
        points: 10
      }
    ]
  },
  {
    id: '3',
    title: 'Colors',
    description: 'Learn basic colors in Amharic',
    category: 'basic',
    level: 1,
    icon: 'eye',
    color: '#45B7D1',
    isLocked: true,
    requiredXP: 100,
    exercises: [
      {
        id: '3-1',
        type: ExerciseType.LISTENING,
        question: 'Listen and select the correct color',
        amharicText: 'ቀይ',
        englishText: 'Red',
        pronunciation: 'key',
        audioFile: 'colors/red',
        options: ['Red', 'Blue', 'Green', 'Yellow'],
        correctAnswer: 'Red',
        explanation: 'ቀይ (key) means red in Amharic',
        points: 10
      },
      {
        id: '3-2',
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'What color is "ሰማያዊ"?',
        amharicText: 'ሰማያዊ',
        englishText: 'Blue',
        pronunciation: 'se-ma-ya-wi',
        audioFile: 'colors/blue',
        options: ['Red', 'Blue', 'Green', 'Yellow'],
        correctAnswer: 'Blue',
        explanation: 'ሰማያዊ (semayawi) means blue in Amharic',
        points: 10
      }
    ]
  }
];

// Categories for organizing lessons
export const categories = [
  {
    id: '1',
    name: 'Greetings',
    description: 'Basic greetings and polite expressions',
    icon: 'smile',
    color: '#FF6B6B',
    lessons: ['1'],
    order: 1
  },
  {
    id: '2',
    name: 'Numbers',
    description: 'Numbers from 1 to 100',
    icon: 'hash',
    color: '#4ECDC4',
    lessons: ['2'],
    order: 2
  },
  {
    id: '3',
    name: 'Colors',
    description: 'Basic colors and descriptions',
    icon: 'eye',
    color: '#45B7D1',
    lessons: ['3'],
    order: 3
  }
];

// Helper function to get lesson by ID
export const getLessonById = (id: string): Lesson | null => {
  const lesson = sampleLessons.find(lesson => lesson.id === id);
  return lesson || null;
};

// Helper function to get lessons by category
export const getLessonsByCategory = (category: string): Lesson[] => {
  return sampleLessons.filter(lesson => lesson.category === category);
};

// Helper function to get all available categories
export const getAllCategories = () => {
  return categories;
};
