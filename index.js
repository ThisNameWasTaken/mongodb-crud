require('dotenv').config();
const express = require('express');
const userRouter = require('./routers/users.routes');
const authRouter = require('./routers/auth.routes');
const logger = require('morgan');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const mongoSanitizeMiddleware = require('./middleware/mongo-sanitize');
const config = require('./config');
const passport = require('passport');
const User = require('./models/user');
const connectToDb = require('./db/connect');

// JWT PASSPORT  
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;

// SETUP
const app = express();

connectToDb();

// MIDDLEWARE
app.use(bodyParser.json());
app.use(mongoSanitizeMiddleware());
app.use(logger(process.env.NODE_ENV));
app.use(passport.initialize());
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
},
    User.authenticate()
));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'ILovePokemon',
    jsonWebTokenOptions: {
        expiresIn: '1s'
    }
},
    function (jwtPayload, cb) {
        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        return User.findById(jwtPayload.id)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
));

// ROUTES
app.use('/auth', authRouter);
app.use('/user', passport.authenticate('jwt', { session: false }), userRouter);

// ERROR HANDLING
// Not Found Error
app.use((req, res, next) => {
    next(createError(404, 'Not Found'));
});

// Error Handling
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        err: err.message,
        status: err.status
    });
});

// START SERVER
app.listen(process.env.PORT || 3000, () => console.log(`Server started on port ${process.env.PORT}`));

module.exports = app;