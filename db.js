const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://localhost:27017/newsDB', 
{useNewUrlParser: true}).then(()=>{
    console.log("\nConnected to Database")
}).catch((err) => {
    console.log("\nNot Connected to Database ERROR! ", err);
});

module.exports = db;