const path = require('path');
const nodemon = require('nodemon');

/**
 * Launches Node.js/Express web server in a separate (forked) process.
 */
function startNodemon() {
  nodemon({
    "restartable": "rs",
    "ignore": [
      ".git",
      "node_modules/**/node_modules"
    ],
    "verbose": true,
    "execMap": {
      "js": "node"
    },
    "script": path.join(__dirname, '../server/server.js'),
    "watch": [
      path.join(__dirname, '../server')
    ],
    "env": {
      "NODE_ENV": "development"
    },
    "ext": "js json"
  }).on('restart', () => {});
}

function server() {
  function restart() {
    console.log("App restarted due to:\n'$FILENAME'\" with title \"nodemon\"'");
  }
  return new Promise((resolve, reject) => {
    global.NODEMON ? startNodemon() : require('../server/server.js');
    resolve();
  });
}

module.exports = server;
