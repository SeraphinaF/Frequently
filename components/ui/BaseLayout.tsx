import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface BaseLayoutProps {
  children: ReactNode;      
}

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <LinearGradient
      colors={['#5014D1', '#1D0C6B', '#0B053A']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {children}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
});
