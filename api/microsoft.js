const { URL, URLSearchParams } = require('url');
const fetch         = require('node-fetch');
const globalId      = require("../utils/GlobalId");
const MicrosoftData = require("../data/MicrosoftData");
const HttpData      = require("../data/HttpRequestData");
const ErrorMessage  = require("../data/ErrorMessage");


function translate(req) {

    return new Promise(function (resolve, reject) {

        if (req.to == null || req.to == "") {
            reject(ErrorMessage.TARGET_LANGUAE_NULL);
        }

        if (req.from == "zh-CN") {
            req.from == "zh-Hans";
        }
        else if (req.from == "zh-TW") {
            req.from = "zh-Hant";
        }

        if (req.to == "zh-CN") {
            req.to == "zh-Hans";
        }
        else if (req.to == "zh-TW") {
            req.to = "zh-Hant";
        }

        const data = new URLSearchParams();

        data.append("fromLang", req.from);
        data.append("text", req.text);
        data.append("to", req.to);

        var params = {
            isVertical: MicrosoftData.GET_PARAM_IS_VERTICAL,
            IG: globalId.getBindID(),
            IID: MicrosoftData.GET_PARAM_IID
        };
        var url = new URL(MicrosoftData.FREE_API_URL);
        url.search = new URLSearchParams(params).toString();


        fetch(url, {
            method: HttpData.HTTP_POST_METHOD,
            body: data,
            headers: HttpData.HTTP_URL_ENCODED_HEADER
        }).then(res => res.json())
            .then(json => resolve({text: json[0].translations[0].text, source: json[0].detectedLanguage.language})).catch(function (err) {
                console.log(ErrorMessage.MICROSOFT_TRANSLATE_ERROR + err);
                reject(new Error(ErrorMessage.MICROSOFT_TRANSLATE_ERROR));
            });
    });
}

module.exports = { translate };
