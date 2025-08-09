import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import 'expo-router/entry';
import { app } from './firebaseConfig'; // Import the initialized app

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const auth = getAuth();
    
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }
  
  // Redirect based on authentication status
  if (user) {
    return <Redirect href="/home" />;
  } else {
    return <Redirect href="/auth" />;
  }
}






