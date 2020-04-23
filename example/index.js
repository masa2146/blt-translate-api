var bltTranslate = require("../index");
var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');
var moment = require('moment');
var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(1923, function () {
    console.log("Port listening 1923...");
});

app.get('/api/translate', function (req, res) {


    var startDate = moment();
    var q = url.parse(req.url, true).query;
    var apiData={useAPI:true,apiKey:"<YOUR_YANDEX_API_KEY>"}
    bltTranslate.translate(q,4,apiData).then(function (result) {
        res.json(result);
        console.log('Request took: ' + moment().diff(startDate) + ' ms.');
    }).catch(err => res.json({message:err}));
});