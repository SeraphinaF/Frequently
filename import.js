const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(), 
  databaseURL: 'https://frequently-62242.firebaseio.com'
});

const db = admin.firestore();

// Read the JSON file
const data = JSON.parse(fs.readFileSync('19-words.json'));

// Import the data into Firestore
data.forEach(async (item) => {
  const docRef = db.collection('cards').doc(item.id);
  await docRef.set(item);
  console.log(`Document ${item.id} added`);
});
