var express = require('express');
var router = express.Router();
const passport = require('passport');
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('login');
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
				res.redirect('/');
			} else {
				console.log('not admin');
				//in the case of not admin just show the hompage or login
				res.send('open the news page');
			}
		} else {
			res.send('not a valid user');
		}
	})(req, res);
});
module.exports = router;
