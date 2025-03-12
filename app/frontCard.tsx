import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { SafeAreaView, Text, TouchableOpacity, TextInput, View, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/styles/colors';
import { BaseLayout } from '../components/ui/BaseLayout';
import { buttonStyles } from '../src/styles/buttons';
import ProgressBar from '@/components/ui/ProgressBar';
import { Link } from 'expo-router';
import { db } from '@/FirebaseConfig'; 


export default function FrontCard() {
  const [dutchWord, setDutchWord] = useState('');

  useEffect(() => {
    const fetchCards = async () => {
      const querySnapshot = await getDocs(collection(db, 'cards'));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        setDutchWord(data.dutchWord); 
      });
    };
    
    fetchCards();
  }, []);

  return (
    <BaseLayout>
      <View style={styles.container}>
        <ProgressBar totalCards={0} remainingCards={0} />
        <SafeAreaView style={styles.content}>
          <Text style={styles.word}>{dutchWord}</Text> 
          <TextInput style={styles.input} placeholder="Vul de spaanse vertaling in" />
          <TouchableOpacity style={[buttonStyles.buttonPrimary]}>
            <Text style={buttonStyles.textPrimary}><Link href='/backCard'>Laat zien</Link></Text>
          </TouchableOpacity>
        </SafeAreaView>
        <StatusBar style="light" />
      </View>
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  word: {
    color: colors.white,
    fontSize: 48,
  },
  input: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'light',
    height: 56,
    margin: 12,
    padding: 10,
    borderRadius: 15,
    width: '100%',
    backgroundColor: colors.tertiary,
    marginTop: 34,
    marginBottom: 80,
  },
});
