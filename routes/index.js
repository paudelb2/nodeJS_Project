var express = require('express');
var router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');
var User = require('../model/user');
const jwt = require('jsonwebtoken');

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
			if (user.isAdmin) {
				console.log('admin');
				res.render('index', {data:{ title: 'express-app', active: 3, login : true}});
			} else {
				console.log('non-admin');
				res.send('I am not an admin');
			}
		}
	});
})

module.exports = router;
