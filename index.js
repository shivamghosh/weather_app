const express = require("express");
const path = require("path");
const fs = require("fs");
const request = require('request');
const axios = require('axios');

if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}
const APIkey=process.env.APIkey;

const app = express();
const port = 3000;

app.use('/static', express.static('public')) ;
app.use(express.urlencoded());

//template engine
app.set('view engine', 'pug') 
 
app.get('/', (req, res)=>{
    const params = {'title': 'Weather App','image':'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/rainy-1.svg','text0':'','text1':'','text2':'','text3':'','text4':'','text5':'', 'text6':'', 'text00':''}
    res.status(200).render('index.pug', params);
})

//fetching weather details
async function fetchInfo(city)
{
    try{
    const response=await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`);
    data_json=response.data;
    var text0="Weather Description: "+data_json.weather[0].description;
    var text1="Current Temperature: "+data_json.main.temp+" °C";
    var text2="Min Temperature: "+data_json.main.temp_min+" °C";
    var text3="Max Temperature: "+data_json.main.temp_max+" °C";
    var text4="Pressure: "+data_json.main.pressure+" hPa";
    var text5="Humidity: "+data_json.main.humidity+" %";
    var text6="Wind-speed: "+data_json.wind.speed+" m/s";
    var text00="City: "+city;
    var image="http://openweathermap.org/img/wn/"+data_json.weather[0].icon+"@2x.png"
    const params ={'title': 'Weather App','text1':text1,'text2':text2,'text3':text3,'text4':text4,'text5':text5, 'text6':text6,'image': image,'text0':text0, 'text00':text00};
    return params;
    }
    catch(err){
        var text="Data not found";
        const params = {'title': 'Weather App','text0':'','text1':text,'text2':'','text3':'','text4':'','text5':'', 'text6':'','image':'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/rainy-1.svg', 'text00':''};
        return params;
    }
}


app.post('/',(req,res)=>{
    const city=req.body.city;

        (async () => {
            res.status(200).render('index.pug',await fetchInfo(city))
         })()
    
})

app.listen(port,()=>{
    console.log("Listening to port "+port);
})