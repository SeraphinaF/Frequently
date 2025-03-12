import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/src/styles/colors';
import ProgressBar from '@/components/ui/ProgressBar';
import SoundIcon from '@/components/ui/SoundIcon'
import { db } from '@/FirebaseConfig';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';


export default function BackCard() {
  const [spanishWord, setSpanishWord] = useState('');
  const [spanishExample, setSpanishExample] = useState('')
  const [translationExample, setTranslationExample] = useState('')
  const [wordType, setWordType] = useState('')

  useEffect(() => {
    const fetchCards = async () => {
      const querySnapshot = await getDocs(collection(db, 'cards'));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        setSpanishWord(data.spanishWord);
        setSpanishExample(data.spanishExample)
        setTranslationExample(data.translationExample)
        setWordType(data.wordType)
      });
    };

    fetchCards();
  }, []);
  return (
    <BaseLayout>
      <View style={styles.container}>
        <ProgressBar totalCards={0} remainingCards={0} />
        <SafeAreaView style={styles.content}>
          <Image source={require('@/assets/images/dog-ai.png')} style={[{ width: 350, height: 350 }, styles.image]} />
          <View style={styles.wordContainer}>
            <View>
              <SoundIcon style={styles.soundIcon} />
            </View>
            <Text style={styles.word}>{spanishWord}</Text>
          </View>
          <Text style={styles.type}>{wordType}</Text>
          <Text style={styles.exampleForeign}>{spanishExample}</Text>
          <Text style={styles.exampleNative}>{translationExample}</Text>
          <View style={styles.feedbackButtons}>
            <TouchableOpacity><Text style={styles.buttonWrong}>Fout</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.buttonDifficult}>Moeilijk</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.buttonEasy}>Makkelijk</Text></TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
  },
  image: {
    borderRadius: 15,
  },
  soundIcon: {
    backgroundColor: colors.white,
    padding: 4,
    margin:2,
    borderRadius: 5
  },
  wordContainer:{
    flexDirection: 'row'
  },
  word: {
    color: colors.white,
    fontSize: 48,
  },
  type: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 100,
    marginBottom: 32,
  },
  exampleForeign: {
    color: colors.white,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  exampleNative: {
    color: colors.white,
    fontWeight: 200,
    fontSize: 20,
    textAlign: 'center'
  },
  feedbackButtons:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
    width: '100%'
  },
  buttonWrong:{
    color: '#CE3030',
    backgroundColor: colors.tertiary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 15
  },
  buttonDifficult:{
    color: '#FE7A0F',
    backgroundColor: colors.tertiary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 15
  },
  buttonEasy:{
    color: '#3E973B',
    backgroundColor: colors.tertiary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 15
  }
});
