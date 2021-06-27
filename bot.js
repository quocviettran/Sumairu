//Importing packages
const Discord = require("discord.js");
const logger = require("winston");
const auth = require("./auth.json");
const fetch = require("node-fetch");
const axios = require("axios");
const http = require("http");

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
function rngRoll() {
  const rng = Math.floor(Math.random() * 4);
  console.log(rng);
  switch (rng) {
    case 1:
      return "&t=all";
    case 2:
      return "&t=year";
    case 3:
      return "&t=month";
    case 4:
      return "&t=week";
  }
}

const fetchRedditTop25 = async (subreddit) => {
  //Get reddit's API in .json
  return await axios
    .get(`https://www.reddit.com/r/${subreddit}/top/.json?count=1${rngRoll()}`)
    .then((response) => {
      return response;
    });
};

const fetchSubreddit = async (subreddit, channel) => {
  const results = await fetchRedditTop25(subreddit);
  const responseData =
    results.data.data.children[Math.floor(Math.random() * 25)].data;

  if (!responseData.url_overridden_by_dest) {
    channel.send(responseData.title);
  } else {
    channel.send(responseData.url_overridden_by_dest);
  }
};

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
    !smile - Post a random wholesome meme`,
  ];

  if (content.startsWith("!")) {
    var cmd = content.split(" ");

    console.log(cmd[0].substring(1));
    switch (cmd[0].substring(1)) {
      case "help":
        message.author.send(helpMsg);
        break;
      case "sup":
        channel.send("sup bitch");
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
      default:
        channel.send(
          "This is not a command. Have a fantastic day awesome person!"
        );
        break;
    }
  }
});

bot.login(auth.token);
