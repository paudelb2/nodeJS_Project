var express = require('express');
var router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');
const User = require('../model/user');
const NewsModel = require('../model/news.model');
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
 
  // const postnews = new newsModel()
    console.log('body:')
    console.log(req.body);

    let newsDao = new NewsModel(req.body);
   
    if(req.body.title&&req.body.description&&req.body.url&&req.body.urlToImage&&req.body.publishedAt){
       
    newsDao.save((err,data)=>{
        if(!err)
        {
            console.log('news saved in db');
            console.log(data);
            res.send('success');
            
        }
        else{
            
            console.log('Error in newsschema');
            res.send('Error ' +err);
            
        }
        });
    }
})

    module.exports = router;







