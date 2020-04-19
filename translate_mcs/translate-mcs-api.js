var languages = require('../translate_ynd/languages');
const fetch = require('node-fetch');
const { URL, URLSearchParams } = require('url');
const globalId = require("../generator/GlobalId");



function translate(text, opt) {    

console.log("GLOBASL: "+global.bindID);

    return new Promise(function (resolve, reject) {

        if (opt.to == null || opt.to == "") {
             reject("Target language is null");
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

        const params = new URLSearchParams();
         
        params.append("fromLang", opt.from);
        params.append("text", text);
        params.append("to", opt.to);

        var data = {
            isVertical: "1",
            IG:  globalId.getBindID(),//"D7A8614BE6B2403AA94E971533395BB9",
            IID: "translator.5026.1"
        };
        var url = new URL('https://www.bing.com/ttranslatev3');
        url.search = new URLSearchParams(data).toString();


        fetch( url,{
            method: 'post',
            body: params,
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }).then(res => res.json())
        .then(json => resolve(json)).catch(function (err) {
            console.log("MICROSOFT TRANSLATE ERROR: "+err);
            reject(new Error("Microsoft Translate Error"));
        });
    });
}

module.exports = { translate };
module.exports.languages = languages;