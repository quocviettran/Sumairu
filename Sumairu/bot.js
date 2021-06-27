const Discord = require("discord.js");
const logger = require("winston");
const auth = require("./auth.json");
const fetch = require("node-fetch");
const axios = require("axios");
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

const fetchRedditTop25 = async () => {
  return await axios
    .get(
      "https://www.reddit.com/r/wholesomememes/top/.json?count=1" + rngRoll()
    )
    .then((response) => {
      return response;
    });
};
// async function fetchRedditTop5() {
//   return await axios
//     .get("https://www.reddit.com/r/all/top/.json?count=1")
//     .then((response) => {
//       return response;
//     });
// }

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
  var apiToken = "RGAPI-42f4e3ff-14eb-4e2f-b2e7-993842f250fb"; //Renew after each day

  var helpMsg = [
    "These are the following commands to this bot in alpha version ",
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
        const fetch = async () => {
          const results = await fetchRedditTop25();
          channel.send(
            results.data.data.children[Math.floor(Math.random() * 25)].data
              .url_overridden_by_dest //lolwhat
          );
        };
        fetch();

        break;
      default:
        channel.send(
          "This is not a command. Have a fantastic day awesome person!"
        );
        break;
    }
  }
});

/*bot.on('message',  (user, userID, channelID, message, evt) => {
    console.log(message.author);

	// Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

		args = args.splice(1);

        /*switch(cmd) {
            // !ping
            case 'ping':
                message.channel.send("pong");
				break;
			case 'loot':
				var obj = chars.openloot();
				bot.sendMessage({
					to: channelID,
					message: obj.name
				});
				break;
			case 'test':
				message.channel.send("TEST",{
					file : ["./Skins/Aatrox_JusticarSkin.png"]
				});
			break;
            // Just add any case commands if you want to..
        }
     }
});*/

bot.login(auth.token);
