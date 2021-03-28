var express = require('express');
var router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');
var User = require('../model/user');
const jwt = require('jsonwebtoken');
const NewsModel = require('../model/news.model');

router.get('/', function (req, res, next) {
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
            NewsModel.find({}, (error, newsData)=>{
                if(!error ) {
                    console.log(newsData);
					if (user.isAdmin) {
						console.log('admin BOP BOP');
						res.render('data', {data: { admin: true, news: newsData, active: 4, login: true}});
					} else {
						console.log('non-admin');
						res.send('data', {data: { admin: false, news: newsData, active: 4, login: true }});
					}
				} else{
				console.log('could not get news from db');
				}
			});
	}});
});

router.post('/', (req, res) => {

    console.log('body')
    console.log(req.body);

});



// dataDao.save((err, data)=>{
//     if(!err)
//     {
//         console.log('news saved in db');
//         console.log(data);
//         res.send('success');
//     }
//     else{
//         console.log('error in log')
//         res.send('Error')
//     }
// });

// Update User
router.put('/update_article',(req,res)=>{
    db.collection(news)
        .findOneAndUpdate({"title":req.body.name},{
            $set:{
                name:req.body.name,
                email:req.body.email,
                phone:req.body.phone
            }
        },{
            upsert:true
        },(err,result) => {
            if(err) return res.send(err);
            res.send(result)
        })
})

// error handler
router.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = router;