const express = require('express');
const app = express();
const session= require("express-session");
const passport = require("passport");
const { Strategy } = require("passport-discord");
const mongoose = require("mongoose");
const path = require('path');
const DiscordOauth2 = require('discordouth3')
const oauth = new DiscordOauth2();
const User = require('./users')
const { REST, Routes } = require('discord.js');

module.exports = client => {
  const PORT = 3000;
  app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
  });
app.use(express.static('views'));
app.use(express.json());
app.set("view engine", "ejs");
mongoose.connect(process.env.MongooseURL, {
    dbName: "ERR"
});
app.use(session({
    secret: '6VYY4k_9noL4KWOyYHce9vJp8CJOVMsu',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
});

passport.use(new Strategy({
    clientID: '1192599933975531622',
    clientSecret: 'ezF0J16XHkNTDslEobc50atkofoQRYtk',
    callbackURL: 'https://7ca88e54-0dca-463b-966b-a7d829f44b07-00-3050kg8gn5l64.picard.replit.dev/login',
    scope: ['identify', 'guilds.join']
}, async (accessToken, refreshToken, profile, done) => {
    
    try {
        const user = await User.findOneAndUpdate(
            { discordId: profile.id },
            {
                discordTag: profile.username + "#" + profile.discriminator,
                accessToken: accessToken,
                refreshToken: refreshToken
            },
            { upsert: true, new: true }
        );
        const rest = new REST({ version: 10 }).setToken(client.token);
        rest.put(Routes.guildMemberRole('1168174538954117251', profile.id, '1192641505693794454'));       
      const channelId = '1193961342621733005';
      const channel = client.channels.cache.get(channelId);
      if (channel) {
        channel.send(`<@${profile.id}> has OAuth successful.`);
      } else {
        console.log('Channel not found!');
      }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));
const router = express.Router();

app.get("/", passport.authenticate("discord"), (req, res) => {
    res.render("html", { userName: req.user.discordTag });
});

app.get("/login", passport.authenticate("discord", {
    failureRedirect: "/"
}), (req, res) => {
    res.redirect("/thanks");
});

app.get("/thanks", (req, res) => {
    res.render('html');
});

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        req.logout();
        res.redirect("/");
    });
});

app.get('/login', (req, res) => {
  res.redirect('/login');
});

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        return res.render('html', { userName: req.user.discordTag });
    }
    res.redirect('/login');
});


app.all("/:param?", (req, res) => {
    res.send({
        query: req.query,
        params: req.params,
        body: req.body,
    });
});

app.use((req, res, next) => {
    res.status(404).send("Not Found");
});

}