import React, { useState } from 'react'
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import {  getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { buttonStyles } from '@/src/styles/buttons';
import { colors } from '@/src/styles/colors';

const index = () => {
  const auth = getAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    const user = await signInWithEmailAndPassword(auth, email.trim(), password);
    if (user) router.replace('/homescreen');
  } catch (error: any) {
    console.log(error)
    alert('Sign in failed: ' + error.message);
  }
};


  return (
    <BaseLayout>
      <SafeAreaView style={styles.container}>
        <TextInput placeholder='E-mailadres' value={email} onChangeText={setEmail} style={styles.input}></TextInput>
        <TextInput placeholder='Wachtwoord' value={password} onChangeText={setPassword} style={styles.input}></TextInput>
        <TouchableOpacity onPress={signIn} style={[buttonStyles.buttonPrimary, styles.button]}>
          <Text style={[buttonStyles.textPrimary]}>Login</Text>
        </TouchableOpacity>
        <View style={styles.textContainer}>
        <Text style={styles.text}>Nog geen account? <Link href='/register' style={styles.link}>Aanmelden</Link></Text>
        </View>
      </SafeAreaView>
    </BaseLayout>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  input:{
    color: colors.white,
    fontSize: 16,
    fontWeight: 'light',
    height: 56,
    padding: 10,
    borderRadius: 15,
    backgroundColor: colors.tertiary,
    marginTop: 16,
  },
  button:{
    marginTop: 32,
  },
  textContainer:{
    width: '100%',
    alignItems: 'center',
    marginTop: 16
  },
  text:{
    color: colors.white,
    textAlign: 'center',
    maxWidth: 209,
  },
  link:{
    color: colors.secondary
  }

});
