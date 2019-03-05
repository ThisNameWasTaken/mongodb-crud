const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

const DB_NAME = 'test-db';

// MongoClient.connect(url, (err, client) => {
//   assert.strictEqual(err, null);

//   const db = client.db(DB_NAME);

//   const userCollection = db.collection('users');

//   // Rename the `user` field to `name`
//   userCollection.updateMany(
//     { user: { $regex: '.*' } },
//     { $rename: { user: 'name' } }
//   );
// });

router.post('/log-in', (req, res) => {
  MongoClient.connect(url, (err, client) => {
    assert.strictEqual(err, null);

    const db = client.db(DB_NAME);

    const userCollection = db.collection('users');

    const userData = req.body;
    const { email } = userData;

    userCollection.findOne({ email }).then(userEntry => {
      if (userEntry) {
        res.send('logged in');
      } else {
        res.send('must register first');
      }

      client.close();
    });
  });
});

router.post('/register', (req, res) => {
  MongoClient.connect(url, (err, client) => {
    assert.strictEqual(err, null);

    const db = client.db(DB_NAME);

    const userCollection = db.collection('users');

    const userData = req.body;
    const { email } = userData;

    userCollection.findOne({ email }).then(userEntry => {
      if (userEntry) {
        res.send('already registered');
      } else {
        userCollection.insertOne(userData);
        res.send('registered');
      }

      client.close();
    });
  });
});

router.put('/update-info', (req, res) => {
  MongoClient.connect(url, (err, client) => {
    assert.strictEqual(err, null);

    const db = client.db(DB_NAME);

    const userCollection = db.collection('users');

    const userData = req.body;
    const { email } = userData;

    userCollection.findOne({ email }).then(userEntry => {
      if (userEntry) {
        userCollection.updateOne({ email }, userData);
        res.send('user info updated');
      } else {
        res.send('must register first');
      }

      client.close();
    });
  });
});

router.delete('/delete-account', (req, res) => {
  MongoClient.connect(url, (err, client) => {
    assert.strictEqual(err, null);

    const db = client.db(DB_NAME);

    const userCollection = db.collection('users');

    const userData = req.body;
    const { email } = userData;

    userCollection.findOne({ email }).then(userEntry => {
      if (userEntry) {
        userCollection
          .deleteOne({ email })
          .then(() => res.send(`${email} has been removed`));
      } else {
        res.send('user not registered');
      }

      client.close();
    });
  });
});

module.exports = router;
