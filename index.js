const yandexTranslate    = require("./api/yandex");
const microsoftTranslate = require("./api/microsoft");
const generator          = require('./utils/Generator');
const globalId           = require("./utils/GlobalId");
const OptionalData       = require("./data/OptionalData")
const ErrorMessage       = require("./data/ErrorMessage");
const cron               = require('cron');
const fs                 = require('fs');

var isRunningCron = false;
var outsideResolve;
var outsideReject;
var optionalValue;
/**
 * 
 * @param {*} data is  received values from request
 * @param {*} options If Microsoft Translate does not work then Yandex Translate will work. This operation works for each one request. 
 * You can change this operation. 
 * - 1: so initiially run Microsoft Translate if it not work the will run Yandex Translate, is default value.
 * - 2: At first Yandex Trasnlate runs then Microsoft Translate runs. 
 * - 3: just run Microsoft Translate.
 * - 4: just run Yandex Trasnlate.
 */
function translate(data,options=OptionalData.MIC2YNDX) {


    if (isRunningCron == false) {
        startCrony();
        readIdData();
    }
    optionalValue = options;

    return new Promise(function (resolve, reject) {

        outsideResolve = resolve;
        outsideReject  = reject; 

        if (data.from == null) {
            data.from =  "auto-detect";
            if(options == OptionalData.MIC2YNDX || options == OptionalData.JUSTMIC ){
                startMicrosoftTranslate(data);
            }
            else{
                startYandexTranslate(data);
            }
        }
    });
}

function startMicrosoftTranslate(data){
    microsoftTranslate.translate(data).then(function (result) {
        outsideResolve(result);
    }).catch(function (err) {
        console.log(err)
        if(optionalValue == OptionalData.MIC2YNDX){
            startYandexTranslate(data)
        }
        else{
            outsideReject(ErrorMessage.GLOBAL_TRANSLATE_ERROR)
        }
       
      
    });
}

function startYandexTranslate(data){
        yandexTranslate.translate(data).then(function (result) {
            outsideResolve(result);
        }).catch(err => {
            console.log(err)
            if(optionalValue == OptionalData.YNDX2MIC){
                startMicrosoftTranslate(data);
            }
            else{
                outsideReject(ErrorMessage.GLOBAL_TRANSLATE_ERROR)
            }
            
        });
    
}

/**
 * This function starts crony to generate Microsoft Translate id and Yandex Translate id.
 * Generated id writes on config.json file.
 * 
 * */
function startCrony() {
    console.log("START CRONY")
    var cronJob = cron.job("0 0 */1 * * *", function () {

        generator.generateMicrosoftTrasnlatorId().then(bingData => {
            generator.generateYandexTranslatorId().then(yndxData => {
                let IDData = { bingId: bingData, yandexId: yndxData };
                fs.writeFileSync(__dirname+'/config.json', JSON.stringify(IDData));
                console.log("YANDEX ID  : " + yndxData);
                console.log("BING ID    : " + bingData);
                readIdData();

            });
        });
    });
    cronJob.start();
    isRunningCron = true;
}

/**
 * 
 * Read generated id from config.json file
 */
function readIdData() {
    fs.readFile(__dirname+'/data/config.json', (err, data) => {
        if(data != undefined){
            let val = JSON.parse(data);
            globalId.setBindID(val.bingId);
            globalId.setYandexID(val.yandexId);
        }
        if(err != undefined){
            console.log(err);
        }
    });
}


module.exports = { translate };