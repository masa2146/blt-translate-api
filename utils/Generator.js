const cheerio = require('cheerio');
const getUrls = require('get-urls');
const fetch = require('node-fetch');
const browseInspector = require("./BrowseInspector");
const url                = require('url');

function generateMicrosoftTrasnlatorId() {

    return new Promise(function (resolve, reject) {

        var url = "https://www.bing.com/translator"

        var isCompleted = false;
        var generatedId = "";

        const urls = Array.from(getUrls(url));
        const requests = urls.map(async url => {
            const res = await fetch(url);
            const html = await res.text();
            const $ = cheerio.load(html, { xmlMode: true });
            scriptContent = $('head').find('script').html().split('\n')
            for (let element of scriptContent) {
                if (isCompleted == false) {
                    contentArray = element.split(',');

                    for (let content of contentArray) {
                        if (content.includes('IG:') && content.includes('{') == false) {
                            var find = '\'';
                            var re = new RegExp(find, 'g');

                            var find = '"';
                            var re2 = new RegExp(find, 'g');

                            generatedId = content.split(":")[1].replace(re, "").replace(re2, '')
                            isCompleted = true;
                            resolve(generatedId);
                            break;
                        }
                    };
                }
            }

            if (generatedId == "" || generatedId == null) {
                reject("Error on Bing generate id");
            }
        });
    });

}

function generateYandexTranslatorId() {

    return new Promise(function (resolve, reject) {
        let baseUrl = "https://ceviri.yandex.com.tr/?lang=tr-en&text=nas%C4%B1ls%C4%B1n";
        let searchValue = "https://translate.yandex.net/api/v1";
        let foundValue = ""
        browseInspector.startInpect(baseUrl).then(result => {

            for(var ele in result) {
               // console.log(result[ele])
            if (result[ele].includes(searchValue)) {
                foundValue = result[ele]
                break;
            }
        };

        if(foundValue != null || foundValue != undefined || foundValue != ""){
           resolve(url.parse(foundValue, true).query.id)
        } 
      
    })

});


}


//////////////////////// YANDEX ID GENERATOR ///////////////////
/*


*/

module.exports = { generateMicrosoftTrasnlatorId, generateYandexTranslatorId }