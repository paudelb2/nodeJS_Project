const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoConfig = require('../config/mongoConfig.json');

mongoose.connect(mongoConfig.url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', () => {
	console.log('connection successful to ' + mongoConfig.url);
});

db.on('error', (error) => {
	console.log(error);
});

autoIncrement.initialize(db);
module.exports = mongoose;
