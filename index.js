require('dotenv').config();
const express = require('express');
const userRouter = require('./routers/users');
const logger = require('morgan');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const mongoSanitizeMiddleware = require('./middleware/mongo-sanitize');
const config = require('./config');

// SETUP
const app = express();
const PORT = process.env.port || 3000;

// MIDDLEWARE
app.use(bodyParser.json());
app.use(mongoSanitizeMiddleware());
app.use(logger(process.env.NODE_ENV));

// ROUTES
app.use('/user', userRouter);

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
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;