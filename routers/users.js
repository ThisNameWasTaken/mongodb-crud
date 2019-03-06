const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

const DB_NAME = 'test-db';

// MongoClient.connect(url, (err, client) => {
//   if(err) throw err;

//   const db = client.db(DB_NAME);

//   const userCollection = db.collection('users');

//   // Rename the `user` field to `name`
//   userCollection.updateMany(
//     { user: { $regex: '.*' } },
//     { $rename: { user: 'name' } }
//   );
// });

router.post('/log-in', (req, res) => {
  const userData = req.body;
  const { email } = userData;

  MongoClient.connect(url, async (err, client) => {
    try {
      if (err) throw err;

      const db = client.db(DB_NAME);

      const userCollection = db.collection('users');

      const userEntry = await userCollection.findOne({ email });
      if (userEntry) {
        res.send('logged in');
      } else {
        res.send('must register first');
      }

      client.close();
    } catch (err) {
      res.send(`failed to log in ${email}`);
      client.close();
      throw err;
    }
  });
});

router.post('/register', (req, res) => {
  const userData = req.body;
  const { email } = userData;

  MongoClient.connect(url, async (err, client) => {
    try {
      if (err) throw err;

      const db = client.db(DB_NAME);

      const userCollection = db.collection('users');

      const userEntry = await userCollection.findOne({ email });
      if (userEntry) {
        res.send('already registered');
      } else {
        await userCollection.insertOne(userData);
        res.send(`${email} has been registered`);
      }

      client.close();
    } catch (err) {
      res.send(`failed to register ${email}`);
      client.close();
      throw err;
    }
  });
});

router.put('/update-info', (req, res) => {
  const userData = req.body;
  const { email } = userData;

  MongoClient.connect(url, async (err, client) => {
    try {
      if (err) throw err;

      const db = client.db(DB_NAME);

      const userCollection = db.collection('users');

      const userEntry = await userCollection.findOne({ email });
      if (userEntry) {
        await userCollection.updateOne({ email }, userData);
        res.send(`${email} has been updated`);
      } else {
        res.send('must register first');
      }

      client.close();
    } catch (err) {
      res.send(`failed to update ${email}`);
      client.close();
      throw err;
    }
  });
});

router.delete('/delete-account', (req, res) => {
  const userData = req.body;
  const { email } = userData;

  MongoClient.connect(url, async (err, client) => {
    try {
      if (err) throw err;

      const db = client.db(DB_NAME);

      const userCollection = db.collection('users');

      const userEntry = await userCollection.findOne({ email });
      if (userEntry) {
        await userCollection.deleteOne({ email });
        res.send(`${email} has been removed`);
      } else {
        res.send('user not registered');
      }

      client.close();
    } catch (err) {
      client.close();
      throw err;
    }
  });
});

module.exports = router;
