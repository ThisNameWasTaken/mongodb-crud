const express = require('express');
const User = require('../models/user');
const UserController = require('../controllers/user.controller');
const router = express.Router();

// GET
// get profile
router.get('/profile', function (req, res, next) {
  res.send(req.user);
});

// get by plate number
router.get('/plate', UserController.searchByPlate);

// PUT
// update-info
router.put('/update', UserController.update);

// GET
// getID
router.get('/getID', UserController.getId);

// change pass
router.put('/changepass', UserController.changePass);

// DELETE
// delete user
router.delete('/delete', UserController.delete);

module.exports = router;
