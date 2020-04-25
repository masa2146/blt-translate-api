const ConfigData = require("./data/ConfigData");
var spawn = require("child_process").spawn;
var fs = require("fs");
var os = require("os");
const exec = require("child_process").execSync;
const webdriver = require('selenium-webdriver');



startBrowserProxy()



function startBrowserProxy() {
  var filePath = "";
  var runCommand = "";
  var parameters = [];
  if (os.platform().includes("win")) {
    console.log("win girdi");
    filePath =
      __dirname + "\\libs\\browsermob-proxy\\bin\\browsermob-proxy.bat";
    runCommand = filePath;
    parameters = ["-port", ConfigData.defaultConfig.browserMob.port];
  } else {
    filePath = __dirname + "/libs/browsermob-proxy/bin/browsermob-proxy";
    runCommand = "sh";
    parameters = [filePath, "-port", ConfigData.defaultConfig.browserMob.port];
  }
  let options = {
    spawn: true,
    cwd: "c:/Users",
  };

  var cmd = filePath + " -port " + ConfigData.defaultConfig.browserMob.port;

  var out = fs.openSync("output.log", "a");
  var err = fs.openSync("output.log", "a");
  // [ 'ignore', 'ignore', 'ignore' ]
  // [ 'ignore',out, err ]
  console.log("oncesi");

  spawn(runCommand, parameters, {
    stdio: ["ignore", out, err], // piping stdout and stderr to out.log
    detached: true,
  }).unref();

  console.log("calisti");
}
