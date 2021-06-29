//Importing packages
const Discord = require("discord.js");
const logger = require("winston");
const auth = require("./auth.json");
const fetch = require("node-fetch");
const http = require("http");
const { fetchImage } = require("./redditfunctions.js");

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
  var content = message.content.toLowerCase();
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

  if (author.username == "BambooMy") {
    channel.send("UwU");
  }

  if (
    content.includes("she") &&
    content.includes("esh") &&
    author.username != "Sumairu"
  ) {
    channel.send("https://tenor.com/view/ronan-sheesh-sheesh-gif-21479305");
  }

  if (content.startsWith("!")) {
    var cmd = content.split(" ");

    console.log(`Command is: !${cmd[0].substring(1)}`);
    switch (cmd[0].substring(1)) {
      case "help":
        message.author.send(helpMsg);
        break;
      case "sup":
        channel.send(`sup ${author} you little bitch`);
        break;
      case "smile":
        fetchImage("wholesomememes", channel);
        break;
      case "aww":
        fetchImage("aww", channel);
        break;
      case "motivateme":
        fetchImage("getmotivated", channel);
        break;
      case "erosennin":
        if (channel.nsfw) {
          channel.send("[NSFW]");
          fetchImage("highresnsfw", channel).then(() => {
            setTimeout(() => {
              channel.send(
                `https://tenor.com/view/ilove-it-naruto-jiraiya-d%c3%aac%e1%bb%a5-th%c3%adch-gif-19652587`
              );
            }, 1000);
          });
        } else {
          channel.send(
            `Ero-${author}! This command can not be used in a non NSFW channel.`
          );
        }
        break;
      case "5050":
        fetchImage("fiftyfifty", channel);
        break;
      default:
        channel.send(`This is not a command. Have a fantastic day ${author}`);
        break;
    }
  }
  console.log("--------------------------------------");
});

bot.login(auth.token);
