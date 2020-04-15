var languages = require('./languages');
var querystring = require('querystring');
const axios = require('axios')

function translate(text, opt) {
    var url = "https://translate.yandex.net/api/v1/tr.json/translate";

    return new Promise(function (resolve, reject) {

        if (opt.to == null || opt.to == "") {
            return reject(new Error("Target language is null"));
        }
       
        var parameters = { text: text, options: 4 };
        var data = {
            id: "1438c75e.5e92f884.43c2b8e1-2-0",
            srv: "tr-text",
            lang: opt.from + "-" + opt.to,
            reason: "paste",
            format: "text"
        };

        var tempUrl = url + '?' + querystring.stringify(data);
        var res = { param: parameters, url: tempUrl };

        axios({
            method: 'post',
            url: res.url,
            data: querystring.stringify({
                text: res.param.text,
                options: res.param.options
            }),
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(obj => {
            resolve(obj.data);
        }).catch(function (err) {
            console.log("YANDEX TRANSLATE ERROR: "+err);
            reject(new Error("Microsoft Translate Error"));
        });
    });
}

module.exports = { translate };
module.exports.languages = languages;