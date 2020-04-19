const ytTranslate = require("./translate_ynd/translate-ynd-api");
const micTranslate = require("./translate_mcs/translate-mcs-api");
const autoDetect = require('./translate_ynd/translate-detect-ynd');
const generator = require('./generator/Generator');
const cron = require('cron');
const fs = require('fs');
const globalId = require("./generator/GlobalId");


var isRunningCron = false;


function translate(text, data) {

    if (isRunningCron == false) {
        startCrony()
    }

    readIdData();

    return new Promise(function (resolve, reject) {
        if (data.from == null) {
            data = { from: "auto-detect", to: data.to };
        }
        micTranslate.translate(text, data).then(function (result) {
            tempResult = { text: result[0].translations[0].text, source: result[0].detectedLanguage.language };
            resolve(tempResult);
        }).catch(function (err) {
            console.log("YANDEX TRANSLATE ")
console.log(err)
            if (data.to == null || data.to == "") {
                reject("Target language is null");
            }

            if (text == null || text == "") {
                reject("Text  is null");
            }

            if (data.from != "auto-detect") {
                ytTranslate.translate(text, data).then(function (result) {
                    newResult = { text: result.text[0], source: data.from };
                    resolve(newResult);
                }).catch(err => {
                    console.log("ERROR: 1");
                    console.log(err)
                    reject(err)
                });
            }
            else {
                autoDetect.detectLanguae(text).then(detectedVal => {

                    newData = { from: detectedVal.lang, to: data.to };
                    ytTranslate.translate(text, newData).then(function (result) {
                        newResult = { text: result.text[0], source: detectedVal.lang };
                        resolve(newResult);
                    }).catch(err => {
                        console.log("ERROR: 2 ");
                        reject(err)
                    });
                })
            }
        });
    });
}
/**
 * 
 * 
 * */
function startCrony() {
    console.log("START CRONY")
    var cronJob = cron.job("*/10 * * * * *", function () {

        generator.generateBingTrasnlatorId().then(bingData => {
            generator.generateYandexTranslatorId().then(yndxData => {
                let IdData = { bingId: bingData, yandexId: yndxData };
                fs.writeFileSync('generate_id.json', JSON.stringify(IdData));
                console.log("YANDEX ID  : " + yndxData);
                console.log("BING ID    : " + bingData);
                readIdData(true);

            });
        });
    });
    cronJob.start();
    isRunningCron = true;
}

/**
 * 
 * @param {*} fromCrony : If this function call by startCrony() then true else false.
 */
function readIdData(fromCrony = false) {
    if (fromCrony == false) {
        if (globalId.getYandexID() == null || globalId.getYandexID() == "" || globalId.getBindID() == null || globalId.getBindID() == "") {
            fs.readFile('generate_id.json', (err, data) => {
                let val = JSON.parse(data);
                console.log("SET EDILDI")
                globalId.setBindID(val.bingId);
                globalId.setYandexID(val.yandexId);
            });
        }
    }
    else {
        fs.readFile('generate_id.json', (err, data) => {
            let val = JSON.parse(data);
            globalId.setBindID(val.bingId);
            globalId.setYandexID(val.yandexId);
        });
    }
}


module.exports = { translate };