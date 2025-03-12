import { BaseLayout } from '@/components/ui/BaseLayout';
import { useNavigation } from "@react-navigation/native";
import { db } from '@/FirebaseConfig';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { doc, getDoc} from 'firebase/firestore';
import { colors } from '@/src/styles/colors';
import { buttonStyles } from '@/src/styles/buttons';

export default function HomeScreen(){
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
        <SafeAreaView>
        <TouchableOpacity onPress={() => auth.signOut()}>
          <Text style={styles.logoutText}>Uitloggen</Text>
        </TouchableOpacity>
        <View style={styles.container}>
        <Text style={styles.welcomText}>Welkom {userName}!</Text>
        </View>
        <TouchableOpacity 
        onPress={() => navigation.navigate("frontCard")} 
        style={[styles.button, buttonStyles.buttonPrimary]}
        >
      <Text style={buttonStyles.textPrimary}>Start</Text>
    </TouchableOpacity>
        </SafeAreaView>
    </BaseLayout>
  )
}

const styles = StyleSheet.create({
logoutText:{
    color: colors.white,
    position: 'absolute',
    right: 0
},
container:{
    // flex:1,
    // justifyContent: 'center',
    // alignItems:'center'
},
 welcomText:{
    color: colors.white,
    fontSize: 32,
    marginTop: 56,
 },
 button:{
  marginTop: 160
 }
})

