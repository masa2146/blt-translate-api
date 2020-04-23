const cheerio = require('cheerio');
const getUrls = require('get-urls');
const fetch = require('node-fetch');



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
        url = "https://ceviri.yandex.com.tr/?lang=tr-en&text=kimsin";
        const urls = Array.from(getUrls(url));
        var generatedId = "";

        const requests = urls.map(async url => {
            const res = await fetch(url);
            const html = await res.text();
            const $ = cheerio.load(html, { xmlMode: true });
            scriptContent = $('body').find('script').html().split('\n')

            for (let element of scriptContent) {
                if (element.includes('SID')) {
                    var find = '\'';
                    var re = new RegExp(find, 'g');
                    generatedId = element.trim().split(':')[1].replace(re, '').replace(',', '')
                    resolve(generatedId);
                    break;
                }
            }
            if (generatedId == "" || generatedId == null) {
                //reject("Error on Yandex generate id");
                resolve(generatedId);
            }
        });
    });


}


//////////////////////// YANDEX ID GENERATOR ///////////////////
/*


*/

module.exports = { generateMicrosoftTrasnlatorId, generateYandexTranslatorId }