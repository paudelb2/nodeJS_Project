const mongoose = require('./mongo');
var SportsSchema = new mongoose.Schema({
	title: { type: String },
	description: { type: String },
	url: { type: String },
	urlToImage: { type: String },
	publishedAt: { type: Date, default: Date.now},
	source: { type: String },
	author: { type: String },
});
module.exports = mongoose.model('SportsSchema', SportsSchema);
