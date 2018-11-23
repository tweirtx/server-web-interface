const http = require('http');
const pm2 = require('pm2');
const fs = require('fs');
const shell = require('shell');
let ref;


// Change the objects in the array if you want them to start automatically with the management interface
const autoStartItems = ['sample'];

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
function stopProcess(procName) {
    pm2.stop(procName, null);
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
    if (req.url.includes("process")) {
        var processName = req.url.substring(req.url.indexOf('=') + 1);
        res.write("<a href='start?process=" + processName + "'>Start " + processName + "</a><br>");
        res.write("<a href='stop?process=" + processName + "'>Stop " + processName + "</a><br>");
        res.write("<a href='pull?process=" + processName + "'>Git pull " + processName + "</a><br>");
        if (req.url.includes('start')) {
            startProcess(processName);
            res.end("Successfully started");
        }
        else if (req.url.includes('stop')) {
            stopProcess(processName);
            res.end("Successfully stopped");
        }
        else if (req.url.includes('pull')) {
            var procName = JSON.parse(fs.readFileSync('processes/' + processName + ".json")).cwd;
            gitPull(procName);
            res.end("Successfully pulled");
        }
        else {
            res.end("Please select an option");
        }
    }
    else {
        for (let process in processes) {
            ref = "<a href='/process?proc=" + processes[process] + "'>" + processes[process] + "</a> <br>";
            res.write(ref);
        }
        res.end("Select a process to control");
    }
}).listen(8080);

if (!fs.existsSync('processes')) {
    fs.mkdirSync('processes');
}
for (let proc in autoStartItems) {
    startProcess(proc);
}

console.log("Ready!");