import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { Alert } from "react-native";

const GEOFENCE_TASK = "GEOFENCE_TASK";

// 🛠 Define the background task for geofencing
TaskManager.defineTask(GEOFENCE_TASK, async ({ data, error }) => {
  if (error) {
    console.error("Geofencing error:", error);
    return;
  }

  if (data) {
    const { eventType, region } = data;

    if (eventType === Location.GeofencingEventType.Enter) {
      if (region.identifier === "Home") {
        Alert.alert(
          "You are at home",
          "Do you want to work on your todo list?",
          [
            { text: "Yes", onPress: () => console.log("User wants to work") },
            { text: "No", style: "cancel" },
          ]
        );
      }
    }
  }
});

export async function setupGeofence() {
  try {
    const isGeofencingSupported = await Location.hasServicesEnabledAsync();
    console.log("Geofencing supported:", isGeofencingSupported);

    if (!isGeofencingSupported) {
      Alert.alert("Error", "Geofencing is not supported on this device.");
      return;
    }

    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== "granted") {
      Alert.alert("Permission Required", "Geofencing needs foreground location access.");
      return;
    }

    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== "granted") {
      Alert.alert("Permission Required", "Geofencing needs background location access.");
      return;
    }

    //  Step 3: Ensure Location Services are enabled
    const isLocationEnabled = await Location.hasServicesEnabledAsync();
    if (!isLocationEnabled) {
      Alert.alert("Location Disabled", "Please enable location services in settings.");
      return;
    }

    //  Step 4: Define the geofence region
    const geofenceRegions = [
      {
        identifier: "Home",
        latitude: 51.919854, 
        longitude: 4.511214, 
        radius: 500, 
        notifyOnEnter: true,
        notifyOnExit: false,
      },
    ];

    //  Step 5: Stop existing geofencing before starting new one
    await Location.stopGeofencingAsync(GEOFENCE_TASK);

    //  Step 6: Start geofencing
    await Location.startGeofencingAsync(GEOFENCE_TASK, geofenceRegions);
    console.log("Geofencing started successfully!");

  } catch (error) {
    console.error("Geofencing setup error:", error);
  }
}
