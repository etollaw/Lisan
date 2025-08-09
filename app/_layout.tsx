import React, { useEffect } from "react";
import { Stack } from "expo-router";
import '../firebase'; // Import Firebase to initialize it

export default function RootLayout() {
  useEffect(() => {
    // Firebase is initialized when the module is imported
    console.log('Firebase initialized');
  }, []);

  return <Stack />;
}
