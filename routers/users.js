const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const { NODE_ENV } = process.env;

require('express-async-errors');

// Connection URL
const url = config.db[NODE_ENV]['uri'];

const DB_NAME = config.db[NODE_ENV]['name'];

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

router.post('/log-in', async (req, res) => {
  const userData = req.body;
  const { email } = userData;

  MongoClient.connect(url, { useNewUrlParser: true }, async (err, client) => {
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
  });
});

router.post('/register', async (req, res) => {
  const userData = req.body;
  const { email } = userData;

  MongoClient.connect(url, { useNewUrlParser: true }, async (err, client) => {
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
  });
});

router.put('/update-info', async (req, res) => {
  const userData = req.body;
  const { email } = userData;

  MongoClient.connect(url, { useNewUrlParser: true }, async (err, client) => {
    if (err) throw err;

    const db = client.db(DB_NAME);

    const userCollection = db.collection('users');

    const userEntry = await userCollection.findOne({ email });
    if (userEntry) {
      await userCollection.updateOne({ email }, { $set: { ...userData } });
      res.send(`${email} has been updated`);
    } else {
      res.send('must register first');
    }

    client.close();
  });
});

router.delete('/delete-account', async (req, res) => {
  const userData = req.body;
  const { email } = userData;

  MongoClient.connect(url, { useNewUrlParser: true }, async (err, client) => {
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
  });
});

module.exports = router;
