import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/src/styles/colors';
import { collection, doc, query, where, getDocs, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/FirebaseConfig'; // your firebase config import
import  superMemo  from '@/spacedRepitition';

type FeedbackButtonsProps = {
  handleFeedback: (level: '1' | '2' | '3' | '4') => void;
};

export default function FeedbackButtons({ handleFeedback }: FeedbackButtonsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonsRow}>
        <Text style={styles.label}>Makkelijk</Text>
        <Text style={styles.buttonOne} onPress={() => handleFeedback('1')}>
          1
        </Text>
        <Text style={styles.buttonTwo} onPress={() => handleFeedback('2')}>
          2
        </Text>
        <Text style={styles.buttonThree} onPress={() => handleFeedback('3')}>
          3
        </Text>
        <Text style={styles.buttonFour} onPress={() => handleFeedback('4')}>
          4
        </Text>
        <Text style={styles.label}>Moeilijk</Text>
      </View>
    </View>
  );
}

// async function getUserCardProgress(userId: string, cardId: string) {
//     const progressRef = collection(db, 'userCardProgress');
//     console.log(progressRef)
//     const q = query(progressRef, where('userId', '==', userId), where('cardId', '==', cardId));
//     const querySnapshot = await getDocs(q);
//     if (!querySnapshot.empty) {
//       const docSnap = querySnapshot.docs[0];
//       return { id: docSnap.id, ...docSnap.data() };
//     }
//     return null;
//   }
  
//   export async function handleFeedback(
//     level: '1' | '2' | '3' | '4',
//     userId: string,
//     cardId: string
//   ) {

//     const progress = await getUserCardProgress(userId, cardId);
  
//     // 2. Set default spaced repetition values if no progress
//     let prevEF = 2.5;
//     let prevInterval = 0;
//     let prevRepetitionCount = 0;
//     let docId = null;
  
//     if (progress) {
//       prevEF = progress.easinessFactor ?? prevEF;
//       prevInterval = progress.interval ?? prevInterval;
//       prevRepetitionCount = progress.repetitionCount ?? prevRepetitionCount;
//       docId = progress.id;
//     }
  
//     // 3. Calculate new spaced repetition values based on feedback
//     const { easinessFactor, interval, repetitionCount } = superMemo(
//       Number(level),
//       prevEF,
//       prevInterval,
//       prevRepetitionCount
//     );
  
//     // 4. Calculate dates
//     const lastReviewedDate = new Date();
//     const nextReviewDate = new Date();
//     nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  
//     // 5. Prepare new progress data
//     const progressData = {
//       userId,
//       cardId,
//       easinessFactor,
//       interval,
//       repetitionCount,
//       lastReviewedDate: lastReviewedDate.toISOString(),
//       nextReviewDate: nextReviewDate.toISOString(),
//     };
  
//     // 6. Update or create Firestore document
//     if (docId) {
//       const progressDocRef = doc(db, 'userCardProgress', docId);
//       await updateDoc(progressDocRef, progressData);
//     } else {
//       const progressRef = collection(db, 'userCardProgress');
//       await setDoc(doc(progressRef), progressData);
//     }
  
//     // 7. You can add UI feedback here if you want (popups etc)
//   }

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
