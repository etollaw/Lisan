# Lisan - Amharic Language Learning App

A modern Duolingo-style language learning app for Amharic, built with React Native and Expo.

## � Features

- **Interactive Lessons**: Learn Amharic through engaging exercises
- **Audio Pronunciation**: Native Amharic audio for all words and phrases
- **Progressive Learning**: Structured lessons from basic to advanced
- **User Progress Tracking**: Track your learning journey with Firebase
- **Multiple Exercise Types**: Listening, multiple choice, and more
- **Real Audio Collection**: Extensive Amharic audio library with 21+ categories

## 📱 Categories

- **Greetings**: Basic greetings and polite expressions
- **Numbers**: Numbers 1-10 and beyond
- **Colors**: Basic colors in Amharic
- **Animals**: Various animals and their names
- **Food & Drinks**: Common foods and beverages
- **Body Parts**: Human body parts
- **Nature**: Natural elements and phenomena
- **Occupations**: Jobs and professions
- **Time**: Days, months, time expressions
- **Family Relationships**: Family member terms
- **Feelings**: Emotions and feelings
- **And much more...**

## 🎵 Audio Integration

The app includes an extensive collection of native Amharic audio files:
- Over 21 audio categories
- Hundreds of pronunciation examples
- High-quality MP3 recordings
- Organized by topic and difficulty

## 🛠️ Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Firebase** for authentication and data storage
- **expo-av** for audio playback
- **expo-router** for navigation
- **Tailwind CSS** for styling

## 📂 Project Structure

```
app/
├── components/         # Reusable UI components
├── lesson/            # Lesson screens
├── models/            # TypeScript type definitions
├── services/          # Business logic and API services
└── styles/            # Styling files

assets/
└── audio/
    └── Lisan Audio File/    # Extensive Amharic audio collection
        ├── greeting_audio_files/
        ├── amharic_numbers_audio/
        ├── colors_audio/
        ├── amharic_animals_audio/
        └── ... (21+ categories)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/Lisan.git
cd Lisan
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project
   - Add your Firebase configuration to `app/firebaseConfig.ts`
   - Enable Authentication and Firestore

4. Start the development server:
```bash
npm start
```

5. Run on your device:
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal

## 🎯 Current Features

### ✅ Completed
- User authentication with Firebase
- Lesson navigation system
- Audio service integration
- Progress tracking
- Interactive exercises
- Responsive UI design

### 🔄 In Progress
- Audio playback optimization
- Additional lesson content
- Advanced exercise types

### 📋 Planned
- Offline mode
- Voice recognition
- Social features
- Achievement system
- Mobile app store deployment

## 🎨 UI/UX

The app features a modern, intuitive design inspired by popular language learning apps:
- Clean, minimalist interface
- Progress indicators
- Interactive buttons and feedback
- Responsive design for all screen sizes

## 🔊 Audio System

The audio system is built around a comprehensive mapping system:
- Category-based organization
- On-demand loading
- Error handling and fallbacks
- Debug logging for troubleshooting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

**Lisan** - Making Amharic language learning accessible and enjoyable! 🇪🇹
