import React, { useState } from 'react'
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { auth } from '@/FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { buttonStyles } from '@/src/styles/buttons';
import { colors } from '@/src/styles/colors';

const register = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      const user = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (user) router.replace('/homescreen');
    } catch (error: any) {
      console.log(error);
      alert('Registratie mislukt: ' + error.message);
    }
  };

  return (
    <BaseLayout>
      <SafeAreaView style={styles.container}>
        <TextInput placeholder='E-mailadres' value={email} onChangeText={setEmail} style={styles.input}></TextInput>
        <TextInput placeholder='Wachtwoord' value={password} onChangeText={setPassword} style={styles.input}></TextInput>
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

export default register

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'light',
    height: 56,
    padding: 10,
    borderRadius: 15,
    backgroundColor: colors.tertiary,
    marginTop: 16,
  },
  button: {
    marginTop: 32,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16
  },
  text: {
    color: colors.white,
    textAlign: 'center',
    maxWidth: 209,
  },
  link: {
    color: colors.secondary
  }

});
