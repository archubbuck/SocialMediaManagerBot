import applicationSettings from './settings';
import { KlasaClient, KlasaUser } from 'klasa';
import { MessageReaction, MessageEmbed, TextChannel } from 'discord.js';
import * as Twitter from 'twitter';
import Reddit = require('reddit');
import imageToBase64 = require('image-to-base64');
import * as Moment from 'moment';
// var imgur = require('imgur');
import imgur = require('imgur');

imgur.setCredentials(applicationSettings.imgur.username, applicationSettings.imgur.password, applicationSettings.imgur.clientId);

let client: KlasaClient = new KlasaClient(applicationSettings.botOptions);

client.on("messageReactionAdd", async (messageReaction: MessageReaction, user: KlasaUser) => {
    if (user.bot) return;

    if (
        !(Array.from([
            // applicationSettings.emojis.twitter,
            // applicationSettings.emojis.facebook,
            // applicationSettings.emojis.instagram,
            applicationSettings.emojis.reddit
        ]) as string[])
            .includes(messageReaction.emoji.id)
    ) return;

    // const attachment = messageReaction.message.attachments.first();
    // if (!attachment) return;

    const imageSrc = messageReaction.message.attachments.find(m => !!m.url) || messageReaction.message.embeds.find(m => !!m.url);
    if (!imageSrc) return;

    const channel = messageReaction.message.channel;
    let embed = new MessageEmbed();

    if (!messageReaction.message.guild.member(user).roles.cache.has(applicationSettings.roles.publisher)) {
        embed.setColor(applicationSettings.colors.orange);
        embed.setDescription(
            `You don't have permission to upload content. You need the Publisher role.`
        );
        return user.send(embed);
    }

    switch (messageReaction.emoji.id) {
        // case applicationSettings.emojis.twitter:

        //     const attachmentBase64 = await imageToBase64(attachment.url);

        //     const twitter = new Twitter(applicationSettings.twitter)

        //     const twitterMediaUpload = await twitter.post('media/upload', { media_data: attachmentBase64 });

        //     console.log("Attempting to upload to Twitter...");
        //     await twitter.post('statuses/update', { status: `Posted by ${messageReaction.message.author.username} via Discord \#CuteAnimals`, media_ids: twitterMediaUpload.media_id_string })
        //         .catch((reason) => {
        //             console.log(reason);
        //             embed.setColor(applicationSettings.colors.red);
        //             embed.setDescription(`Your [message](${messageReaction.message.url}) failed to upload to Twitter.`);
        //         })
        //         .then((response) => {
        //             console.log(response);
        //             embed.setColor(applicationSettings.colors.green);
        //             embed.setDescription(`Your [message](${messageReaction.message.url}) was successfully [uploaded](${(response as any).entities.media[0].url}) to Twitter.`);
        //         });

        //     return channel.send(embed);
        // case applicationSettings.emojis.facebook:
        //     await messageReaction.users.remove(user);
        //     embed.setColor(applicationSettings.colors.yellow);
        //     embed.setDescription("Uploading to Facebook is not yet supported.");
        //     return channel.send(embed);
        // case applicationSettings.emojis.instagram:
        //     await messageReaction.users.remove(user);
        //     embed.setColor(applicationSettings.colors.yellow);
        //     embed.setDescription("Uploading to Instagram is not yet supported.");
        //     return channel.send(embed);
        case applicationSettings.emojis.reddit:
            
            const title = `Posted by ${messageReaction.message.author.username} via Discord`;

            let imgurUrl;
            await imgur.uploadUrl(imageSrc.url,
                null, title, title)
                .then(function (json) {
                    console.log(JSON.stringify(json, null, 4));
                    imgurUrl = json.data.link;
                })
                .catch(function (err) {
                    console.error(JSON.stringify(err, null, 4));
                    embed.setColor(applicationSettings.colors.red);
                    embed.setDescription(`Your [image](${imgurUrl}) failed to upload to Imgur.`);
                });

            const reddit = new Reddit(applicationSettings.reddit);

            await reddit.post('/api/submit', {
                sr: 'CuteAnimals',
                kind: 'image',
                resubmit: true,
                title: title,
                url: imgurUrl
            }).then((response) => {
                console.log(response);
                embed.setColor(applicationSettings.colors.green);
                embed.setDescription(`Your [message](${messageReaction.message.url}) was successfully [uploaded](${(response as any).json.data.url}) to Reddit.`);
            }).catch((reason) => {
                console.log(reason);
                embed.setColor(applicationSettings.colors.red);
                embed.setDescription(`Your [message](${messageReaction.message.url}) failed to upload to Reddit.`);
            });

            return channel.send(embed);
        default:
            return;
    }
});

client.on("guildMemberAdd", async member => {
    // const members = await member.guild.members.fetch();
    const channel = member.guild.channels.cache.get(applicationSettings.channels.welcome) as TextChannel;
    const position = member.guild.members.cache.sorted((memberA, memberB) => memberA.joinedTimestamp - memberB.joinedTimestamp)
        .array().findIndex(m => m.id === member.id) + 1;
    // const position = members.sorted((memberA, memberB) => memberA.joinedTimestamp - memberB.joinedTimestamp)
    //     .array().findIndex(m => m.id === member.id) + 1;
    const warn = Moment().diff(member.user.createdTimestamp, 'days') < 7;
    await channel.send([
        `${member.guild.roles.cache.get(applicationSettings.roles.greeter)}, <@!${member.id}> (${member.user.tag}) [ID: ${member.user.id}] has joined the server.`,
        `They are our **${Moment.localeData().ordinal(position)} member**, and joined Discord ${warn ? ":warning: " : ""}**${Moment(member.user.createdTimestamp).fromNow()}**${warn ? " :warning:" : ""}.`,
        `Please give them a warm welcome.`
    ].join(" "), { allowedMentions: { users: [], roles: [ applicationSettings.roles.greeter ] }});
});

client.on("guildMemberRemove", async member => {
    const channel = member.guild.channels.cache.get(applicationSettings.channels.goodbye) as TextChannel;
    await channel.send([
        `${member.guild.roles.cache.get(applicationSettings.roles.outreachTeam)}, it seems **<@!${member.user.id}>** (${member.user.tag}) [ID: ${member.user.id}] has left us.`,
        `They joined the server **${Moment(member.joinedTimestamp).fromNow()}** and had the following roles: ${member.roles.cache.array().filter(m => m.name !== "@everyone").join(", ")}.`
    ].join(" "), { allowedMentions: { users: [], roles: [ applicationSettings.roles.outreachTeam ] }});
});

client.on("klasaReady", () => console.log(applicationSettings));

client.login(applicationSettings.token);