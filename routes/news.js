const express = require('express');
const mongoose = require('mongoose');
const newsModel = mongoose.model('news');
const router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');
const User = require('../model/user');
const jwt = require('jsonwebtoken');


router.get('/', async(req,res)=>{
    const token = localStorage.getItem('authToken');
	console.log('token: ' + token);

	if (!token) {
		res.redirect('/login');
	}
	jwt.verify(token, 'secret', async function (err, decode) {
		if (err) {
			res.redirect('/login');
		}
		console.log(decode.userId, decode.email);
		const user = await User.findOne({ email: decode.email });

		console.log(user);

		if (!user) {
			res.redirect('/login');
		} else {
			if (user.isAdmin) {
				console.log('admin');
				try{
                    const news = await newsModel.find()
                    //res.json(news);
                    res.render('news',  {data:{ title: 'express-app', active: 3, login : true}});
                    
                 }catch{
                     res.send('Error'+err)
                 }
			} else {
				console.log('non-admin');
				res.send('I am not an admin');
			}
		}
	});
})

router.post('/', (req,res)=>{
 
   const postnews = new newsModel()

      postnews.title= req.body.title,
      postnews.description= req.body.description,
      postnews.url= req.body.url,
      postnews.urlToImage= req.body.urlToImage,
      postnews.publishedAt= req.body.publishedAt


    if(req.body.title&&req.body.description&&req.body.url&&req.body.urlToImage&&req.body.publishedAt){
       
    postnews.save((err)=>{
        if(!err)
        {
            res.send('success');
        }
        else{
            res.send('Error' +err);
        }
        });
    }
})

    module.exports = router;








