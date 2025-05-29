import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/src/styles/colors';
import { updateUserCardProgress } from '@/updateUserCardProgress';
import { getAuth } from 'firebase/auth';

interface FeedbackButtonsProps {
    cardId: string;
    onFeedbackComplete?: () => void;
    handleFeedback: (quality: '1' | '2' | '3' | '4') => void;
  }
  
export default function FeedbackButtons({ cardId, onFeedbackComplete }: FeedbackButtonsProps) {
 const auth = getAuth();
    const user = auth.currentUser;

  const handleFeedback = async (cardId: string, quality: '1' | '2' | '3' | '4') => {
    if (!user?.uid) return;

    await updateUserCardProgress({
      userId: user.uid,
      cardId,
      quality: parseInt(quality),
    });

    onFeedbackComplete?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsRow}>
        <Text style={styles.label}>Makkelijk</Text>
        <Text style={styles.buttonOne} onPress={() => handleFeedback(cardId, '1')}>1</Text>
        <Text style={styles.buttonTwo} onPress={() => handleFeedback(cardId, '2')}>2</Text>
        <Text style={styles.buttonThree} onPress={() => handleFeedback(cardId, '3')}>3</Text>
        <Text style={styles.buttonFour} onPress={() => handleFeedback(cardId, '4')}>4</Text>
        <Text style={styles.label}>Moeilijk</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  text: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  label: {
    color: colors.black,
  },
  buttonOne: {
    color: colors.black,
    paddingHorizontal: 14,
    paddingVertical: 20,
    backgroundColor: '#A0B01399',
    borderRadius: 15,
  },
  buttonTwo: {
    color: colors.black,
    paddingHorizontal: 14,
    paddingVertical: 20,
    backgroundColor: '#A0B01366',
    borderRadius: 15,
  },
  buttonThree: {
    color: colors.black,
    paddingHorizontal: 14,
    paddingVertical: 20,
    backgroundColor: '#F7258566',
    borderRadius: 15,
  },
  buttonFour: {
    color: colors.black,
    paddingHorizontal: 14,
    paddingVertical: 20,
    backgroundColor: '#F7258599',
    borderRadius: 15,
  },
});
