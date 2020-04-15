var languages = require('../translate_ynd/languages');
var querystring = require('querystring');
const axios = require('axios')

function translate(text, opt) {
    var url = "https://www.bing.com/ttranslatev3";

    return new Promise(function (resolve, reject) {

        if (opt.to == null || opt.to == "") {
            return reject(new Error("Target language is null"));
        }

        if (opt.from == "zh-CN") {
            opt.from == "zh-Hans";
        }
        else if (opt.from == "zh-TW") {
            opt.from = "zh-Hant";
        }

        if (opt.to == "zh-CN") {
            opt.to == "zh-Hans";
        }
        else if (opt.to == "zh-TW") {
            opt.to = "zh-Hant";
        }

        var parameters = { fromLang: opt.from, text: text, to: opt.to };
        var data = {
            isVertical: "1",
            IG: "D7A8614BE6B2403AA94E971533395BB9",
            IID: "translator.5026.1"
        };

        var tempUrl = url + '?' + querystring.stringify(data);
        var res = { param: parameters, url: tempUrl };

        axios({
            method: 'post',
            url: res.url,
            data: querystring.stringify({
                fromLang: res.param.fromLang,
                text: res.param.text,
                to: res.param.to
            }),
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }).then(obj => {
            resolve(obj.data);
        }).catch(function (err) {
            console.log("MICROSOFT TRANSLATE ERROR: " + err);
            reject(new Error("Microsoft Translate Error"));
        });
    });
}

module.exports = { translate };
module.exports.languages = languages;