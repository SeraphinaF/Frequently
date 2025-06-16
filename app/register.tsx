import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { auth, db } from '@/FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import  BaseLayout  from '@/components/ui/BaseLayout';
import { buttonStyles } from '@/src/styles/buttons';
import { colors } from '@/src/styles/colors';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';

const register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const signUp = async () => {
    if (!email.includes('@')) {
      alert('Voer een geldig e-mailadres in.');
      return;
    }
    if (password.length < 6) {
      alert('Wachtwoord moet minimaal 6 tekens zijn.');
      return;
    }
    try {
      console.log('Signing up user with email:', email.trim());
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      console.log('User created with uid:', user.uid);
  
      // Save the name and email in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email.trim(),
      });
      console.log('User document created in Firestore for:', user.uid);
  
      // Create initial progress documents for each card
      const cardsSnapshot = await getDocs(collection(db, 'cards'));
      console.log(`Found ${cardsSnapshot.docs.length} cards to create progress for.`);
  
      for (const cardDoc of cardsSnapshot.docs) {
        const cardId = cardDoc.id;
        const progressDocRef = doc(db, 'userCardProgress', `${user.uid}_${cardId}`);
        await setDoc(progressDocRef, {
          userId: user.uid,
          cardId,
          easinessFactor: 2.5,
          repetitionCount: 0,
          interval: 0,
          nextReviewDate: null,
          lastReviewedDate: null,
        });
        console.log(`Progress document created for card ${cardId}`);
      }
  
      console.log('All user progress documents created successfully.');
  
      // Redirect to home screen
      router.replace('/homeScreen');
  
    } catch (error: any) {
      console.log('Error during sign up:', error);
      alert('Registratie mislukt: ' + error.message);
    }
  };  

  return (
    <BaseLayout>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Hi, welkom bij Frequently!</Text>
        <Text style={styles.subTitle}>Laten we beginnen. Vul hieronder je gegevens in.</Text>
        <TextInput placeholder='Naam' value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder='E-mailadres' value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
        <TextInput placeholder='Wachtwoord' value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
        <TouchableOpacity onPress={signUp} style={[buttonStyles.buttonPrimary, styles.button]}>
          <Text style={[buttonStyles.textPrimary]}>Aanmelden</Text>
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Heb je al een account?{' '}
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.link}>Inloggen</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </SafeAreaView>
    </BaseLayout>
  )
}

export default register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 32,
    marginBottom: 8,
  },
  subTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '200',
    marginBottom: 8,
  },
  input: {
    color: colors.white,
    fontSize: 16,
    height: 56,
    padding: 10,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginTop: 16,
  },
  button: {
    marginTop: 32,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  text: {
    color: colors.white,
    textAlign: 'center',
    maxWidth: 209,
  },
  link: {
    color: colors.secondary,
  },
});
