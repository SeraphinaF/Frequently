import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import  BaseLayout  from '@/components/ui/BaseLayout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/src/styles/colors';
import ProgressBar from '@/components/ProgressBar';
import SoundIcon from '@/components/ui/SoundIcon'
import { db } from '@/FirebaseConfig';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';


export default function BackCard() {
  const [spanishWord, setSpanishWord] = useState('');
  const [spanishExample, setSpanishExample] = useState('')
  const [dutchExample, setDutchExample] = useState('')
  const [image, setImage] = useState('')

  useEffect(() => {
    const fetchCards = async () => {
      const querySnapshot = await getDocs(collection(db, 'cards'));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        setSpanishWord(data.spanish_word);
        setSpanishExample(data.spanish_example)
        setDutchExample(data.dutch_example)
        setImage(data.image_url)
      });
    };
    console.log(image)

    fetchCards();
  }, []);
  return (
    <BaseLayout>
      <View style={styles.container}>
        <ProgressBar totalCards={0} remainingCards={0} />
        <SafeAreaView style={styles.content}>
          <Image source={{uri: image}} style={[{ width: 350, height: 350 }, styles.image]} />
          <View style={styles.wordContainer}>
              <Text style={styles.word}>{spanishWord}</Text>
              <SoundIcon style={styles.soundIcon} />
          </View>
          <Text style={styles.exampleForeign}>{spanishExample}</Text>
          <Text style={styles.exampleNative}>{dutchExample}</Text>
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
    borderRadius: 5,
    margin: 10
  },
  wordContainer:{
    flexDirection: 'row',
    alignContent:'center',
    alignItems: 'center',
    margin: 16
  },
  word: {
    color: colors.secondary,
    fontSize: 48,
  },
  exampleForeign: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 300,
    textAlign: 'center',
    marginBottom: 24,
  },
  exampleNative: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 100,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 32,
  },
  feedbackButtons:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
    width: '100%'
  },
  buttonWrong:{
    color: '#CE3030',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 15
  },
  buttonDifficult:{
    color: '#FE7A0F',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 15
  },
  buttonEasy:{
    color: '#3E973B',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 15
  }
});
