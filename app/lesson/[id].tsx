import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  Modal
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Exercise, ExerciseType, Lesson } from '../models/types';
import { getLessonById } from '../services/lessonData';
import { audioService } from '../services/AudioService';

const { width, height } = Dimensions.get('window');

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLesson();
    initializeAudio();
  }, [id]);

  const initializeAudio = async () => {
    await audioService.initializeAudio();
  };

  const loadLesson = () => {
    if (id) {
      const lessonData = getLessonById(id);
      if (lessonData) {
        setLesson(lessonData);
        // Play lesson intro if available
        if (lessonData.audioIntro) {
          audioService.playAudio('intro', lessonData.audioIntro);
        }
      }
    }
    setIsLoading(false);
  };

  const currentExercise = lesson?.exercises[currentExerciseIndex];
  const totalExercises = lesson?.exercises.length || 0;
  const progress = ((currentExerciseIndex + 1) / totalExercises) * 100;

  const playAudio = async () => {
    if (currentExercise?.audioFile) {
      console.log(`🎵 Raw audioFile:`, currentExercise.audioFile);
      const [category, filename] = currentExercise.audioFile.split('/');
      console.log(`🎵 Split result - category: "${category}", filename: "${filename}"`);
      
      if (category && filename) {
        await audioService.playAudio(category, filename);
      } else {
        console.warn(`❌ Invalid audioFile format: ${currentExercise.audioFile}`);
      }
    }
  };

  const handleAnswerSubmit = () => {
    if (!currentExercise) return;

    const answer = selectedOption || userAnswer;
    const correct = checkAnswer(answer);
    
    setIsAnswered(true);
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + currentExercise.points);
    } else {
      setHearts(hearts - 1);
      if (hearts <= 1) {
        // Game over
        Alert.alert('Out of Hearts!', 'You can continue learning tomorrow or practice easier lessons.');
        router.back();
        return;
      }
    }
    
    if (currentExercise.explanation) {
      setShowExplanation(true);
    }
  };

  const checkAnswer = (answer: string): boolean => {
    if (!currentExercise) return false;
    
    const correctAnswer = currentExercise.correctAnswer;
    
    if (Array.isArray(correctAnswer)) {
      return correctAnswer.includes(answer);
    }
    
    return answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
  };

  const handleNext = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      // Next exercise
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      resetExerciseState();
    } else {
      // Lesson completed
      showLessonComplete();
    }
  };

  const resetExerciseState = () => {
    setUserAnswer('');
    setSelectedOption('');
    setIsAnswered(false);
    setIsCorrect(false);
    setShowExplanation(false);
  };

  const showLessonComplete = () => {
    Alert.alert(
      'Lesson Complete!',
      `Congratulations! You earned ${score} XP!`,
      [
        { text: 'Continue', onPress: () => router.back() }
      ]
    );
  };

  const renderExercise = () => {
    if (!currentExercise) return null;

    switch (currentExercise.type) {
      case ExerciseType.MULTIPLE_CHOICE:
        return renderMultipleChoice();
      case ExerciseType.TRANSLATION:
        return renderTranslation();
      case ExerciseType.LISTENING:
        return renderListening();
      default:
        return renderMultipleChoice();
    }
  };

  const renderMultipleChoice = () => (
    <View style={styles.exerciseContainer}>
      <Text style={styles.question}>{currentExercise?.question}</Text>
      
      {currentExercise?.amharicText && (
        <View style={styles.textContainer}>
          <Text style={styles.amharicText}>{currentExercise.amharicText}</Text>
          {currentExercise.audioFile && (
            <TouchableOpacity style={styles.audioButton} onPress={playAudio}>
              <Feather name="volume-2" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.optionsContainer}>
        {currentExercise?.options?.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === option && styles.selectedOption,
              isAnswered && option === currentExercise.correctAnswer && styles.correctOption,
              isAnswered && selectedOption === option && !isCorrect && styles.wrongOption,
            ]}
            onPress={() => setSelectedOption(option)}
            disabled={isAnswered}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTranslation = () => (
    <View style={styles.exerciseContainer}>
      <Text style={styles.question}>{currentExercise?.question}</Text>
      
      <View style={styles.textContainer}>
        <Text style={styles.amharicText}>{currentExercise?.amharicText}</Text>
        {currentExercise?.audioFile && (
          <TouchableOpacity style={styles.audioButton} onPress={playAudio}>
            <Feather name="volume-2" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Type your translation:</Text>
        <Text style={styles.textInput}>{userAnswer || 'Tap to type...'}</Text>
      </View>
    </View>
  );

  const renderListening = () => (
    <View style={styles.exerciseContainer}>
      <Text style={styles.question}>{currentExercise?.question}</Text>
      
      <TouchableOpacity style={styles.bigAudioButton} onPress={playAudio}>
        <Feather name="volume-2" size={48} color="#fff" />
        <Text style={styles.audioButtonText}>Tap to listen</Text>
      </TouchableOpacity>

      <View style={styles.optionsContainer}>
        {currentExercise?.options?.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === option && styles.selectedOption,
              isAnswered && option === currentExercise.correctAnswer && styles.correctOption,
              isAnswered && selectedOption === option && !isCorrect && styles.wrongOption,
            ]}
            onPress={() => setSelectedOption(option)}
            disabled={isAnswered}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading lesson...</Text>
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Lesson not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="x" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{currentExerciseIndex + 1}/{totalExercises}</Text>
        </View>
        
        <View style={styles.heartsContainer}>
          <Feather name="heart" size={20} color="#FF6B6B" />
          <Text style={styles.heartsText}>{hearts}</Text>
        </View>
      </View>

      {/* Exercise Content */}
      <View style={styles.content}>
        {renderExercise()}
      </View>

      {/* Action Button */}
      <View style={styles.actionContainer}>
        {!isAnswered ? (
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!selectedOption && !userAnswer) && styles.disabledButton
            ]}
            onPress={handleAnswerSubmit}
            disabled={!selectedOption && !userAnswer}
          >
            <Text style={styles.submitButtonText}>Check</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.submitButton, isCorrect ? styles.correctButton : styles.wrongButton]}
            onPress={handleNext}
          >
            <Text style={styles.submitButtonText}>
              {currentExerciseIndex < totalExercises - 1 ? 'Continue' : 'Complete'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Explanation Modal */}
      <Modal visible={showExplanation} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.explanationBox}>
            <Text style={styles.explanationTitle}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </Text>
            <Text style={styles.explanationText}>
              {currentExercise?.explanation}
            </Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => setShowExplanation(false)}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111111',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    padding: 15,
    backgroundColor: '#58CC02',
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  heartsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartsText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  exerciseContainer: {
    flex: 1,
  },
  question: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  amharicText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  audioButton: {
    backgroundColor: '#58CC02',
    borderRadius: 25,
    padding: 10,
  },
  bigAudioButton: {
    backgroundColor: '#58CC02',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 40,
    alignSelf: 'center',
  },
  audioButtonText: {
    color: '#fff',
    marginTop: 10,
    fontWeight: 'bold',
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#58CC02',
    backgroundColor: 'rgba(88, 204, 2, 0.2)',
  },
  correctOption: {
    backgroundColor: 'rgba(88, 204, 2, 0.3)',
    borderColor: '#58CC02',
  },
  wrongOption: {
    backgroundColor: 'rgba(255, 107, 107, 0.3)',
    borderColor: '#FF6B6B',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: 20,
  },
  inputLabel: {
    color: '#fff',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    minHeight: 50,
  },
  actionContainer: {
    padding: 20,
  },
  submitButton: {
    backgroundColor: '#58CC02',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  correctButton: {
    backgroundColor: '#58CC02',
  },
  wrongButton: {
    backgroundColor: '#FF6B6B',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  explanationBox: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 15,
    margin: 20,
    alignItems: 'center',
  },
  explanationTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  explanationText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: '#58CC02',
    padding: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
