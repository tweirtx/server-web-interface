const http = require('http');
const pm2 = require('pm2');
const fs = require('fs');

function enumerate() {
    var allFiles = fs.readdir('');
}
function restartProcess(procName) {
    pm2.restart(procName);
}
function stopProcess(procName) {
    pm2.stop(procName);
}
function startProcess(procName) {
    pm2.start(procName);
}
function gitPull(procDir) {
    pm2.start("cd "+procDir+ " && git pull");
    return true;
}

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!');
}).listen(8080);

console.log("Ready!");