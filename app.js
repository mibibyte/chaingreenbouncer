const spawn = require('child_process').spawn;
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');
const blacklist = require('./blacklist.json').blacklist;
const whitelist = require('./whitelist.json').whitelist;
const executable = path.resolve(config.executableDir);

const restartInterval = config.restartInterval;
const restartEnabled = config.restartEnabled; 
let nextRestart = new Date().getTime() + restartInterval;

init();

async function init() {
 for (const node of whitelist) {
            console.log(`Connecting to ${node}:8744`);
            addNode(node);
        }
}

(async function poll() {
    let now = new Date().getTime();

    console.log("Scanning for bad peers...");
	//Grab our current peers..
    let output = spawn(path.join(config.executableDir, "chaingreen"), ["show", "-c", ], {
        shell: true,
        detached: false
    });
    const rl = readline.createInterface({
        input: output.stdout
    });
    rl.on('line', line => processData(line));
    setTimeout(poll, config.scanTime);
	
	//Is it time for a restart, or is restarting even enabled?
    if (now >= nextRestart && restartEnabled) {
        nextRestart = now + restartInterval;
        console.log('restarting...');

        await restart();
        await wait(5000);

        for (const node of whitelist) {
            console.log(`Connecting to ${node}:8744`);
            addNode(node);
        }
    }
}
    ());

async function processData(data) {
    let node = await convertToNode(data);
	
    //Oops
    if (!node)
        return;

    //Bounce anything that isn't CGN
    if (node.port != "8744") {
        console.log(`Removing unwanted node: ${node.ip}:${node.port}`);
        return removeNode(node.id);
    }

    //On the naughty list? GTFO
    if (blacklist.indexOf(node.ip) > -1) {
        console.log(`Removing unwanted node: ${node.ip}:${node.port}`);
        return removeNode(node.id);
    }
	    
    //Not on the goodboi list? GTFO
    if (whitelist.indexOf(node.ip) == -1) {
        console.log(`Removing unwanted node: ${node.ip}:${node.port}`);
        return removeNode(node.id);
    }
};

//Parses output of chaingreen show -c
async function convertToNode(data) {
    let arr = data.split(' ');
    arr = arr.filter(e => e);

    if (arr[0] != "FULL_NODE")
        return false;

    return {
        ip: arr[1],
        port: arr[2].split('/')[1],
        id: arr[3].substring(0, arr[3].length - 3),
    };
}

//Bye!
async function removeNode(id) {
    spawn(path.join(config.executableDir, "chaingreen"), ["show", "-r", id], {
        shell: true,
        detached: false
    });
}

//Adds a new node
async function addNode(ip) {
    spawn("chaingreen", ["show", "-a", `${ip}:8744`], {
        shell: true,
        detached: false,
        cwd: executable
    });
}

//Restarts all services. Resolves as a promise
async function restart() {
    return new Promise(function (resolve, reject) {
        let proc = spawn(path.join(config.executableDir, "chaingreen"), ["start", "all", "-r"], {
            shell: true,
            detached: false
        });

        const rl = readline.createInterface({
            input: proc.stdout
        });
        rl.on('line', line => console.log(line));

        proc.on('close', (code) => {
            resolve(true);
        });
    });
}

const wait = require('util').promisify(setTimeout);