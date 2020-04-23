# blt-translate-api

**Use Microsoft Translate And Yandex Translate**

You can translate using by multi translate server(Yandex and Microsoft). 
When Microsoft translate give a error then activated Yandex translate. These operations take place for each request.
If you want to use Yandex to Microsoft translate then you can change operation value .(You can see examples). 
Also you can run just one(Microsoft or Yandex).
You can use legal Yandex Translate API.

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
