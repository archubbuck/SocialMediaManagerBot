import { KlasaClientOptions } from 'klasa';

class ApplicationSettings {
    token: string;
    usageDelim: string;
    botOptions: KlasaClientOptions;
    twitter: TwitterSettings;
    reddit: RedditSettings;
    imgur: ImgurSettings;
    emojis: Emojis;
    colors: Colors;
    channels: Channels;
    roles: Roles;
}

class TwitterSettings {
    consumer_key: string;
    consumer_secret: string;
    access_token_key: string;
    access_token_secret: string;
}

class RedditSettings {
    username: string;
    password: string;
    appId: string;
    appSecret: string;
    userAgent: string;
}

class ImgurSettings {
    username: string;
    password: string;
    clientId: string;
}

class Emojis {
    upload: string;
    twitter: string;
    facebook: string;
    instagram: string;
    reddit: string;
}

class Colors {
    green: string;
    yellow: string;
    orange: string;
    red: string;
}

class Channels {
    welcome: string;
    goodbye: string;
}

class Roles {
    publisher: string;
    greeter: string;
    outreachTeam: string;
}

const applicationSettings: ApplicationSettings = require('../appsettings.json');

export default applicationSettings;

