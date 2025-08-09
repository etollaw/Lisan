import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { UserProgressService } from './services/UserProgressService';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const auth = getAuth();
  
  const handleAuth = async () => {
    if (isLoading) return; // Prevent multiple attempts
    
    setIsLoading(true);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User signed up:', userCredential.user);
        
        // Initialize user data in Firestore
        await UserProgressService.initializeUser(userCredential.user.uid, userCredential.user.email || '');
        
        router.replace('/home');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in:', userCredential.user);
        
        // Update streak on login
        await UserProgressService.updateStreak(userCredential.user.uid);
        
        router.replace('/home');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Handle specific Firebase auth errors
      let errorMessage = 'An error occurred. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Please sign in instead or use a different email.';
          // Automatically switch to login mode
          setIsSignUp(false);
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters long.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please sign up first.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        default:
          errorMessage = error.message || 'An unexpected error occurred.';
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of your component is unchanged
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginVertical: 20 }} />
      ) : (
        <>
          <Button title={isSignUp ? 'Sign Up' : 'Login'} onPress={handleAuth} />
          <Button
            title={`Switch to ${isSignUp ? 'Login' : 'Sign Up'}`}
            onPress={() => setIsSignUp(!isSignUp)}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Your styles remain the same
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default AuthScreen;