import React, { ReactNode } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';

interface BaseLayoutProps {
  children: ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <ImageBackground
      source={require('@/assets/images/background-doodle.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
});
