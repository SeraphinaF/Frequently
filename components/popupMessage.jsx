import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { colors } from '@/src/styles/colors';

export default function PopupMessage({ message, messageStyle, additionalText, additionalTextStyle, boldText, visible, onClose }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start(() => onClose());
      }, 1500); 

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
    <View style={styles.popup}>
      <Text style={[styles.text, messageStyle]}>{message}</Text> 
      {additionalText && (
        <Text style={[styles.text, additionalTextStyle, { fontWeight: 'thin'}]}>
          {additionalText}
          <Text style={{ fontWeight: 'bold'}}> {boldText}</Text>
        </Text>
      )}
    </View>
  </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: colors.white,
    width: '100%',
    padding: 15,
    borderRadius: 18,
    elevation: 3,
    zIndex: 1000,
  },
  text: {
    color: colors.black,
    fontSize: 16,
  },
});
