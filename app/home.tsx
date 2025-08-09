// import React from 'react';
// import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
// import { getAuth, signOut } from 'firebase/auth';
// import { useRouter } from 'expo-router';

// const categories = [
//     { id: '1', title: 'Greetings', color: '#FF6B6B' },
//     { id: '2', title: 'Numbers', color: '#6BCB77' },
//     { id: '3', title: 'Family', color: '#4D96FF' },
//     { id: '4', title: 'Food & Drink', color: '#FFD93D' },
//   ];

// // export default function HomeScreen() {
// //   const router = useRouter();
// //   const auth = getAuth();
  
// //   const handleSignOut = () => {
// //     signOut(auth)
// //       .then(() => {
// //         router.replace('/auth');
// //       })
// //       .catch(error => alert(error.message));
// //   };
  
// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Welcome to Lisan!</Text>
// //       <Text style={styles.subtitle}>Select a category to start learning.</Text>
// //       <Button title="Sign Out" onPress={handleSignOut} />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 20,
// //   },
// //   title: {
// //     fontSize: 24,
// //     marginBottom: 10,
// //     textAlign: 'center',
// //   },
// //   subtitle: {
// //     fontSize: 16,
// //     marginBottom: 20,
// //     textAlign: 'center',
// //   },
// // });


// // import React from 'react';
// // import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
// // import { getAuth, signOut } from 'firebase/auth';
// // import { useRouter } from 'expo-router';



// export default function HomeScreen() {
//   const router = useRouter();
//   const auth = getAuth();

//   const handleSignOut = () => {
//     signOut(auth)
//       .then(() => {
//         router.replace('/auth');
//       })
//       .catch((error) => alert(error.message));
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to Lisan!</Text>
//       <Text style={styles.subtitle}>Pick a category to start learning:</Text>
      
//       <FlatList
//         data={categories}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity style={[styles.card, { backgroundColor: item.color }]}
//             onPress={() => router.push(`/lesson/${item.id}` as any)}>
//             <Text style={styles.cardText}>{item.title}</Text>
//           </TouchableOpacity>
//         )}
//       />

//       <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
//         <Text style={styles.signOutText}>Sign Out</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: 'black',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     // textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 18,
//     marginBottom: 20,
//     // textAlign: 'center',
//   },
//   card: {
//     padding: 20,
//     borderRadius: 5,
//     marginBottom: 15,
//     textAlign: 'left',          // Add this
//     alignSelf: 'flex-start',   // Add this
//     // alignItems: 'center',
//   },
//   cardText: {
//     fontSize: 20,
//     color: '#fff',
//     fontWeight: 'bold',
//     textAlign: 'left',          // Add this
//     alignSelf: 'flex-start',   // Add this
//   },
//   signOutButton: {
//     marginTop: 20,
//     padding: 15,
//     backgroundColor: '#FF6B6B',
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   signOutText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// // Let me know if you want me to add progress tracking or a profile section! 🚀






import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { Audio } from 'expo-av';
import { sampleLessons } from './services/lessonData';
import { UserProgressService } from './services/UserProgressService';
import { audioService } from './services/AudioService';

