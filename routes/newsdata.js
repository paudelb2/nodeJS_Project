var express = require('express');
var router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const NewsModel = require('../model/news.model');

router.get('/', function (req, res, next) {
	const token = localStorage.getItem('authToken');
	console.log('token: ' + token);

	if (!token) {
		res.redirect('/login');
	}
	jwt.verify(token, 'secret', async function (err, decode) {
		if (err) {
			res.redirect('/login');
		}
		console.log(decode.userId, decode.email);
		const user = await User.findOne({ email: decode.email });

		console.log(user);

		if (!user) {
			res.redirect('/login');
		} else {
			NewsModel.find({}, (error, newsData) => {
				if (!error) {
					console.log(newsData);
					if (user.isAdmin) {
						console.log('admin BOP BOP');
						res.render('data', {
							data: { admin: true, news: newsData, active: 4, login: true },
							user: user,
						});
					} else {
						console.log('non-admin');
						res.send('data', {
							data: { admin: false, news: newsData, active: 4, login: true },
						});
					}
				} else {
					console.log('could not get news from db');
				}
			});
		}
	});
});

// Update User
router.put('/', async (req, res, next) => {
	//console.log('Im in put method');
	if (req.body.newsId) {
		console.log('body:');
		console.log(req.body);

		await NewsModel.findOne(
			{ newsId: req.body.newsId },
			async (err, newsData) => {
				if (!err) {
					//console.log('before update');
					//console.log(JSON.parse(JSON.stringify(data)));

					let newsId = newsData.newsId,
						title = newsData.title,
						description = newsData.description;

					if (req.body.title !== '' && req.body.description != '') {
						title = req.body.title;
						description = req.body.description;
					} else if (req.body.title == '' && req.body.description != '') {
						description = req.body.description;
					} else if (req.body.title !== '' && req.body.description == '') {
						title = req.body.title;
					}

					await findOneToUpdate(newsId, title, description, res);
				} else {
					res.json(err);
				}
			}
		);
	}
});

var findOneToUpdate = (newsId, title, description, res) => {
	NewsModel.findOneAndUpdate(
		{ newsId: newsId },
		{
			$set: {
				title: title,
				description: description,
			},
		},
		{
			upsert: true,
		},
		(err, newsData) => {
			if (err) {
				console.log('ERROR OCCURRED HERE');
				res.send(err);
			} else {
				res.redirect('/data');
			}
		}
	);
};
module.exports = router;
