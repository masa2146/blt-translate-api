const { URL, URLSearchParams } = require('url');
const fetch         = require('node-fetch');
const YandexData    = require("../data/YandexData");
const HttpData      = require("../data/HttpRequestData");
const ErrorMessage  = require("../data/ErrorMessage");


var givenParams = {from:"",to:"",text:""};

function translate(req) {

    return new Promise(function (resolve, reject) {

        if (req.to == null || req.to == "") {
            return reject(ErrorMessage.TARGET_LANGUAE_NULL);
        }

        if (req.text == null) {
            return reject(ErrorMessage.TRANSLATE_TEXT_NULL);
        }

        givenParams.to   = req.to;
        givenParams.text = req.text;

        if (req.from == null || req.from == "" || req.from == "auto-detect" ) {

            givenParams.from = null;

            startTranslateWithDetectLanguage(req.text).then(result =>{
                if(result.code == 200){
                    resolve({text:result.text[0],source:givenParams.from});
                }
                else{
                    console.log(result);
                   // YandexData.API_ACTIVE == true ?  reject(new Error(ErrorMessage.YANDEX_API_TRANSLATE_ERROR)) :  reject(new Error(ErrorMessage.YANDEX_FREE_TRANSLATE_ERROR));
                }
            }).catch(err => {
                console.log(err);
                YandexData.API_ACTIVE == true ?  reject(new Error(ErrorMessage.YANDEX_API_TRANSLATE_ERROR)) :  reject(new Error(ErrorMessage.YANDEX_FREE_TRANSLATE_ERROR));
            });
        }
        else{
            givenParams.from = req.from;
            startTranslate(givenParams).then(result =>{
                if(result.code == 200){
                    resolve({text:result.text[0],source:givenParams.from});
                }
                else{
                    console.log(result);
                    YandexData.API_ACTIVE == true ?  reject(new Error(ErrorMessage.YANDEX_API_TRANSLATE_ERROR)) :  reject(new Error(ErrorMessage.YANDEX_FREE_TRANSLATE_ERROR));
                }
            }).catch(err=>{
                console.log(err);
                YandexData.API_ACTIVE == true ?  reject(new Error(ErrorMessage.YANDEX_API_TRANSLATE_ERROR)) :  reject(new Error(ErrorMessage.YANDEX_FREE_TRANSLATE_ERROR));
            });
        }
    });
}

function startTranslate(params){
    return new Promise(function(resolve,reject){
        if(YandexData.API_ACTIVE == true){
            // create data for legal translate
            var regularParam = {
                key: YandexData.LEGAL_API_KEY,
                lang: params.from + "-" + params.to,
                text: params.text
            };

            var url = new URL(YandexData.LEGAL_TRANSLATE_URL);
            url.search = new URLSearchParams(regularParam).toString();
    
            requestGetMethod(url).then(result=>resolve(result)).catch(err=>{
                console.log(ErrorMessage.YANDEX_API_TRANSLATE_ERROR+err);
                reject(new Error(ErrorMessage.YANDEX_API_TRANSLATE_ERROR))
            });
        }
        else{
            //create data for free translate
            var regularParam = {
                id: "0c3f2563.5ea0a867.70f9f39d-2-0",// This value will create with auto
                srv: YandexData.FREE_TRANSLATE_SRV,
                lang: params.from + "-" + params.to,
                reason: YandexData.FREE_TRANSLATE_REASON,
                format: YandexData.FREE_TRANSLATE_FORMAT
            }

            var url = new URL(YandexData.FREE_TRANSLATE_URL);
            url.search = new URLSearchParams(regularParam).toString();

            const requestBody = new URLSearchParams();
            requestBody.append("text", params.text);
            requestBody.append("options", YandexData.FREE_TRANSLATE_OPTIONS);

            requestPostMethod(url,requestBody).then(result=>resolve(result)).catch(err=>{
                console.log(ErrorMessage.YANDEX_API_TRANSLATE_ERROR+err);
                reject(new Error(ErrorMessage.YANDEX_API_TRANSLATE_ERROR))
            });
        }
    });

}

function startTranslateWithDetectLanguage(text){

    return new Promise(function(resolve,reject){
        if(YandexData.API_ACTIVE == true){
            // create data for legal translate
            var params = {
                key: YandexData.LEGAL_API_KEY,
                text: text
            };
            var url    = new URL(YandexData.LEGAL_DETECT_URL);
            url.search = new URLSearchParams(params).toString();
    
            requestGetMethod(url).then(result=>{
                givenParams.from = result.lang
                resolve(startTranslate(givenParams));
            }).catch(err=>{
                console.log(ErrorMessage.YANDEX_FREE_TRANSLATE_ERROR+err);
                reject(new Error(ErrorMessage.YANDEX_FREE_TRANSLATE_ERROR))
            });;
        }
        else{
            var params = {
                sid: '0c3f2563.5ea0a867.70f9f39d',// create generator id
                srv: YandexData.FREE_TRANSLATE_SRV,
                text: text,
                options: YandexData.FREE_DETECT_OPTIONS
            };
            var url    = new URL(YandexData.FREE_TRANSLATE_DETECT_URL);
            url.search = new URLSearchParams(params).toString();
    

            requestGetMethod(url).then(result=>{
                givenParams.from = result.lang
                resolve(startTranslate(givenParams));
            }).catch(err=>{
                console.log(ErrorMessage.YANDEX_FREE_TRANSLATE_ERROR+err);
                reject(new Error(ErrorMessage.YANDEX_FREE_TRANSLATE_ERROR))
            });;
        }
    });
}

// TODO: declare new promise
function requestGetMethod(url){

    return new Promise(function (resolve, reject){
        fetch(url, {
            method: HttpData.HTTP_GET_METHOD,
            headers: HttpData.HTTP_URL_ENCODED_HEADER
        }).then(res => res.json())
            .then(json => {
                resolve(json);
            }).catch(function (err) {
                console.log(ErrorMessage.YANDEX_TRANSLATE_ERROR + err);
                reject(new Error(ErrorMessage.YANDEX_TRANSLATE_ERROR));
            });
    });
}

function requestPostMethod(url,requestBody){
    return new Promise(function (resolve, reject){

        fetch(url, {
            method  : HttpData.HTTP_POST_METHOD,
            headers : HttpData.HTTP_URL_ENCODED_HEADER,
            body    : requestBody
        }).then(res => res.json())
            .then(json => {
                resolve(json);
            }).catch(function (err) {
                console.log(ErrorMessage.YANDEX_TRANSLATE_ERROR + err);
                reject(new Error(ErrorMessage.YANDEX_TRANSLATE_ERROR));
            });
    });
}

module.exports = { translate };
