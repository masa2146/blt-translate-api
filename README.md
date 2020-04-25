# blt-translate-api

**Use Microsoft Translate And Yandex Translate**

You can translate using by multi translate server(Yandex and Microsoft). 
When Microsoft translate give a error then activated Yandex translate. These operations take place for each request.
If you want to use Yandex to Microsoft translate then you can change operation value .(You can see examples). 
Also you can run just one(Microsoft or Yandex).
You can use legal Yandex Translate API.

### Requierments
- Mozilla Firefox
- java
- node js


### Description
This project contains Microsoft and Yandex Translator. Automatic generate translate id for both translator.
Id generates every one hour on background(It will get to change  time synchronize in the next time). 
This background proccess needs **java** and ***Firefox Browser* to run. 

Perhaps the id usage may have expired in config.json. So run the project you should wait a few minutes to create new id.

## Examples

#### Example initialize data where come from request

``` javascript
var data = {from:"en",to:"tr",text:"hello"}
// or you can use without 'from'
data = {to:"tr",text:"hello"}

 ```

- You can declare **options** is optional value. When you leave it blank default value is 1
Other values mean is;

> "1" Microsoft Translate  to Yandex Translate (When Microsoft Translate does not work then run Yandex translate)

> "2" Yandex Translate to Microsoft Translate  (When Yandex Translate does not work then run Microsoft translate)

> "3" just use Microsoft Translate

> "4" just use Yandex Translate

``` javascript
var options = 4

```

#### Default Usage:

``` javascript

    bltTranslate.translate(data).then(function (result) {
        res.json(result);
        console.log('Request took: ' + moment().diff(startDate) + ' ms.');
    }).catch(err => res.json({message:err}));

```

#### Use With *options*:

``` javascript

var options = 1 // Default (Microsoft to Yandex)
 options  = 2 //Yandex to Microsoft)
 options  = 3 // just Microsoft
 options  = 4 // just Yandex

    bltTranslate.translate(data,options).then(function (result) {
        res.json(result);
        console.log('Request took: ' + moment().diff(startDate) + ' ms.');
    }).catch(err => res.json({message:err}));

```


If you want to your Yandex API KEY  then you must declate value as example. 

#### Use With Yandex API:

``` javascript

 var apiData={useAPI:true,apiKey:"<YOUR_YANDEX_API_KEY>"}
    bltTranslate.translate(data,options,apiData).then(function (result) {
        res.json(result);
        console.log('Request took: ' + moment().diff(startDate) + ' ms.');
    }).catch(err => res.json({message:err}));

```


#### All Case Usage
``` javascript

var BltTranslate = require("blt-translate-api");
var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');
var moment = require('moment');
var app = express();


var bltTranslate = new BltTranslate()

//Example proxy config 
// this config data use to create new Free Yandex Translate ID 
const defaultConfig = {
    browserMob:{ host:'localhost',  port: 7778, protocol:'http' },
    };

bltTranslate.setConfig(defaultConfig)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(1923, function () {
    console.log("Port listening 1923...");
});

app.get('/api/translate', function (req, res) {

    // this value just get response time 
    var startDate = moment();

    var q = url.parse(req.url, true).query;
    var apiData = { useAPI: false, apiKey: "<YOUR_YANDEX_API_KEY>" }

    bltTranslate.translate(q, 4, apiData).then(function (result) {
        res.json(result);
        console.log('Request took: ' + moment().diff(startDate) + ' ms.');
    }).catch(err => res.json({ message: err }));
});

```
