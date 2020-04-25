const webdriver = require('selenium-webdriver');
const selProxy = require('selenium-webdriver/proxy');
const oldBmpClient = require('browsermob-proxy-client')
const firefox = require('selenium-webdriver/firefox');
const firefoxdriver = require('geckodriver');
const ConfigData = require("../data/ConfigData")

function startInpect(url,) {
    var result
    return new Promise(function (resolve, reject) {
        var bmpClient = oldBmpClient.createClient(ConfigData.defaultConfig)
        bmpClient.start()

            .then(() => {
                bmpClient.createHar()
            })
            .then(() => {
                driver = new webdriver.Builder()
                    .withCapabilities({ 'browserName': "firefox", acceptSslCerts: true, acceptInsecureCerts: true })
                    .setProxy(selProxy.manual({ http: 'localhost:' + bmpClient.proxy.port, https: 'localhost:' + bmpClient.proxy.port }))
                    .setFirefoxOptions(new firefox.Options().headless())
                    .build();

                return driver.get(url)
                    .then(() => bmpClient.getHar())
                    .then(harData => {
                        result = getRequestUrls(harData.log.entries);

                    });
            })
            .then(() => {
                bmpClient.end()
                driver.close()
                resolve(result)

            }).catch(err => {
                console.error("browsermob-proxy-client ERROR: ")
                console.error(err);
            });
    })
}

function getRequestUrls(requestEntries) {
    var urls = [];
    var i = 0;
    requestEntries.forEach(obj => {
        i = i + 1
        console.log(i + ' request: ', obj.request.url);
        urls.push(obj.request.url);
    });
    return urls
}

module.exports = { startInpect }