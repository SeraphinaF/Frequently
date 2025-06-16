import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/src/styles/colors';
import { updateUserCardProgress } from '@/updateUserCardProgress';
import { getAuth } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FeedbackButtonsProps {
  cardId: string;
  nextCard: () => void;
  onFeedbackComplete?: () => void;
  handleUserFeedback: (quality: 1 | 2 | 3 | 4) => void;
}

export default function FeedbackButtons({ cardId, onFeedbackComplete, handleUserFeedback, nextCard }: FeedbackButtonsProps) {
  const auth = getAuth();
  const user = auth.currentUser;

  const handleFeedback = async (cardId: string, quality: 1 | 2 | 3 | 4,) => {
    if (!user?.uid) return;

    await updateUserCardProgress({
      userId: user.uid,
      cardId,
      quality,
    });
    onFeedbackComplete?.();
    handleUserFeedback(quality);
  };

  return (
    <View>
      <Text style={styles.feedbackTextScale}>
        Hoe lastig vind je dit woord op een schaal van 1-4?
      </Text>
      <View style={styles.buttonsRow}>
        <Text style={styles.label}>Makkelijk</Text>
        <Text style={styles.buttonOne} onPress={() => handleFeedback(cardId, 1)}>1</Text>
        <Text style={styles.buttonTwo} onPress={() => handleFeedback(cardId, 2)}>2</Text>
        <Text style={styles.buttonThree} onPress={() => handleFeedback(cardId, 3)}>3</Text>
        <Text style={styles.buttonFour} onPress={() => handleFeedback(cardId, 4)}>4</Text>
        <Text style={styles.label}>Moeilijk</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  feedbackTextScale: {
    color: colors.black,
    paddingHorizontal: 40,
    fontSize: 16,
    fontWeight: '100',
    textAlign: 'center',
    marginBottom: 12,
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
    fontWeight: '500',
  },
  buttonOne: {
    color: colors.black,
    paddingHorizontal: 14,
    paddingVertical: 20,
    backgroundColor: 'rgba(12, 16, 73, 0.1)',
    borderRadius: 15,
  },
  buttonTwo: {
    color: colors.black,
    paddingHorizontal: 14,
    paddingVertical: 20,
    backgroundColor: 'rgba(12, 16, 73, 0.2)',
    borderRadius: 15,
  },
  buttonThree: {
    color: colors.black,
    paddingHorizontal: 14,
    paddingVertical: 20,
    backgroundColor: 'rgba(12, 16, 73, 0.4)',
    borderRadius: 15,
  },
  buttonFour: {
    color: colors.black,
    paddingHorizontal: 14,
    paddingVertical: 20,
    backgroundColor: 'rgba(12, 16, 73, 0.6)',
    borderRadius: 15,
  },
});
