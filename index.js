const express = require('express');
const userRouter = require('./routers/users');
const bodyParser = require('body-parser');
const mongoSanitizeMiddleware = require('./middlewares/mongo-sanitize');

const app = express();

const PORT = process.env.port || 3000;

app.use(bodyParser.json());

app.use(mongoSanitizeMiddleware());

app.get('/', (req, res) => res.send('Hello Express!'));

app.use('/user', userRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
