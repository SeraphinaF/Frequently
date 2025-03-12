import { SQLiteProvider, SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useFocusEffect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import 'react-native-reanimated';

export default function RootLayout() {
  const createDbIfNeeded = async (db: SQLiteDatabase) => {
    console.log('creating databse if needed')
    await db.execAsync(
    "CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT);"
    );
  };

  return (
    <SQLiteProvider databaseName="test.db" onInit={createDbIfNeeded}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="modal" />
        <Stack.Screen name="register" />
        <Stack.Screen name="frontCard" />
        <Stack.Screen name="backCard" />
        <Stack.Screen name="homeScreen" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </SQLiteProvider>
  );  
}
