const User = require('../models/user');
const bodyParser = require('body-parser');
const passport = require('passport');
const AuthController = {};
const jwt = require('jsonwebtoken');

AuthController.register = async (req, res, next) => {
    try {
        User.register(new User({
            username: req.body.email,
            plate: req.body.plate
        }), req.body.password, function (err, account) {
            if (err) {
                return res.status(500).send('An error occurred: ' + err);
            }

            passport.authenticate(
                'local', {
                    session: false
                })(req, res, () => {
                    res.status(200).send('Successfully created new account');
                });
        });
    }
    catch (err) {
        return res.status(500).send('An error occurred: ' + err);
    }
};

AuthController.login = async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({
                message: 'Something is not right with your input'
            });
        }
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, { session: false }, (err) => {
                if (err) {
                    res.send(err);
                }
                // generate a signed json web token with the contents of user object and return it in the response
                const token = jwt.sign({ id: user.id, email: user.username }, 'ILovePokemon');
                return res.json({ user: user.username, token });
            });
        })(req, res);
    }
    catch (err) {
        console.log(err);
    }
};

module.exports = AuthController;