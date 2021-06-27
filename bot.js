//Importing packages
const Discord = require("discord.js");
const logger = require("winston");
const auth = require("./auth.json");
const fetch = require("node-fetch");
const http = require("http");
const { fetchSubreddit } = require("./redditfunctions.js");

//Signal listening
process
  .on("SIGTERM", shutdown("SIGTERM"))
  .on("SIGINT", shutdown("SIGINT"))
  .on("uncaughtException", shutdown("uncaughtException"));

http
  .createServer((req, res) => res.end("hi"))
  .listen(process.env.PORT || 3000, () => console.log("Listening"));

function shutdown(signal) {
  return (err) => {
    console.log(`${signal}...`);
    if (err) console.error(err.stack || err);
    setTimeout(() => {
      console.log("...waited 2s, exiting.");
      process.exit(err ? 1 : 0);
    }, 2000).unref();
  };
}

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});
logger.level = "debug";

//Function cause we failed to make a fking external file

// Initialize Discord Bot
var bot = new Discord.Client();
bot.on("ready", () => {
  logger.info("Logged in as " + bot.user.username);
});

bot.on("message", (message) => {
  var content = message.content;
  var messageId = message.id;
  var channel = message.channel;
  var author = message.author;

  var helpMsg = [
    `Hi ${author}! Here is a list of commands:
    !help - List of commands
    !sup - Bot responds with a nice message
    !smile - Post a random wholesome meme
    !aww - Post a cute picture
    !motivateme - Let me help you get motivated!
    !erosennin - When you feel like Jiraya :^)`,
  ];

  if (content.startsWith("!")) {
    var cmd = content.split(" ");

    console.log(cmd[0].substring(1));
    switch (cmd[0].substring(1)) {
      case "help":
        message.author.send(helpMsg);
        break;
      case "sup":
        channel.send(`sup ${author} you little bitch`);
        break;
      case "smile":
        fetchSubreddit("wholesomememes", channel);
        break;
      case "aww":
        fetchSubreddit("aww", channel);
        break;
      case "motivateme":
        fetchSubreddit("getmotivated", channel);
        break;
      case "erosennin":
        console.log(channel.nsfw);
        if (channel.nsfw) {
          fetchSubreddit("nsfw", channel);
        } else {
          channel.send(
            `Ero-${author}! This command can not be used in a non NSFW channel.`
          );
        }
        break;
      default:
        channel.send(`This is not a command. Have a fantastic day ${author}`);
        break;
    }
  }
});

bot.login(auth.token);
