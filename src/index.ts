import applicationSettings from './settings';
import { KlasaClient, KlasaUser } from 'klasa';
import { MessageReaction, MessageEmbed, GuildMember } from 'discord.js';
import * as Twitter from 'twitter';
import Reddit = require('reddit');
import imageToBase64 = require('image-to-base64');
import { Emoji, Color, Role } from './constants';

let client: KlasaClient = new KlasaClient(applicationSettings.botOptions);

client.on("messageReactionAdd", async (messageReaction: MessageReaction, user: KlasaUser) => {
    if (user.bot) return;

    if (
        !(Array.from([Emoji.Twitter, Emoji.Facebook, Emoji.Instagram, Emoji.Reddit]) as string[])
            .includes(messageReaction.emoji.id)
    ) return;

    const attachment = messageReaction.message.attachments.first();
    if (!attachment) return;

    const channel = messageReaction.message.channel;
    let embed = new MessageEmbed();

    if (!messageReaction.message.guild.member(user).roles.cache.has(Role.Publisher)) {
        embed.setColor(Color.Orange);
        embed.setDescription(
            `You don't have permission to upload content. You need the Publisher role.`
        );
        // return messageReaction.message.author.send(embed);
        return user.send(embed);
    }

    switch (messageReaction.emoji.id) {
        case Emoji.Twitter:

            const attachmentBase64 = await imageToBase64(attachment.url);

            const twitter = new Twitter(applicationSettings.twitter)

            const twitterMediaUpload = await twitter.post('media/upload', { media_data: attachmentBase64 });

            console.log("Attempting to upload to Twitter...");
            await twitter.post('statuses/update', { status: `Posted by ${messageReaction.message.author.username} via Discord \#CuteAnimals`, media_ids: twitterMediaUpload.media_id_string })
                .catch((reason) => {
                    console.log(reason);
                    embed.setColor(Color.Red);
                    embed.setDescription(`Your [message](${messageReaction.message.url}) failed to upload to Twitter.`);
                })
                .then((response) => {
                    console.log(response);
                    embed.setColor(Color.Green);
                    embed.setDescription(`Your [message](${messageReaction.message.url}) was successfully [uploaded](${(response as any).entities.media[0].url}) to Twitter.`);
                });

            return channel.send(embed);
        case Emoji.Facebook:
            await messageReaction.users.remove(user);
            embed.setColor(Color.Yellow);
            embed.setDescription("Uploading to Facebook is not yet supported.");
            return channel.send(embed);
        case Emoji.Instagram:
            await messageReaction.users.remove(user);
            embed.setColor(Color.Yellow);
            embed.setDescription("Uploading to Instagram is not yet supported.");
            return channel.send(embed);
        case Emoji.Reddit:

            const reddit = new Reddit(applicationSettings.reddit);

            await reddit.post('/api/submit', {
                sr: 'MoreCuteAnimals',
                kind: 'image',
                resubmit: true,
                title: `Posted by ${messageReaction.message.author.username} via Discord`,
                url: attachment.url
            }).catch((reason) => {
                console.log(reason);
                embed.setColor(Color.Red);
                embed.setDescription(`Your [message](${messageReaction.message.url}) failed to upload to Reddit.`);
            })
                .then((response) => {
                    console.log(response);
                    embed.setColor(Color.Green);
                    embed.setDescription(`Your [message](${messageReaction.message.url}) was successfully [uploaded](${(response as any).json.data.url}) to Reddit.`);
                });

            return channel.send(embed);
        default:
            return;
    }

    // // if (!socialMediaEmojiIds.includes(messageReaction.emoji.id)) return;

    // const attachment = messageReaction.message.attachments.first();
    // if (!attachment) {
    //     return messageReaction.message.send(
    //         `The message you tried to queue for upload does not contain an image and has been rejected.`
    //     );
    // }

    // const attachmentBase64 = await imageToBase64(attachment.url);

    // // const messageEmbed = new MessageEmbed()
    // //     .setColor('#0099ff')
    // //     .addFields(
    // //         { name: 'Uploader', value: user, inline: true },
    // //         { name: 'Content', value: `[Link](${messageReaction.message.url})`, inline: true },
    // //         {
    // //             name: '\u200b',
    // //             value: '\u200b',
    // //             inline: true,
    // //         },
    // //         // {
    // //         //     name: 'Facebook',
    // //         //     value: 'In Progress',
    // //         //     inline: true
    // //         // },
    // //         {
    // //             name: 'Twitter',
    // //             value: 'In Progress',
    // //             inline: true
    // //         },
    // //         // {
    // //         //     name: 'Instagram',
    // //         //     value: 'Pending',
    // //         //     inline: true
    // //         // }
    // //         {
    // //             name: 'Reddit',
    // //             value: 'Pending',
    // //             inline: true
    // //         }
    // //     );

    // // let reply = await messageReaction.message.send(messageEmbed);

    // const twitterApiKey = "DwmKkRJrGzYAiz8uV8y8tBTVf";
    // const twitterApiKeySecret = "3f6FuosNRq0yBhsegdOk22URsfB3s73IWf5jXfuDuK4LEyowLW";
    // const twitterAccessToken = "325140758-XDk5aQiYmyH0J7ZsyCgbiGBpLtZ0sSHC9MvYooFX";
    // const twitterAccessTokenSecret = "G0spbTRuUYW1eYgV67aq9F5IqdEff4NZrWU9W6qVEL5Zd";

    // var twitter = new Twitter({
    //     consumer_key: twitterApiKey,
    //     consumer_secret: twitterApiKeySecret,
    //     access_token_key: twitterAccessToken,
    //     access_token_secret: twitterAccessTokenSecret
    // });

    // const twitterMediaUpload = await twitter.post('media/upload', { media_data: attachmentBase64 });

    // console.log("Attempting to upload to Twitter...");
    // await twitter.post('statuses/update', { status: 'we did it', media_ids: twitterMediaUpload.media_id_string })
    //     .catch((reason) => {
    //         console.log(reason);
    //         messageEmbed.fields.find(m => m.name === "Twitter").value = "Error";
    //     })
    //     .then((response) => {
    //         console.log(response);
    //         messageEmbed.fields.find(m => m.name === "Twitter").value = "Complete";
    //     })
    //     .finally(async () => {
    //         reply = await messageReaction.message.send(messageEmbed);
    //     });
    // console.log("Done.");

    // const reddit = new Reddit({
    //     username: 'PassiveGnome',
    //     password: 'Dirk0711!@#',
    //     appId: 'Z6JqWV0mtpP-2A',
    //     appSecret: 'SJGSkVrOJROsj249VhAirl0QuIo',
    //     userAgent: 'MyApp/1.0.0 (http://example.com)'
    // });

    // console.log("Attempting to upload to Reddit...");
    // await reddit.post('/api/submit', {
    //     sr: 'MoreCuteAnimals',
    //     kind: 'image',
    //     resubmit: true,
    //     title: 'Test',
    //     url: 'https://media.discordapp.net/attachments/746385341279371287/757039685477466132/82548666_3177938275563964_5964111236424531968_n.png'
    // }).catch((reason) => {
    //     console.log(reason);
    //     messageEmbed.fields.find(m => m.name === "Reddit").value = "Error";
    // })
    // .then((response) => {
    //     console.log(response);
    //     messageEmbed.fields.find(m => m.name === "Reddit").value = "Complete";
    // })
    // .finally(async () => {
    //     reply = await messageReaction.message.send(messageEmbed);
    // });
    // console.log("Done");

});

client.login(applicationSettings.token);