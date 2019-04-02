const User = require('../models/user');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const UserController = {};

UserController.delete = async (req, res, next) => {
    try {
        let { _id } = req.user;
        User.deleteOne({ _id }, (err) => {
            if (err) return next(createError(500, err.message));
            res.status(200).send('Succesfully deleted');
        });
    } catch (err) {
        return res.status(500).send('An error occurred: ' + err);
    }
}

UserController.update = async (req, res, next) => {
    try {
        let { _id } = req.user;
        User.updateOne({ _id }, { ...req.body }, (err) => {
            if (err) return next(createError(500, err.message));
            res.status(200).send('Succesfully updated');
        });
    } catch (err) {
        return res.status(500).send('An error occurred: ' + err);
    }
}

UserController.changePass = async (req, res, next) => {
    try {
        let { password } = req.body;
        User.findById(req.user._id).then(function (sanitizedUser) {
            if (sanitizedUser) {
                sanitizedUser.setPassword(password, function () {
                    sanitizedUser.save();
                    res.status(200).json({ message: 'password reset successful' });
                });
            } else {
                res.status(500).json({ message: 'This user does not exist' });
            }
        }, function (err) {
            console.error(err);
        })
    } catch (err) {
        return res.status(500).send('An error occurred: ' + err);
    }
}

UserController.searchByPlate = async (req, res, next) => {
    try {
        let { plate } = req.body;

        User.findOne({ plate }, function (err, user) {
            if (err) return next(createError(500, err.message));
            if (!user) return next(createError(404, 'Not found'));

            res.status(500).send(user);
        });
    } catch (err) {
        return res.status(500).send('An error occurred: ' + err);
    }
}

module.exports = UserController;