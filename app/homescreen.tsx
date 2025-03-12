import { BaseLayout } from '@/components/ui/BaseLayout';
import { auth } from '@/FirebaseConfig';
import { getAuth } from '@firebase/auth';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';;
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { colors } from '@/src/styles/colors';

export default function HomeScreen(){

  return (
    <BaseLayout>
        <SafeAreaView>
        <TouchableOpacity onPress={() => auth.signOut()}><Text style={styles.logoutText}>Uitloggen</Text></TouchableOpacity>
        <View style={styles.container}>
        <Text style={styles.welcomText}>Welkom!</Text>
        </View>
        <TouchableOpacity><Text style={styles.logoutText}><Link href='/frontCard'>card</Link></Text></TouchableOpacity>
        </SafeAreaView>
    </BaseLayout>
  )
}

const styles = StyleSheet.create({
logoutText:{
    color: colors.white
},
container:{
    // flex:1,
    // justifyContent: 'center',
    // alignItems:'center'
},
 welcomText:{
    color: colors.white
 }
})

