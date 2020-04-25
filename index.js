const os                 = require('os');
const cron               = require('cron');
const fs                 = require('fs');
const spawn              = require('child_process').spawn;
const yandexTranslate    = require("./api/yandex");
const microsoftTranslate = require("./api/microsoft");
const ID                 = require("./data/IdData");
const OptionalData       = require("./data/OptionalData")
const ErrorMessage       = require("./data/ErrorMessage");
const YandexData         = require("./data/YandexData")
const ConfigData         = require("./data/ConfigData")
const generator          = require('./utils/Generator');

var isRunningCron = false;
var outsideResolve;
var outsideReject;


class BltTranslate{

    constructor(){}

    /**
     * 
     * @param {*} data is  received values from request
     * @param {*} options If Microsoft Translate does not work then Yandex Translate will work. This operation works for each one request. 
     * You can change this operation. 
     * - 1: so initiially run Microsoft Translate if it not work the will run Yandex Translate, is default value.
     * - 2: At first Yandex Trasnlate runs then Microsoft Translate runs. 
     * - 3: just run Microsoft Translate.
     * - 4: just run Yandex Trasnlate.
     * @param {*} apiData inclue Yandex Translate api data. If you want to use free Yandex Translate then you can use default value
     * but if you want legal Yandex Translate API KEY then you must set this data {useAPI=false,apiKey="<YOUR_API_KEY>"} 
     */
     translate(data,options=OptionalData.MIC2YNDX,apiData = {useAPI:false,apiKey:""}) {

        YandexData.LEGAL_API_KEY = apiData.apiKey;
        YandexData.API_ACTIVE    = apiData.useAPI;

        OptionalData.SELECTED = options;

        if (isRunningCron == false) {
            this.startCrony();
            readIdData();
        }

        return new Promise(function (resolve, reject) {
            
            console.log("PROMIUSE")
            outsideResolve = resolve;
            outsideReject  = reject; 
            if (data.from == null) {
                data.from =  "auto-detect";
                if(options == OptionalData.MIC2YNDX || options == OptionalData.JUSTMIC ){
                    startMicrosoftTranslate(data);
                }
                else if(options == OptionalData.YNDX2MIC || options == OptionalData.JUSTYNDX){
                    startYandexTranslate(data);
                }
            }
            else{
                if(options == OptionalData.MIC2YNDX || options == OptionalData.JUSTMIC ){
                    startMicrosoftTranslate(data);
                }
                else if(options == OptionalData.YNDX2MIC || options == OptionalData.JUSTYNDX){
                    startYandexTranslate(data);
                }
            }
        });
    }

    /**
     * This function starts crony to generate Microsoft Translate id and Yandex Translate id.
     * Generated id writes on config.json file.
     * 
     * */
     startCrony() {
        startBrowserProxy()
        if(isRunningCron == true){
            var cronJob = cron.job("0 0 */1 * * *", function () {
                generateID();
            });
            cronJob.start();
        }
        else{
            generateID();
        }
        isRunningCron = true;
    }

    /**
     * 
     * @param {*} config create new proxy config data
     */
    setConfig(config){
        return new Promise(function(resolve,reject){
            if(config != null || config != undefined){
                ConfigData.defaultConfig = config;
            }
            console.log("setconfig")
            startBrowserProxy()
            resolve()
        })
    }
}

function startMicrosoftTranslate(data){
    console.log("MICROSOFT TRANSLATE")
    microsoftTranslate.translate(data).then(function (result) {
        outsideResolve(result);
    }).catch(function (err) {
        console.log(err)
        if(OptionalData.SELECTED == OptionalData.MIC2YNDX){
            startYandexTranslate(data)
        }
        else{
            outsideReject(ErrorMessage.GLOBAL_TRANSLATE_ERROR)
        }
    });
}

function startYandexTranslate(data){
    console.log("YANDEX TRANSLATE")
    yandexTranslate.translate(data).then(function (result) {
        outsideResolve(result);
    }).catch(err => {
        console.log(err)
        if(OptionalData.SELECTED == OptionalData.YNDX2MIC){
            startMicrosoftTranslate(data);
        }
        else{
            outsideReject(ErrorMessage.GLOBAL_TRANSLATE_ERROR)
        }
    });
}

function generateID(){
    console.log("generateID")
    generator.generateYandexTranslatorId().then(yndxData => {
        generator.generateMicrosoftTrasnlatorId().then(bingData => {
            let IDData = { bingId: bingData, yandexId: yndxData };
            fs.writeFileSync(__dirname+'/data/config.json', JSON.stringify(IDData));
            console.log("YANDEX ID  : " + yndxData);
            console.log("BING ID    : " + bingData);
            readIdData();

        });
    });
}

/**
 * 
 * Read generated id from config.json file
 */
function readIdData() {
        fs.readFile(__dirname+'/data/config.json', (err, data) => {
            if(data != undefined){
                let val = JSON.parse(data);
                ID.MICROSOFT_ID = val.bingId;
                ID.YANDEX_ID = val.yandexId;
            }
            if(err != undefined){
                console.log(err);
            }
        });
    }

function startBrowserProxy(){
    var filePath   = ""
    var runCommand = ""
    var parameters = []
    if(os.platform().includes("win")){
        console.log("win girdi")
        filePath = __dirname + "\\libs\\browsermob-proxy\\bin\\browsermob-proxy.bat"
        runCommand = filePath;
        parameters = ["-port" , ConfigData.defaultConfig.browserMob.port]
    }
    else{
        filePath = __dirname + "/libs/browsermob-proxy/bin/browsermob-proxy"
        runCommand = "sh"
        parameters = [filePath, "-port" , ConfigData.defaultConfig.browserMob.port]
    }
   
    var cmd = filePath + " -port " + ConfigData.defaultConfig.browserMob.port

    var out = fs.openSync("output.log","a")
    var err = fs.openSync("output.log","a")
    // [ 'ignore', 'ignore', 'ignore' ]
    // [ 'ignore',out, err ]
    console.log("oncesi")

    spawn(runCommand, parameters, {
        stdio: [ 'ignore',out, err ], // piping stdout and stderr to out.log
        detached: true,
        shell: false, windowsHide: true
    }).unref();
}

module.exports = BltTranslate