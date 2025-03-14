// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth , getReactNativePersistence } from "firebase/auth"
import  ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { CACHE_SIZE_UNLIMITED, getFirestore, initializeFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app ,{
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app)
