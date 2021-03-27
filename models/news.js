const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    url: {type: String, required: true},
    urlToImage: {type: String, required: true},
    publishedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('news', newsSchema);