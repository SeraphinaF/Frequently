import BaseLayout from '@/components/ui/BaseLayout';
import { useNavigation } from "@react-navigation/native";
import { db } from '@/FirebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image
} from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { colors } from '@/src/styles/colors';
import DonutChart from '@/components/ui/DonutChart';
import { StatusBar } from 'expo-status-bar';

import logoutIcon from '../assets/images/logoutIcon.png';
import playIcon from '../assets/images/playIcon.png';
import listIcon from '../assets/images/listIcon.png';

export default function HomeScreen() {
  const navigation = useNavigation();
  const auth = getAuth();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await AsyncStorage.setItem("userId", user.uid);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", userId));
        if (snap.exists()) {
          const name = snap.data().name as string;
          setUserName(name);
          await AsyncStorage.setItem('userName', name);
        }
      } catch (e) {
        console.error("Error fetching user:", e);
      }
    })();
  }, [userId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => auth.signOut()} style={styles.logoutWrapper}>
          <Image source={logoutIcon} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Uitloggen</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>
          Welkom bij Frequently
        </Text>
      </View>

      {/* Progress Card */}
      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Jouw voortgang</Text>
        <DonutChart
          percentage={27}
          radius={100}
          strokeWidth={20}
          color={colors.primary}
        />
      </View>

      {/* Buttons Card */}
      <View style={styles.buttonCard}>
        {/* Primary Button */}
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate("flashCard")}
        >
          <View style={styles.buttonContent}>
            <Image
              source={playIcon}
              style={[styles.icon, { tintColor: colors.white }]}
            />
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              Let's start!
            </Text>
          </View>
        </TouchableOpacity>

        {/* Outline Button */}
        <TouchableOpacity
          style={[styles.button, styles.outlineButton]}
          onPress={() => navigation.navigate("wordList")}
        >
          <View style={styles.buttonContent}>
            <Image
              source={listIcon}
              style={[
                styles.icon,
                { tintColor: colors.tertiary, width: 18, height: 18 }
              ]}
            />
            <Text style={[styles.buttonText, styles.outlineButtonText]}>
              Woordenlijst
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },

  header: {
    marginTop: 16,
    marginHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  greeting: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.tertiary,
    textAlign: 'center',
  },
  logoutWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutIcon: {
    width: 18,
    height: 18,
    marginRight: 6,
    resizeMode: 'contain',
  },
  logoutText: {
    fontSize: 16,
    color: '#989898',
  },

  progressCard: {
    backgroundColor: '#FFFFFF',
    margin: 24,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  progressTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.tertiary,
    marginBottom: 12,
  },

  buttonCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    paddingVertical: 32,
    borderRadius: 20,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },


  button: {
    width: '80%',
    paddingVertical: 16,
    borderRadius: 15,
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    paddingLeft: 0,            
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
    resizeMode: 'contain',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: 'Nunito',
  },

  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: colors.white,
  },

  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  outlineButtonText: {
    color: colors.tertiary,
  },
});
