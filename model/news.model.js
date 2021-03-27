const mongoose = require('./mongo');


var NewsSchema = new mongoose.Schema({
    title: {type:String},
    description: {type:String},
    url: {type:String},
    urlToImage: {type:String},
    publishedAt: {type:String}
    
});


module.exports = mongoose.model('news', NewsSchema);