const http = require('http');
const pm2 = require('pm2');
const fs = require('fs');
const shell = require('shell');
var ref;

function enumerate() {
    var processes = [];
    fs.readdirSync('processes').forEach(file => {
        processes.push(file);
    });
    var processObjs = [];
    for (let process in processes) {
        let pJSON = JSON.parse(fs.readFileSync('processes/' + processes[process]));
        processObjs.push(pJSON.name);
    }
    return processObjs;
}
function restartProcess(procName) {
    stopProcess(procName);
    startProcess(procName);
}
function stopProcess(procName) {
    pm2.stop(procName);
}
function startProcess(procName) {
    pm2.start(procName);
}
function gitPull(procDir) {
    shell.Shell('cd ' + procDir + " && git pull");
}

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var processes = enumerate();
    for (let process in processes) {
        ref = "<a href='/process?proc=" + processes[process] + "'>" + processes[process] + "</a> <br>";
        res.write(ref);
    }
    res.end("Select a process to control");
}).listen(8080);

if (!fs.existsSync('processes')) {
    fs.mkdirSync('processes');
}

console.log("Ready!");