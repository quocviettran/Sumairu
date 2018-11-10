function Skin(name,rarity, type){
	this.name = name;
	this.rarity = rarity;
	this.type = type;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//Shards
var skin_shard = "s_shard";
var champ_shard = "c_shard";
var emote = "emote";
var ward_shard = "w_shard";
var icon_shard = "i_shard";
var gem = "gem";
var key_chest = "key_chest"
var website = 'https://leagueoflegends.wikia.com/wiki/';
var opgg = 'https://euw.op.gg/summoner/userName=wokingduhdog';
exports.opgg = opgg;

var test = 'http://leagueoflegends.wikia.com/wiki/File:Aatrox_JusticarSkin.jpg';
exports.test = test;

exports.getWeb = function(web){
	return website.concat('',web);
}

//Probability
//0-50 = skinshard
//50-75 = champ shard
//75-85 = emote
//85-95 = icon shard
//95-100 = gems + key
var prob = [50,25,10,11.5,3.5,3.6,10];

//Ultimate skins
var SSG_Udyr = new Skin("SSG Udyr",skin_shard,"ultimate");
var PF_Ezreal = new Skin("PF Ezreal",skin_shard,"ultimate");

//Legendary skins
var BL_Vlad = new Skin("Blood Lord Vladimir",skin_shard,"legendary");

//Epic skins
var Pj_Lucian = new Skin("Project Lucian",skin_shard,"epic");

//Rare skins
var EX_Ezreal = new Skin("Explorer Ezreal",skin_shard,"rare");


var teaCait = new Skin("Tea cup",emote,"common");
var silver_s2 = new Skin("Season 2 silver",icon_shard,"common");
var Ezreal = new Skin("Ezreal",champ_shard,"common");

//allSkins[0][x] = ultimate
//allSkins[1][x] = Legendary
//allSkins[2][x] = Epic
//allSkins[3][x] = Rare
var allSkins = [[SSG_Udyr,PF_Ezreal],
				[BL_Vlad],
				[Pj_Lucian],
				[EX_Ezreal]
				];
var allChamp = [Ezreal];
var allEmote = [teaCait];
var allIcon = [silver_s2];
var gems = "Gems";

exports.openloot = function() {
	var probability = getRandomInt(100);
	console.log("Probability " + probability);
	if(probability < 100){
		probability = getRandomInt(100);
		if(probability < 26){
			var random = getRandomInt(allSkins[0].length-1)
			console.log(allSkins[0][random]);
			return allSkins[0][random];
		}
		else if(probability > 25 && probability < 51 ){
			var random = getRandomInt(allSkins[0].length-1)
			console.log(allSkins[1][random]);
			return allSkins[1][random];
		}
		else if(probability > 51 && probability < 76){
			var random = getRandomInt(allSkins[0].length-1)
			console.log(allSkins[2][random]);
			return allSkins[2][random];
		}
		else if(probability > 75){
			var random = getRandomInt(allSkins[0].length-1)
			console.log(allSkins[3][random]);
			return allSkins[3][random];
		}
	}
}

