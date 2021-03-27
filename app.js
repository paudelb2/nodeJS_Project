const express = require('express');
const axios = require('axios');
const db = require('./db');
const News = require('./models/news');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000

const iplocate = require("node-iplocate")
const publicIp = require('public-ip')


const userloc = async ()=>{
    try{
        const ip = await publicIp.v4()
        console.log("ip : ", ip)
        return await iplocate(ip)    
    }catch(err){
        console.log(err)
    }
}

const getWeather = async (lon, lat) =>{
    const apikey = 'fbe7fd72089ac349eb57def5d2bc7b28'
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?lon=${lon}&lat=${lat}&appid=${apikey}&units=imperial`
    console.log("getWeather : apiUrl : ", apiUrl)
    try{
        return await axios.get(apiUrl)
    }catch(err){
        console.log(err)
    }
}

app.get('/', (req,res)=>{

    userloc().then((loc)=>{  
        const lon = loc.longitude
        const lat = loc.latitude
        console.log(`lon: ${lon}, lat: ${lat}`)

        getWeather(lon,lat).then((response)=>{
            const weather = {
                description: response.data.weather[0].main,
                icon: "http://openweathermap.org/img/w/" + response.data.weather[0].icon + ".png",
                temperature: response.data.main.temp,
                temp_min: response.data.main.temp_min,
                temp_max: response.data.main.temp_max,
                city: response.data.name
            }
            console.log("weather: ", weather)
            res.render('home.ejs', {
                weather
            })   
        })
    })
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })