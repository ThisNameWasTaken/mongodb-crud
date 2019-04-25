const User = require('../models/user');
const bodyParser = require('body-parser');
const passport = require('passport');
const AuthController = {};
const jwt = require('jsonwebtoken');

AuthController.register = async (req, res, next) => {
    User.register(new User({
        username: req.body.username,
        plate: req.body.plate,
        phone: req.body.phone
    }), req.body.password, function (err, account) {
        if (err) {
            return res.status(500).send('An error occurred: ' + err);
        }

        passport.authenticate(
            'local', {
                session: false
            })(req, res, () => {
                return res.status(200).send('Successfully created new account');
            });
    });

};

AuthController.login = async (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send("Bad input!");
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
                return res.status(500).send(err);
            }
            // generate a signed json web token with the contents of user object and return it in the response
            // TODO: Change the key for jwt generator
            const token = jwt.sign({ id: user.id, username: user.username }, 'ILovePokemon');
            return res.json({ user: user.username, token });
        });
    })(req, res);

};

module.exports = AuthController;