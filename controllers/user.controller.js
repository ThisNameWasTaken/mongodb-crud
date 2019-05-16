const User = require('../models/user');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const UserController = {};
const OneSignal = require('onesignal-node');

var myClient = new OneSignal.Client({
    userAuthKey: 'XXXXXX',
    app: { appAuthKey: 'MzRlZTFlMWMtYjIzMi00NjU2LWE3NjAtYTY1MmQ4YzZkYWUw', appId: '24dae07a-52c3-4fdc-91c3-e77929446319' }
});

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
    let { _id } = req.user;
    console.log(req.body);

    User.updateOne({ _id }, { ...req.body }, (err) => {
        if (err) return next(createError(500, err.message));
        res.status(200).send('Succesfully updated');
    });
}

UserController.changePass = async (req, res, next) => {
    let { password } = req.body;

    if (password === '' || password === undefined) return res.status(404).send("No new password found");

    User.findById(req.user._id).then(function (sanitizedUser) {
        if (sanitizedUser) {
            sanitizedUser.setPassword(password, function () {
                sanitizedUser.save();
                return res.status(200).send('Password reset successful');
            });
        } else {
            return res.status(500).send('This user does not exist');
        }
    }, function (err) {
        return res.status(500).send(err.message);
    });
}

UserController.searchByPlate = async (req, res, next) => {
    let { plate } = req.body;

    User.findOne({ plate }, function (err, user) {
        if (err) return next(createError(500, err.message));
        if (!user) return next(createError(404, 'Not found'));
        return res.status(200).send(user);
    });
}

UserController.alert = async (req, res, next) => {
    let { plate } = req.body;

    User.findOne({ plate }, function (err, user) {
        if (err) return next(createError(500, err.message));
        if (!user) return next(createError(404, 'Not found'));
        let { notificationId } = user;

        if (notificationId === undefined) {
            return res.status(500).send('No notification id!');
        }

        console.log(notificationId);

        let firstNotification = new OneSignal.Notification({
            contents: {
                en: "Test notification",
                tr: "Test mesajı"
            },
            include_player_ids: [notificationId]
        });

        myClient.sendNotification(firstNotification, function (err, httpResponse, data) {
            if (err) {
                return res.status(500).send(err);
            } else {
                console.log(data, httpResponse.statusCode);
                return res.status(200).send("Notification sent to " + user);
            }
        });
    });
}

module.exports = UserController;