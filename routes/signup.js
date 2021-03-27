var express = require('express');
var router = express.Router();
const User = require('../model/user');

router.get('/', function (req, res, next) {
	res.render('register',{data: {active: 2, login : false}});
});

router.post('/', function (req, res, next) {
	console.log('body: ');
	console.log(req.body);

	let userData = {
		isAdmin: true,
		...req.body,
	};

	let userDao = new User(userData);
	console.log('database: ');
	console.log(userDao);
	// get the salt and hash for the password
	// don't save the p/w -- encrypt it and save the salt and hash
	userDao.setPassword(req.body.password);
	userDao.save((err, data) => {
		if (!err) {
			console.log('msg: User Account Created Successfully!');
			res.render('login', {data: {active: 1, login : false}});
		} else {
			console.log('error occurred');
			res.render('register', {data: {active: 2, login : false}});
		}
	});
});

module.exports = router;
