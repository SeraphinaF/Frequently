// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth , getReactNativePersistence } from "firebase/auth"
import  ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { CACHE_SIZE_UNLIMITED, getFirestore, initializeFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6Id9pgoRdd3MokAT3NsLh-Z0EvnYp8R4",
  authDomain: "frequently-62242.firebaseapp.com",
  projectId: "frequently-62242",
  storageBucket: "frequently-62242.firebasestorage.app",
  messagingSenderId: "1034317450434",
  appId: "1:1034317450434:web:ea9792860f741654487f5b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app ,{
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app)
