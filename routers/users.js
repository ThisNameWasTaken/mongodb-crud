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

const _ = fn => (req, res, next, ...args) =>
  fn(req, res, next, ...args).catch(next);

router.post(
  '/log-in',
  _(async (req, res) => {
    const userData = req.body;
    const { email } = userData;

    MongoClient.connect(url, async (err, client) => {
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
  })
);

router.post(
  '/register',
  _(async (req, res) => {
    const userData = req.body;
    const { email } = userData;

    MongoClient.connect(url, async (err, client) => {
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
  })
);

router.put(
  '/update-info',
  _(async (req, res) => {
    const userData = req.body;
    const { email } = userData;

    MongoClient.connect(url, async (err, client) => {
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
  })
);

router.delete(
  '/delete-account',
  _(async (req, res) => {
    const userData = req.body;
    const { email } = userData;

    MongoClient.connect(url, async (err, client) => {
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
  })
);

module.exports = router;
