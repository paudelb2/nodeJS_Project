const mongoose = require('./mongo');

var NewsSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    url: { type: String },
    urlToImage: { type: String },
    publishedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('news', NewsSchema);
