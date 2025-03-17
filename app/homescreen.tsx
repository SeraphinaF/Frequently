import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View, FlatList, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import * as SQLite from "expo-sqlite";
import { db } from '@/FirebaseConfig';
import { router } from "expo-router";
import { buttonStyles } from "@/src/styles/buttons";
import { BaseLayout } from "@/components/ui/BaseLayout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { setupGeofence } from "@/components/geofencing"; // ✅ Import the geofencing function

type TaskType = { id: number; task: string };

export default function HomeScreen() {
  const auth = getAuth();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const sqliteDb = SQLite.useSQLiteContext();

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
          setUserName(userDocSnap.data().name);
          await AsyncStorage.setItem('userName', userName);
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserName();
  }, [userId]);

  const loadData = async () => {
    try {
      const result = await sqliteDb.getAllAsync<TaskType>("SELECT * FROM tasks;");
      setTasks(result);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await sqliteDb.runAsync("DELETE FROM tasks WHERE id = ?;", [id]);
      loadData();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    setupGeofence(); // ✅ Start geofencing when the home screen loads
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <BaseLayout>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => auth.signOut()}>
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Welcome back, {userName}!</Text>
        <Text style={styles.title}>Here is your Todo List</Text>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskText}>{item.task}</Text>
              <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.closeBtn}>
                <Text>X</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <TouchableOpacity onPress={() => router.push("/modal")} style={[styles.button, buttonStyles.buttonPrimary]}>
          <Text style={buttonStyles.textPrimary}>Add New Task</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  logoutText: {
    color: "#ffffff",
    position: "absolute",
    right: 15,
    top: 20,
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "200",
    marginTop: 50,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  title: {
    color: "#3498db",
    fontSize: 48,
    fontWeight: "medium",
    marginBottom: 24,
  },
  taskItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#dcdcdc",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 8,
  },
  taskText: {
    fontSize: 18,
    color: "#2c3e50",
  },
  button: {
    marginTop: 20,
    alignSelf: "center",
    borderRadius: 8,
  },
  closeBtn: {
    backgroundColor: "#bdc3c7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },
});
