// Import necessary modules
const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-config.json'); // Adjust path if needed

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Example route for fetching pizza menu
app.get('/menu', async (req, res) => {
  try {
    const db = admin.firestore();
    const menuRef = db.collection('pizzas');
    const snapshot = await menuRef.get();

    if (snapshot.empty) {
      return res.status(404).send('No pizza menu found.');
    }

    const pizzas = [];
    snapshot.forEach(doc => pizzas.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(pizzas);
  } catch (error) {
    console.error('Error fetching pizza menu:', error);
    res.status(500).send('Error fetching pizza menu');
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
