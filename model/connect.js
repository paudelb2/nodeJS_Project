const chalk = require('chalk');
const mongoose = require('mongoose');

const news = require('./news.model')

mongoose.connect("mongodb://localhost:27017/newsdb", {useNewUrlParser: true, useUnifiedTopology: true}, (err)=>{
    if(!err){
        console.log(chalk.bold.yellow("Database connected successfully!"));
    }
    else{
        console.log("Database connection failed");
    }
})