var express = require('express');
var router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const NewsModel = require('../model/news');

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
			NewsModel.find({}, (error, newsList) => {
				if (!error) {
					console.log(newsList);
					if (user.isAdmin) {
						console.log('admin BOP BOP');
						res.render('data', {
							data: { admin: true, news: newsList, active: 4, login: true },
							user: user,
						});
					} else {
						console.log('non-admin');
						res.send('data', {
							data: { admin: false, news: newsList, active: 4, login: true },
							user: user,
						});
					}
				} else {
					console.log('could not get news from db');
				}
			});
		}
	});
});

//latest news
router.get('/newsDashboard', function (req, res, next) {
	NewsModel.find({}, (error, newsList) => {
		console.log(newsList);
		if (!error) {
			res.json(newsList);
		} else {
			console.log('could not get news from db');
		}
	})
		.sort({ publishedAt: -1 })
		.limit(3);
});

//news by id
router.get('/:id', function (req, res, next) {
	NewsModel.findOne({ newsId: req.params.id }, (error, newsData) => {
		console.log(newsData);
		if (!error) {
			res.json(newsData);
		} else {
			console.log('could not get news from db');
			res.json({});
		}
	}).limit(3);
});

// Update User
router.put('/', async (req, res, next) => {
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

		if (user.isAdmin) {
			if (req.body.newsId) {
				console.log(req.body);

				await NewsModel.findOne(
					{ newsId: req.body.newsId },
					async (err, newsData) => {
						if (!err) {
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
							findOneToUpdate(newsId, title, description, res);
						} else {
							res.json(err);
						}
					}
				);
			}
		} else {
			res.redirect('/login');
		}
	});
});

router.delete('/', async function (req, res, next) {
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

		if (user.isAdmin) {
			console.log(req.body.newsId);
			await NewsModel.deleteOne({ newsId: req.body.newsId }, (err, status) => {
				if (!err) {
					console.log('deleted from the db');
					res.redirect('/data');
				} else {
					res.send(err);
				}
			});
		} else {
			res.redirect('/login');
		}
	});
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
