import BaseLayout from '@/components/ui/BaseLayout';
import { useNavigation } from "@react-navigation/native";
import { db } from '@/FirebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { colors } from '@/src/styles/colors';
import { buttonStyles } from '@/src/styles/buttons';
import HorizontalLogo from '@/components/ui/HorizontalLogo';
import DonutChart from '@/components/ui/DonutChart';

export default function HomeScreen() {
  const navigation = useNavigation();
  const auth = getAuth();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const getUser = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await AsyncStorage.setItem("userId", user.uid);
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
          const name = userDocSnap.data().name;
          setUserName(name);
          await AsyncStorage.setItem('userName', name);
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

        <View style={styles.mainContent}>
          <View style={styles.startContent}>
            <View>
              <HorizontalLogo width={300} height={200} />
            </View>
          </View>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <DonutChart
              percentage={27}
              radius={120}
              strokeWidth={25}
              color="#252B7A"
            />
          </View>
          <View style={styles.endContent}>
        
            <TouchableOpacity
              onPress={() => navigation.navigate("flashCard")}
              style={[styles.button, buttonStyles.buttonPrimary]}
            >
                <Text style={styles.buttonText}>Let's start!</Text>
            </TouchableOpacity>
   
        </View>
      </View>
    </SafeAreaView>
    </BaseLayout >
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  logoutWrapper: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  logoutText: {
    color: colors.white,
  },
  mainContent: {
    flex: 1,
  },
  startContent: {
    alignItems: 'center',
  },
  title: {
    color: colors.black,
    fontFamily: 'Nunito',
    fontSize: 54,
    textAlign: 'center',
  },
  subTitle: {
    color: colors.black,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '800',
    fontFamily: 'Nunito',
  },
  welcomeContainer: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 15,
    marginBottom: 16,

  },
  welcomeText: {
    color: colors.black,
    fontSize: 24,
    fontFamily: 'Nunito',
    fontWeight: '700',
  },
  userName: {
    color: colors.primary,
  },
  welcomeStats: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Nunito',
  },
  statsContainer: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 15,
    marginBottom: 16,
    gap: 8,

  },
  statsText: {
    color: colors.black,
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Nunito',
  },
  statsNumber: {
    fontWeight: '700',
    color: colors.primary,
  },
  spanishList: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spanishListText: {
    color: colors.black,
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Nunito',
  },
  languageIcon: {
    width: 32,
    height: 32,
  },
  endContent: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '600',
    marginRight: 8,
    color: colors.tertiary,
  },
  button: {
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
});
