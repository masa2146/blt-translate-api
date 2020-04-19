global.bindID = "";
global.yandexID = "";

function setBindID(val0) {
    global.bindID = val0.trim();

}

function getBindID() {
    return global.bindID.trim();
}

function setYandexID(val0) {
    global.yandexID = val0.trim()+"-0-0";
}

function getYandexID() {
    return global.yandexID.trim();
}

module.exports = {setBindID,getBindID,setYandexID,getYandexID}