export default function HomeScreen() {
  const router = useRouter();
  const auth = getAuth();
  const [sound, setSound] = useState();
  const [userStats, setUserStats] = useState({ totalXP: 0, hearts: 5, unlockedLessons: ['1', '2'] });
  const [lessons, setLessons] = useState(sampleLessons || []);
  const [isLoading, setIsLoading] = useState(true);
  
  // Calculate circle sizes and path based on screen dimensions
  const screenWidth = Dimensions.get('window').width;
  const circleSize = screenWidth * 0.2;
  const lineWidth = screenWidth * 0.12;

  useEffect(() => {
    loadUserData();
    initializeAudio();
  }, []);

  const initializeAudio = async () => {
    await audioService.initializeAudio();
  };

  const loadUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userData = await UserProgressService.getUserData(user.uid);
        if (userData) {
          setUserStats({
            totalXP: userData.totalXP,
            hearts: userData.hearts,
            unlockedLessons: userData.unlockedLessons
          });
          
          // Update lessons with user progress - ensure sampleLessons exists
          if (sampleLessons && sampleLessons.length > 0) {
            const updatedLessons = sampleLessons.map(lesson => ({
              ...lesson,
              isLocked: !userData.unlockedLessons.includes(lesson.id),
              completed: userData.completedLessons.includes(lesson.id)
            }));
            setLessons(updatedLessons);
          }
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        router.replace('/auth');
      })
      .catch((error) => alert(error.message));
  };
  
  async function playSound(category: string, filename: string) {
    try {
      await audioService.playAudio(category, filename);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <Text style={styles.logo}>Lisan</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="book" size={24} color="#fff" />
          <Text style={styles.menuText}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="award" size={24} color="#fff" />
          <Text style={styles.menuText}>Ranks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile' as any)}>
          <Feather name="user" size={24} color="#fff" />
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
          <Feather name="log-out" size={24} color="#fff" />
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <Text style={styles.title}>My Learning Path</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Feather name="zap" size={20} color="#FFD700" />
              <Text style={styles.statText}>{userStats.totalXP} XP</Text>
            </View>
            <View style={styles.statItem}>
              <Feather name="heart" size={20} color="#FF6B6B" />
              <Text style={styles.statText}>{userStats.hearts}</Text>
            </View>
          </View>
        </View>
        
        {/* Scrollable Lesson Path */}
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.pathContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading lessons...</Text>
              </View>
            ) : lessons && lessons.length > 0 ? (
              lessons.map((lesson, index) => {
                // Determine if we need to draw a connecting line
                const showLine = index < lessons.length - 1;
                // Zigzag effect
                const isEven = index % 2 === 0;
                
                return (
                  <View key={lesson.id} style={styles.lessonSection}>
                    <TouchableOpacity
                      style={[
                        styles.lessonCircle,
                        { backgroundColor: lesson.color, width: circleSize, height: circleSize },
                        lesson.isLocked && styles.lockedLesson
                      ]}
                      disabled={lesson.isLocked}
                      onPress={() => {
                        playSound(lesson.title.toLowerCase(), 'intro');
                        router.push(`/lesson/${lesson.id}` as any);
                      }}
                    >
                      <Feather 
                        name={lesson.isLocked ? 'lock' : (lesson.icon as any)} 
                        size={circleSize * 0.4} 
                        color="#fff" 
                      />
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    </TouchableOpacity>
                    
                    {/* Path connector */}
                    {showLine && (
                      <View 
                        style={[
                          styles.pathLine,
                          isEven ? styles.pathLineRight : styles.pathLineLeft,
                          { width: lineWidth }
                        ]}
                      />
                    )}
                  </View>
                );
              })
            ) : (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>No lessons available</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#111111',
  },
  sidebar: {
    width: 80,
    paddingVertical: 40,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#58CC02',
    marginBottom: 40,
  },
  menuItem: {
    alignItems: 'center',
    marginBottom: 30,
  },
  menuText: {
    color: '#fff',
    marginTop: 5,
    fontSize: 12,
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  pathContainer: {
    alignItems: 'center',
  },
  lessonSection: {
    alignItems: 'center',
    marginBottom: 15,
  },
  lessonCircle: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 2,
  },
  lockedLesson: {
    opacity: 0.7,
  },
  lessonTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 14,
  },
  pathLine: {
    height: 50,
    backgroundColor: '#58CC02',
    position: 'absolute',
    zIndex: 1,
  },
  pathLineRight: {
    transform: [{ rotate: '30deg' }],
    top: '90%', 
  },
  pathLineLeft: {
    transform: [{ rotate: '-30deg' }],
    top: '90%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});