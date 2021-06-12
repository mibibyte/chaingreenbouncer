# ChainGreenBouncer

Automatically detects & removes Chia nodes (port 8444) from your ChainGreen node.
Quick, sloppy, but functional

---
## Requirements

Node.js

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version

    $ npm --version

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g


## Install

    $ git clone https://github.com/mibibyte/chaingreenbouncer
    $ cd chaingreenbouncer
    $ npm install

## Configure app

Open `./config.json` then edit it with your settings. You will need:

- "executableDir": "C:/Users/Joshua/AppData/Local/chaingreen-blockchain/app-1.1.6/resources/app.asar.unpacked/daemon/" (Windows Example)
- "executableDir": "/usr/lib/chaingreen-blockchain/resources/app.asar.unpacked/daemon/" (Linux Example)
- "scanTime": 5000  (Default 5 seconds)

## Running the project

    $ node app.js
	$ Running the start.bat file included in the repo if on windows