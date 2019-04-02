const mongoose = require('mongoose');
const config = require('../config');
const { NODE_ENV } = process.env;

mongoose.Promise = global.Promise;

const connectToDb = async () => {
    try {
        await mongoose.connect(config.db[NODE_ENV]['uri']);
    }
    catch (err) {
        //logger.error('Could not connect to MongoDB');
    }
}

module.exports = connectToDb;