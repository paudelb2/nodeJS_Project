var express = require('express');
var router = express.Router();
const axios = require('axios');
//const mongoose = require('mongoose');
//var sportsSchema = mongoose.model('SportsSchema', SportsSchema);
const sportsSchema = require('../model/sport');

router.get('/', async function (req, res, next) {
	fetchSports();

	await sportsSchema.find({}, (error, sportsNews) => {
		console.log('inside find');
		if (!error) {
			console.log('data sent as response');
			res.json(sportsNews);
		} else {
			console.log('error in retriving data');
			console.log(error);
		}
	});
});

var fetchSports = () => {
	console.log('inside fetchSports');
	//const d = new Date().toISOString();
	const today = new Date();
	console.log('today : ', today);

	const apiUrl = 'https://newsapi.org/v2/top-headlines';
	axios
		.get(apiUrl, {
			params: {
				sources: 'espn',
				from: today,
				sortBy: 'popularity',
				language: 'en',
				apiKey: '0b62feddf9c04a41afcf0cdbf686bba2',
			},
		})
		.then((response) => {
			const articleList = response.data.articles;
			console.log('/sports : data => ', articleList);
			saveSportsToDB(articleList);
			//return articleList;
		})
		.catch(function (error) {
			console.log(error);
		});
};

function saveSportsToDB(response) {
	console.log(response);
	var sportsList = response;
	//let sportsListLength = sportsList.length;
	//console.log(sportsList.le);
	var arrayLength = Object.keys(sportsList).length;

	for (let i = 0; i <= arrayLength; i++) {
		let title = sportsList[i].title;
		let description = sportsList[i].description;
		let content = sportsList[i].content;
		let url = sportsList[i].url;
		let urlToImage = sportsList[i].urlToImage;
		let publishedAt = sportsList[i].publishedAt;
		let source = sportsList[i].source.name;
		let author = sportsList[i].author;

		assignDataValue(
			title,
			description,
			content,
			url,
			urlToImage,
			publishedAt,
			source,
			author
		);
	}
}

function assignDataValue(
	title,
	description,
	content,
	url,
	urlToImage,
	publishedAt,
	source,
	author
) {
	let sportsData = new sportsSchema();

	sportsData.title = title;
	sportsData.description = description;
	sportsData.content = content;
	sportsData.url = url;
	sportsData.urlToImage = urlToImage;
	sportsData.publishedAt = publishedAt;
	sportsData.source = source;
	sportsData.author = author;

	sportsData.save((err, sportsList) => {
		if (!err) {
			console.log('sports news saved in db');
			console.log(sportsList);
		} else {
			console.log('Error in newsSchema');
			res.send('Error ' + err);
		}
	});
}

module.exports = router;
