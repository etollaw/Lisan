# Lisan - Amharic Language Learning App

A Duolingo-style mobile application for learning Amharic, built with React Native and Expo.

## Features

- 🔤 **Alphabet Learning**: Master the Amharic Fidel script
- 👋 **Essential Greetings**: Learn common Amharic greetings  
- 🔢 **Numbers**: Count from 1-10 in Amharic
- 🎵 **Audio Support**: Native Amharic pronunciation
- 📊 **Progress Tracking**: XP, streaks, and achievements
- ❤️ **Hearts System**: Gamified learning experience
- 🏆 **Achievements**: Unlock badges as you progress

## Project Structure

```
app/
├── lesson/              # Lesson screens
│   └── [id].tsx        # Dynamic lesson screen
├── models/             # Data types and interfaces
│   └── types.ts        # Core data models
├── services/           # Business logic and data services
│   ├── AudioService.ts    # Audio playback management
│   ├── lessonData.ts     # Lesson content and data
│   └── UserProgressService.ts # User progress tracking
├── components/         # Reusable UI components
│   └── ui/            # UI component library
├── styles/            # Global styles
├── auth.tsx           # Authentication screen
├── home.tsx           # Main learning dashboard
├── profile.tsx        # User profile and statistics
├── index.tsx          # App entry point
└── firebaseConfig.ts  # Firebase configuration

assets/
└── audio/             # Amharic voice files
    ├── alphabets/     # Letter pronunciations
    ├── greetings/     # Common greetings
    └── numbers/       # Number pronunciations
```

## Setting Up Your Amharic Audio Files

### 1. Audio File Structure

Create the following directory structure in your `assets/audio/` folder:

```
assets/audio/
├── alphabets/
│   ├── ha.mp3         # ሀ pronunciation
│   ├── la.mp3         # ለ pronunciation
│   ├── ma.mp3         # መ pronunciation
│   └── intro.mp3      # Alphabets lesson intro
├── greetings/
│   ├── hello.mp3      # ሰላም (selam)
│   ├── how_are_you.mp3 # እንዴት ናት? (indet nat?)
│   ├── goodbye.mp3    # ደህና ሁን (dehna hun)
│   └── intro.mp3      # Greetings lesson intro
└── numbers/
    ├── one.mp3        # አንድ (and)
    ├── two.mp3        # ሁለት (hulet)
    ├── three.mp3      # ሶስት (sost)
    └── intro.mp3      # Numbers lesson intro
```

### 2. Audio File Requirements

- **Format**: MP3 (recommended) or WAV
- **Quality**: 44.1kHz, 16-bit minimum
- **Duration**: Keep recordings under 5 seconds for individual words
- **Volume**: Normalize all files to consistent volume levels
- **Naming**: Use lowercase, no spaces or special characters

### 3. Recording Your Amharic Pronunciations

When recording your Amharic audio files:

1. **Clear pronunciation**: Speak clearly and at a moderate pace
2. **Consistent tone**: Maintain the same energy level across recordings
3. **Native accent**: Use authentic Amharic pronunciation
4. **Silent padding**: Add 0.5s of silence at the beginning and end
5. **Background noise**: Record in a quiet environment

### 4. Updating the Audio Service

After adding your audio files, update the `audioMap` in `app/services/AudioService.ts`:

```typescript
const audioMap: Record<string, any> = {
  // Alphabets
  'alphabets/ha': require('../../assets/audio/alphabets/ha.mp3'),
  'alphabets/la': require('../../assets/audio/alphabets/la.mp3'),
  // Add your new audio files here...
};
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd Lisan
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Update `app/firebaseConfig.ts` with your config

4. **Add your audio files**
   - Record Amharic pronunciations
   - Place them in the `assets/audio/` structure
   - Update the AudioService configuration

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on device/simulator**
   ```bash
   npm run android    # Android
   npm run ios        # iOS
   ```

## Data Models

### Lesson Structure
Each lesson contains:
- Multiple exercises (multiple choice, translation, listening)
- Audio files for pronunciation
- Amharic text with English translations
- Progress tracking and scoring

### User Progress
Tracks:
- XP (experience points)
- Daily streak
- Hearts (lives)
- Completed lessons
- Unlocked content

### Exercise Types
- **Multiple Choice**: Select correct translation
- **Translation**: Type the English meaning
- **Listening**: Identify spoken Amharic
- **Pronunciation**: (Future feature)

## Customization

### Adding New Lessons

1. **Create lesson data** in `services/lessonData.ts`
2. **Add audio files** to appropriate category folder
3. **Update unlock requirements** in `UserProgressService.ts`
4. **Test the lesson flow**

### Modifying UI

The app uses a dark theme inspired by Duolingo:
- Primary green: `#58CC02`
- Background: `#111111`
- Cards: `#1E1E1E`
- Error red: `#FF6B6B`

### Firebase Integration

User data is stored in Firestore with collections:
- `users`: User profiles and progress
- `lessonProgress`: Detailed lesson completion data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your Amharic content and audio
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Roadmap

- [ ] Add more lesson categories (Colors, Family, Food)
- [ ] Implement pronunciation recording and checking
- [ ] Add spaced repetition algorithm
- [ ] Create lesson editor for content creators
- [ ] Add social features (friends, leaderboards)
- [ ] Offline mode support
- [ ] Voice-to-text pronunciation checking

---

**Note**: This app is designed to help preserve and teach the Amharic language. Please ensure all content is culturally appropriate and linguistically accurate.
