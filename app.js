const spawn = require('child_process').spawn;
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

console.log("Checking for Chia peers...");

(async function poll() {

    let output = spawn("chaingreen", ["show", "-c",], { shell: true, detached: false, cwd: config.executableDir });
    const rl = readline.createInterface({ input: output.stdout });
    rl.on('line', line => processData(line));
    setTimeout(poll, config.scanTime);
}
());


async function processData(data) {
    let node = await convertToNode(data);

    if (!node)
        return;

    console.log(node);

    if (node.port == "8444")
        removeNode(node.id);
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
    let output = spawn("chaingreen", ["show", "-r", id], { shell: true, detached: false, cwd: config.executableDir });
    const rl = readline.createInterface({ input: output.stdout });
    rl.on('line', line => console.log(line));
}
