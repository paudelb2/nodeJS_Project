const mongoose = require('./mongo');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const autoIncrement = require('mongoose-auto-increment');

const User = new mongoose.Schema(
	{
		userId: {
			type: Number,
			unique: true,
		}, // Primary Key
		name: String,
		email: {
			type: String,
			unique: true,
		},
		salt: String,
		hash: String,
		isAdmin: Boolean,
	},
	{ strict: true }
);
// define util fn to generate salt and hash
User.methods.setPassword = function (password) {
	// salt
	this.salt = crypto.randomBytes(16).toString('hex');
	// hash
	this.hash = crypto
		.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
		.toString('hex');
	console.log('salt: ' + this.salt); //already saved salt
	console.log('hash: ' + this.hash); //already saved hash
};

//util method to verify the p/w while login
User.methods.validatePassword = function (password) {
	console.log('password: ' + password);
	console.log('salt: ' + this.salt); //already saved salt
	console.log('hash: ' + this.hash); //already saved hash
	const hash = crypto
		.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
		.toString('hex');
	return this.hash == hash;
};

// generate Token using JWT
User.methods.generateJWT = function () {
	const today = new Date();
	const expirationDate = new Date(today);
	expirationDate.setDate(today.getDate() + 60);

	return jwt.sign(
		{
			email: this.email,
			userId: this.userId,
			exp: parseInt(expirationDate.getTime() / 1000, 10),
		},
		'secret'
	);
};

User.plugin(autoIncrement.plugin, {
	model: 'User',
	field: 'userId',
	startAt: 1,
});
module.exports = mongoose.model('User', User); // User is the Collection
