import { KlasaClientOptions } from 'klasa';

class ApplicationSettings {
    token: string;
    usageDelim: string;
    botOptions: KlasaClientOptions;
    twitter: TwitterSettings;
    reddit: RedditSettings;

    constructor(token: string, usageDelim: string, botOptions: KlasaClientOptions, twitter: TwitterSettings, reddit: RedditSettings) {
        this.token = token;
        this.usageDelim = usageDelim;
        this.botOptions = botOptions;
        this.twitter = twitter;
    }
}

class TwitterSettings {
    consumer_key: string;
    consumer_secret: string;
    access_token_key: string;
    access_token_secret: string;

    constructor(consumer_key: string, consumer_secret: string, access_token_key: string, access_token_secret: string) {
        this.consumer_key = consumer_key;
        this.consumer_secret = consumer_secret;
        this.access_token_key = access_token_key;
        this.access_token_secret = access_token_secret;
    }
}

class RedditSettings {
    username: string;
    password: string;
    appId: string;
    appSecret: string;
    userAgent: string;

    constructor(username: string, password: string, appId: string, appSecret: string, userAgent: string) {
        this.username = username;
        this.password = password;
        this.appId = appId;
        this.appSecret = appSecret;
        this.userAgent = userAgent;
    }
}

const applicationSettings: ApplicationSettings = require('../appsettings.json');

export default applicationSettings;

