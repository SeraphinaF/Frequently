import { BaseLayout } from '@/components/ui/BaseLayout';
import { auth } from '@/FirebaseConfig';
import { getAuth } from '@firebase/auth';
import { router } from 'expo-router';
import React from 'react'
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';

function homescreen() {
    getAuth().onAuthStateChanged((user) => {
    if(!user) router.replace('/')
    })

  return (
    <BaseLayout>
        <SafeAreaView>
        <Text>Welkom</Text>
        <TouchableOpacity onPress={() => auth.signOut()}><Text>Uitloggen</Text></TouchableOpacity>
        </SafeAreaView>
    </BaseLayout>
  )
}

export default homescreen
