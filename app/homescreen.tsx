import BaseLayout from '@/components/ui/BaseLayout';
import { useNavigation } from "@react-navigation/native";
import { db } from '@/FirebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { colors } from '@/src/styles/colors';
import { buttonStyles } from '@/src/styles/buttons'

  ;

export default function HomeScreen() {
  const navigation = useNavigation();
  const auth = getAuth();
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const getUser = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid)
        await AsyncStorage.setItem("userId", user.uid)
      }
    });
    return () => getUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchUserName = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserName(userDocSnap.data().name);
          await AsyncStorage.setItem('userName', userName)
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserName();
  }, [userId]);

  return (
    <BaseLayout>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.logoutWrapper}>
          <TouchableOpacity onPress={() => auth.signOut()}>
            <Text style={styles.logoutText}>Uitloggen</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.welcomText}>Welkom {userName}!</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.statsText}>
            <Text style={styles.statsNumber}>20</Text> Nieuwe woorden
          </Text>
          <Text style={styles.statsText}>
            <Text style={styles.statsNumber}>10</Text> Woorden herhalen
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("flashCard")}
          style={[styles.button, buttonStyles.buttonPrimary]}
        >
          <Text style={buttonStyles.textPrimary}>Start</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </BaseLayout>

  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  logoutWrapper: {
    alignItems: 'flex-end',
  },
  logoutText: {
    color: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    color: colors.white,
  },
  welcomText: {
    color: colors.white,
    fontSize: 32,
    marginTop: 56,
    textAlign: 'center',
  },
  statsText: {
    color: colors.white,
    fontSize: 20,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '300',
  },
  statsNumber: {
    fontWeight: '700',
    color: colors.white,
  },  
  button: {
    marginBottom: 16,
  },
});


