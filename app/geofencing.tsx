import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { useFocusEffect } from '@react-navigation/native';

const GEOFENCE_TASK = 'GEOFENCE_TASK';

TaskManager.defineTask(GEOFENCE_TASK, ({ data, error }) => {
  if (error) {
    console.error('Geofencing error:', error);
    return;
  }
  if (data) {
    const { eventType, region } = data;
    if (eventType === Location.GeofencingEventType.Enter) {
      console.log(`Entered geofence: ${region.identifier}`);
      Alert.alert('Geofence Alert', `You entered ${region.identifier}`);
    } else if (eventType === Location.GeofencingEventType.Exit) {
      console.log(`Exited geofence: ${region.identifier}`);
    }
  }
});

export default function GeofencingComponent() {
  const [hasPermission, setHasPermission] = useState(false);

  const requestPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Geofencing requires location access.');
      return false;
    }
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      const setupGeofence = async () => {
        const permission = await requestPermissions();
        setHasPermission(permission);
        if (!permission) return;

        const geofenceRegions = [
          {
            identifier: 'Home',
            latitude: 51.919854, 
            longitude: 4.511214,
            radius: 100, 
            notifyOnEnter: true,
            notifyOnExit: true,
          },
        ];

        await Location.startGeofencingAsync(GEOFENCE_TASK, geofenceRegions);
        console.log('Geofencing started!');
      };

      setupGeofence();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Geofencing Example</Text>
      {hasPermission ? (
        <Text style={styles.status}>Geofencing is active.</Text>
      ) : (
        <Text style={styles.status}>Location permission is required.</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    color: 'gray',
  },
});
