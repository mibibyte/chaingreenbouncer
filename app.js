const spawn = require('child_process').spawn;
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');
const blacklist = require('./blacklist.json').blacklist;
const executable = path.resolve(config.executableDir);

(async function poll() {
	console.log("Scanning for bad peers...");
    let output = spawn("chaingreen", ["show", "-c", ], {
        shell: true,
        detached: false,
        cwd: executable
    });
    const rl = readline.createInterface({
        input: output.stdout
    });
    rl.on('line', line => processData(line));
    setTimeout(poll, config.scanTime);
}
());

async function processData(data) {
    let node = await convertToNode(data);

    //Oops
    if (!node)
        return;

    //Get out of here with that shitcoin...
    if (node.port == "8444") {
        console.log(`Removing unwanted node: ${node.ip}:${node.port}`);
        return removeNode(node.id);
    }

    //On the naughty list? GTFO
    if (blacklist.indexOf(node.ip) > -1) {
        console.log(`Removing unwanted node: ${node.ip}:${node.port}`);
        return removeNode(node.id);
    }
};

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

async function removeNode(id) {

    spawn("chaingreen", ["show", "-r", id], {
        shell: true,
        detached: false,
        cwd: executable
    });
}