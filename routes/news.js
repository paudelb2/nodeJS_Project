const express = require('express');
const mongoose = require('mongoose');
const newsModel = mongoose.model('news');
const router = express.Router();



router.get('/', async(req,res)=>{

    try{
       const news = await newsModel.find()
       //res.json(news);
       res.render('news');
       
    }catch{
        res.send('Error'+err)
    }
    
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








