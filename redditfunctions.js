const axios = require("axios");
const Discord = require("discord.js");

function rngRoll() {
  const rng = Math.floor(Math.random() * 4);
  console.log(rng);
  switch (rng) {
    case 1:
      return "&t=today";
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
  } else if (subreddit == "fiftyfifty") {
    //channel.send(responseData.title);
    channel.send(responseData.title, {
      files: [
        {
          attachment: responseData.url_overridden_by_dest,
          name: "SPOILER_FILE.jpg",
        },
      ],
    });
  } else {
    channel.send(responseData.url_overridden_by_dest);
  }
};

exports.fetchSubreddit = fetchSubreddit;
