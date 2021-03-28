const mongoose = require('./mongo');
const autoIncrement = require('mongoose-auto-increment');
var NewsSchema = new mongoose.Schema({
	newsId: {
		type: Number,
		unique: true,
	}, // Primary Key
	title: { type: String },
	description: { type: String },
	url: { type: String },
	urlToImage: { type: String },
	publishedAt: { type: Date, default: Date.now },
});
NewsSchema.plugin(autoIncrement.plugin, {
	model: 'NewsSchema',
	field: 'newsId',
	startAt: 1,
});
module.exports = mongoose.model('news', NewsSchema);
