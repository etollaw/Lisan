import { Audio } from 'expo-av';
import { Platform } from 'react-native';

class AudioService {
  private sounds: Map<string, Audio.Sound> = new Map();
  
  /**
   * Load and play an audio file
   * @param category - The audio category (greetings, numbers, alphabets)
   * @param filename - The audio filename without extension
   */
  async playAudio(category: string, filename: string): Promise<void> {
    try {
      console.log(`🔊 Playing audio: ${category}/${filename}`);
      const soundKey = `${category}/${filename}`;
      
      // Check if sound is already loaded
      if (this.sounds.has(soundKey)) {
        console.log('📱 Sound already loaded, replaying...');
        const sound = this.sounds.get(soundKey)!;
        await sound.replayAsync();
        return;
      }

      // Create the audio path
      const audioPath = this.getAudioPath(category, filename);
      
      if (!audioPath) {
        console.warn(`❌ Audio file not found: ${category}/${filename}`);
        return;
      }

      console.log(`✅ Audio path found, loading sound...`);
      
      // Load and play the sound
      const { sound } = await Audio.Sound.createAsync(audioPath);
      this.sounds.set(soundKey, sound);
      
      console.log(`🎵 Playing sound...`);
      await sound.playAsync();
      
      // Clean up when sound finishes
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          console.log(`🔇 Sound finished playing: ${soundKey}`);
          this.unloadSound(soundKey);
        }
      });
      
    } catch (error) {
      console.error('❌ Error playing audio:', error);
    }
  }

  /**
   * Get the correct audio path based on category and filename
   * Now integrated with your actual Amharic audio files!
   */
  private getAudioPath(category: string, filename: string) {
    try {
      console.log(`🔍 Looking for audio: ${category}/${filename}`);
      
      // Map to your actual Amharic audio files from your collection
      const audioMap: Record<string, any> = {
        // Greetings - from your greeting_audio_files folder
        'greetings/hello': require('../../assets/audio/Lisan Audio File/greeting_audio_files/chawo.mp3'),
        'greetings/goodbye': require('../../assets/audio/Lisan Audio File/greeting_audio_files/dehna-hun.mp3'),
        'greetings/thankyou': require('../../assets/audio/Lisan Audio File/greeting_audio_files/dehna-ameshachhu.mp3'),
        'greetings/goodmorning': require('../../assets/audio/Lisan Audio File/greeting_audio_files/dehna-aderachhu.mp3'),
        
        // Numbers - from your amharic_numbers_audio folder
        'numbers/1': require('../../assets/audio/Lisan Audio File/amharic_numbers_audio/፩_1.mp3'),
        'numbers/2': require('../../assets/audio/Lisan Audio File/amharic_numbers_audio/፪_2.mp3'),
        'numbers/3': require('../../assets/audio/Lisan Audio File/amharic_numbers_audio/፫_3.mp3'),
        'numbers/4': require('../../assets/audio/Lisan Audio File/amharic_numbers_audio/፬_4.mp3'),
        'numbers/5': require('../../assets/audio/Lisan Audio File/amharic_numbers_audio/፭_5.mp3'),
        'numbers/6': require('../../assets/audio/Lisan Audio File/amharic_numbers_audio/፮_6.mp3'),
        'numbers/7': require('../../assets/audio/Lisan Audio File/amharic_numbers_audio/፯_7.mp3'),
        'numbers/8': require('../../assets/audio/Lisan Audio File/amharic_numbers_audio/፰_8.mp3'),
        'numbers/9': require('../../assets/audio/Lisan Audio File/amharic_numbers_audio/፱_9.mp3'),
        'numbers/10': require('../../assets/audio/Lisan Audio File/amharic_numbers_audio/፲_10.mp3'),
        
        // Colors - from your colors_audio folder
        'colors/red': require('../../assets/audio/Lisan Audio File/colors_audio/qey.mp3'),
        'colors/blue': require('../../assets/audio/Lisan Audio File/colors_audio/semayawi.mp3'),
        'colors/green': require('../../assets/audio/Lisan Audio File/colors_audio/arenguade.mp3'),
        'colors/yellow': require('../../assets/audio/Lisan Audio File/colors_audio/brtukanma.mp3'),
        'colors/black': require('../../assets/audio/Lisan Audio File/colors_audio/tikur.mp3'),
        'colors/white': require('../../assets/audio/Lisan Audio File/colors_audio/nech.mp3'),
      };

      const soundKey = `${category}/${filename}`;
      const foundPath = audioMap[soundKey];
      
      if (foundPath) {
        console.log(`✅ Audio file found for: ${soundKey}`);
      } else {
        console.log(`❌ Audio file NOT found for: ${soundKey}`);
        console.log(`📋 Available audio files:`, Object.keys(audioMap));
      }
      
      return foundPath || null;
    } catch (error) {
      console.warn(`💥 Error accessing audio file: ${category}/${filename}`, error);
      return null;
    }
  }

  /**
   * Preload audio files for a lesson
   */
  async preloadLessonAudio(lessonId: string, audioFiles: string[]): Promise<void> {
    try {
      for (const audioFile of audioFiles) {
        const [category, filename] = audioFile.split('/');
        if (category && filename) {
          const audioPath = this.getAudioPath(category, filename);
          if (audioPath) {
            const { sound } = await Audio.Sound.createAsync(audioPath);
            this.sounds.set(audioFile, sound);
          }
        }
      }
    } catch (error) {
      console.error('Error preloading audio:', error);
    }
  }

  /**
   * Unload a specific sound from memory
   */
  private async unloadSound(soundKey: string): Promise<void> {
    const sound = this.sounds.get(soundKey);
    if (sound) {
      await sound.unloadAsync();
      this.sounds.delete(soundKey);
    }
  }

  /**
   * Unload all sounds from memory
   */
  async unloadAllSounds(): Promise<void> {
    for (const [key, sound] of this.sounds) {
      await sound.unloadAsync();
    }
    this.sounds.clear();
  }

  /**
   * Set up audio session (call this when the app starts)
   */
  async initializeAudio(): Promise<void> {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false
      });
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }
}

export const audioService = new AudioService();

// Helper function to create placeholder audio files
export const createPlaceholderAudioFiles = () => {
  const categories = ['alphabets', 'greetings', 'numbers'];
  const instructions = [];
  
  instructions.push('To use your Amharic voice files, please:');
  instructions.push('1. Create the following directories if they don\'t exist:');
  
  categories.forEach(category => {
    instructions.push(`   - assets/audio/${category}/`);
  });
  
  instructions.push('2. Add your audio files (.mp3 format recommended) to the appropriate directories:');
  instructions.push('   Alphabets: ha.mp3, la.mp3, ma.mp3, etc.');
  instructions.push('   Greetings: hello.mp3, how_are_you.mp3, goodbye.mp3, etc.');
  instructions.push('   Numbers: one.mp3, two.mp3, three.mp3, etc.');
  instructions.push('3. Update the audioMap in AudioService.getAudioPath() with your actual file names');
  
  return instructions;
};
