const config = {
    app: {
        port: 3000
    },
    db: {
        production: {
            uri: 'mongodb+srv://alex:alex@cluster0-3pdbe.mongodb.net/safe-park?retryWrites=true',
            name: 'safe-park'
        },
        test: {
            uri: 'mongodb+srv://alex:alex@cluster0-3pdbe.mongodb.net/safe-park-test?retryWrites=true',
            name: 'safe-park-test'
        }
    }
}

module.exports = config;