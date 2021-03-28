var express = require('express');
var router = express.Router();
const passport = require('passport');
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('login', { data: { active: 1, login: false } });
});

router.post('/', function (req, res, next) {
	console.log('body: ');
	console.log(req.body);

	// passport to validate user credentials
	passport.authenticate('local', function (err, user) {
		if (err) {
			console.log('Some error occurred');
			res.render('login');
		}
		// if user found
		if (user) {
			let loggedInUserInfo = {
				email: user.email,
				token: user.generateJWT(),
			};
			console.log(loggedInUserInfo);
			//res.json(loggedInUserInfo);
			localStorage.setItem('authToken', loggedInUserInfo.token);
			if (user.isAdmin) {
				console.log('admin');
				//render the news form(rendering index for now)
				res.render('news', {
					data: { title: 'express-app', active: 3, login: true },
					user: user,
				});
			} else {
				console.log('not admin');
				//in the case of not admin just show the hompage or login
				res.redirect('/login');
			}
		} else {
			res.send('not a valid user');
		}
	})(req, res);
});
module.exports = router;
