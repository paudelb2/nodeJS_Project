var express = require('express');
var router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');
const User = require('../model/user');
const NewsModel = require('../model/news.model');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
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
			if (user.isAdmin) {
				console.log('admin');
				res.render('news', {
					data: { title: 'express-app', active: 3, login: true },
					user: user,
				});
			} else {
				console.log('non-admin');
				res.send('you are not an admin');
			}
		}
	});
});

router.post('/', (req, res) => {
	console.log('body:');
	console.log(req.body);

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
			let newsDao = new NewsModel(req.body);
			if (
				req.body.title &&
				req.body.description &&
				req.body.url &&
				req.body.urlToImage &&
				req.body.publishedAt
			) {
				newsDao.save((err, newsList) => {
					if (!err) {
						console.log('news saved in db');
						console.log(newsList);
						res.render('news', {
							data: { title: 'express-app', active: 3, login: true },
							user: user,
						});
					} else {
						console.log('Error in newsSchema');
						res.send('Error ' + err);
					}
				});
			}
		} else {
			res.redirect('/login');
		}
	});
});

module.exports = router;
