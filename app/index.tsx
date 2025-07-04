import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import BaseLayout from '@/components/ui/BaseLayout';
import { buttonStyles } from '@/src/styles/buttons';
import { colors } from '@/src/styles/colors';
import { StatusBar } from 'expo-status-bar';


const auth = getAuth();

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/homeScreen');
      } else {
        console.log('No user logged in');
      }
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    if (!email.includes('@') || !email.includes('.')) {
      alert('Voer een geldig e-mailadres in.');
      return;
    }
    if (password.length < 6) {
      alert('Wachtwoord moet minimaal 6 tekens zijn.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/homeScreen');
    } catch (error: any) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
    }
  };

  return (
    <BaseLayout>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Welkom terug!</Text>
        <Text style={styles.subTitle}>We gaan gewoon weer verder waar je gebleven was</Text>
        <TextInput
          placeholder='E-mailadres'
          value={email}
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder='Wachtwoord'
          value={password}
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        <TouchableOpacity onPress={signIn} style={[buttonStyles.buttonPrimary, styles.button]}>
          <Text style={[buttonStyles.textPrimary]}>Login</Text>
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Nog geen account? <Link href='/register' style={styles.link}>Aanmelden</Link>
          </Text>
        </View>
      </SafeAreaView>
    </BaseLayout>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'nunito',
  },
  subTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '200',
    marginBottom: 8,
    fontFamily: 'nunito',
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
    color: colors.primary,
    fontWeight: '700',
  },
});
