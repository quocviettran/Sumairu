//Importing packages
const Discord = require("discord.js");
const logger = require("winston");
const auth = require("./auth.json");
const fetch = require("node-fetch");
const http = require("http");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const { execute, skip, stop, playFromUrl } = require("./musicfunctions.js");
//const {setup, shutdown } = require("./config.js")
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

const queue = new Map();

bot.on("message", async (message) => {
  var content = message.content.toLowerCase();

  var messageId = message.id;
  var channel = message.channel;
  var author = message.author;

  const serverQueue = queue.get(message.guild.id);

  var helpMsg = [
    `Hi ${author}! Here is a list of commands:
    $help - List of commands
    $sup - Bot responds with a nice message
    $smile - Post a random wholesome meme
    $aww - Post a cute picture
    $motivateme - Let me help you get motivated!
    $erosennin - When you feel like Jiraya :^)
    $5050 - Fifty fifty game

    Music:
    $play [youtube-url or keyword]
    $skip
    $stop`,
  ];

  if (content.includes("and his name is")) {
    const url = "https://www.youtube.com/watch?v=LHcRI5-X1lc";
    playFromUrl(message, serverQueue, queue, url);
  }

  if (author.username == "BambooMy") {
    rng = rngRoll(2);
    switch (rng) {
      case 0:
        channel.send("UwU");
        break;
      case 1:
        channel.send("OwO");
        break;
    }
  }

  if (author.username == "Mo0nica") {
    rng = rngRoll(4);
    switch (rng) {
      case 0:
        channel.send(`shut up ${message.author}!`);
        break;
      case 1:
        channel.send(`hold kjeft ${message.author}!`);
        break;
      case 2:
        channel.send(`shut your mouth ${message.author}!`);
        break;
      case 3:
        channel.send(`stop talking ${message.author}!`);
        break;
    }
  }

  if (
    content.includes("she") &&
    content.includes("esh") &&
    author.username != "Sumairu"
  ) {
    const url = "https://www.youtube.com/watch?v=YgT6XABqS5Y";
    playFromUrl(message, serverQueue, queue, url);
    channel.send("https://tenor.com/view/ronan-sheesh-sheesh-gif-21479305");
  }

  if (content.startsWith("$")) {
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
      case "play":
        execute(message, serverQueue, queue);
        break;
      case "skip":
        skip(message, serverQueue);
        break;
      case "stop":
        stop(message, serverQueue);
        break;
      default:
        channel.send(`This is not a command. Have a fantastic day ${author}`);
        break;
    }
  }
  console.log("--------------------------------------");
});

bot.login(auth.token);
