var languages = require('./languages');
const fetch = require('node-fetch');
const qs = require("querystring");
const { URL, URLSearchParams } = require('url');
const globalId = require("../generator/GlobalId");

function translate(text, opt) {
    var url = "https://translate.yandex.net/api/v1/tr.json/translate";

   // globalId.setYandexID("5380da42.5e9cb461.710422b0-0-0");
    console.log(opt.from);

    return new Promise(function (resolve, reject) {

        if (opt.to == null || opt.to == "") {
            return reject("Target language is null");
        }

        var data = {
            id: "5380da42.5e9cb461.710422b0-0-0",//globalId.getYandexID(),//"1438c75e.5e92f884.43c2b8e1-2-0",
            srv: "tr-text",
            lang: opt.from + "-" + opt.to,
            reason: "paste",
            format: "text"
        };


        console.log(data);
        const params = new URLSearchParams();

        params.append("text", text);
        params.append("options", 4);

        var url = new URL('https://translate.yandex.net/api/v1/tr.json/translate');
        url.search = new URLSearchParams(data).toString();

        console.log("URL:");
        console.log(url);

        console.log("PARAMETERS:");
        console.log(params);


        fetch(url, {
            method: 'post',
            body: params,
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }).then(res => res.json())
            .then(json => {
                console.log(json);
                resolve(json);
            }).catch(function (err) {
                console.log("YANDEX TRANSLATE ERROR: " + err);
                reject(new Error("Yandex Translate Error"));
            });
    });
}

module.exports = { translate };
module.exports.languages = languages;