var languages = require('./languages');
var querystring = require('querystring');
const axios = require('axios')

function detectLanguae(text) {
    var url = "https://translate.yandex.net/api/v1/tr.json/detect";
    var params = {
        sid: 'cd8aa22f.5e92fdba.b9a5b6e3',// create generator id
        srv: 'tr-text',
        text: text,
        options: 1
    }

    var tempUrl = url + '?' + querystring.stringify(params);
    return new Promise(function (resolve, reject) {
        axios.get(tempUrl).then(response => {
           // console.log(response.data);
            resolve(response.data);
        }).catch(function (error) {
            // handle error
            //console.log("Auto detect error: " + error);
            reject(error);
        });
    });
}
module.exports = { detectLanguae }