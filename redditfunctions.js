const axios = require("axios");
const Discord = require("discord.js");

function rngRoll(number) {
  return Math.floor(Math.random() * number);
}

function topSubredditRng() {
  var rng = rngRoll(4);
  switch (rng) {
    case 0:
      var top = "&t=all";
      break;
    case 1:
      var top = "&t=year";
      break;
    case 2:
      var top = "&t=month";
      break;
    case 3:
      var top = "&t=week";
      break;
  }
  console.log(`Choosing top post from ${top}`);
  return top;
}

//Get reddit's API in .json
const fetchRedditApi = async (subreddit) => {
  return await axios
    .get(
      `https://www.reddit.com/r/${subreddit}/top/.json?count=1${topSubredditRng()}`
    )
    .then((response) => {
      return response;
    });
};

const fetchImage = async (subreddit, channel) => {
  const results = await fetchRedditApi(subreddit);

  const numberOfPosts = results.data.data.dist;
  const responseData = results.data.data.children[rngRoll(numberOfPosts)].data;
  const responseUrl = responseData.url_overridden_by_dest;
  const responseTitle = responseData.title;
  const responseNsfw = responseData.over_18;
  console.log(responseUrl);

  if (!responseUrl || !responseUrl.match(/.(jpg|jpeg|png|gif|gifv)$/i)) {
    console.log("Not a picture. Finding a new one.");
    fetchImage(subreddit, channel);
  } else {
    if (responseNsfw) {
      console.log("NSFW post");
      channel.send(responseTitle, {
        files: [
          {
            attachment: responseUrl,
            name: "SPOILER_FILE.jpg",
          },
        ],
      });
    } else {
      channel.send(responseData.url_overridden_by_dest);
    }
  }
};

exports.fetchImage = fetchImage;
