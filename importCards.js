const fs = require('fs');
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Delete all documents in 'cards' collection (batch delete, supports >500 docs)
async function deleteAllDocuments() {
  const collectionRef = db.collection('cards');
  const snapshot = await collectionRef.get();

  if (snapshot.empty) {
    console.log('No documents to delete.');
    return;
  }

  const batchSize = 500;
  let deleted = 0;

  const deleteBatch = async () => {
    const batch = db.batch();
    const docs = await collectionRef.limit(batchSize).get();

    if (docs.empty) {
      return false;
    }

    docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    deleted += docs.size;
    console.log(`Deleted ${docs.size} documents...`);
    return true;
  };

  // Repeat until no docs left
  while (await deleteBatch()) {}

  console.log(`Finished deleting ${deleted} documents.`);
}

// Upload new flashcards
async function uploadFlashcards() {
  const data = JSON.parse(fs.readFileSync('flashcards.json'));

  for (const item of data) {
    const docRef = db.collection('cards').doc(); // Auto ID
    await docRef.set(item);
    console.log(`Added document: ${docRef.id}`);
  }

  console.log('All flashcards uploaded.');
}

// Main function
async function main() {
  await deleteAllDocuments();
  await uploadFlashcards();
}

main().catch(console.error);
