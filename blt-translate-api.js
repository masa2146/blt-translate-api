var ytTranslate = require("./translate_ynd/translate-ynd-api");
var micTranslate = require("./translate_mcs/translate-mcs-api");
var autoDetect = require('./translate_ynd/translate-detect-ynd');


function translate(text, data) {

    return new Promise(function (resolve, reject) {
        if (data.from == null) {
            data = { from: "auto-detect", to: data.to };
        }
        micTranslate.translate(text, data).then(function (result) {
            tempResult = { text: result[0].translations[0].text, source: result[0].detectedLanguage.language };
            resolve(tempResult);
        }).catch(function (err) {
            if (data.from != "auto-detect") {
                ytTranslate.translate(text, data).then(function (result) {
                    newResult = { text: result.text[0], source: data.from };
                    resolve(newResult);
                });
            }
            else {
                autoDetect.detectLanguae(text).then(detectedVal => {
                    newData = { from: detectedVal.lang, to: data.to };
                    ytTranslate.translate(text, newData).then(function (result) {
                        newResult = { text: result.text[0], source: detectedVal.lang };
                        resolve(newResult);
                    });
                })
            }
        });
    });
}

module.exports = { translate };