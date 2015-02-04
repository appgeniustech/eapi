'use strict';

module.exports = {
    db: {
        uri: 'mongodb://ds062097.mongolab.com:62097/MongoLab-7',
        options: {
            user: 'appgenius',
            pass: 'Enchantp1'
        }
    },
    log: {
        // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
        format: 'dev',
        // Stream defaults to process.stdout
        // Uncomment to enable logging to a log on the file system
        azure: {
            account: 'appgenius',
            key: 'F+CoajLLR6QHpk1VIl/WozJywoPp3BUy2L49IiW35jln9Z2/ddkSacyuoNG36S+OmB3b72REPZ9nk8X9fepgEw==',
            tableName: 'enchantlog',
            partitionKey: require('os').hostname() + ':' + process.pid,
            columns: true,
            level: 'trace'
        },
        console: {
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        },
        file: {
            level: 'debug',
            filename: '../log.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }
    },
    app: {
        title: 'Enchant Rest API'
    },
    facebook: {
        clientID: process.env.FACEBOOK_ID || '1577620145786241',
        clientSecret: process.env.FACEBOOK_SECRET || '1c7108d319a4270d49d6e82fbf3b27f9',
        passReqToCallback: true,
        profileFields: ['birthday', 'location', 'photos']
    },
    sessionToken: {
        fieldName: 'x-session',
        passReqToCallback: true
    },
    twitter: {
        clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
        clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
        callbackURL: '/auth/twitter/callback'
    },
    google: {
        clientID: process.env.GOOGLE_ID || 'APP_ID',
        clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
        callbackURL: '/auth/google/callback'
    },
    linkedin: {
        clientID: process.env.LINKEDIN_ID || 'APP_ID',
        clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
        callbackURL: '/auth/linkedin/callback'
    },
    github: {
        clientID: process.env.GITHUB_ID || 'APP_ID',
        clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
        callbackURL: '/auth/github/callback'
    }
    ,
    mailer: {
        from: process.env.MAILER_FROM || 'MAILER_FROM',
        options: {
            service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
            auth: {
                user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
                pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
            }
        }
    }
};
