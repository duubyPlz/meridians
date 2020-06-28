// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const ipc = require('electron').ipcRenderer;
const fs = require('fs');
const fa = require('font-awesome');

// Constants
const pathFile = './assets/pathFile.json';

// Listeners
document.querySelector('#request-file-paths').addEventListener('click', function (event) {
    ipc.send('request-file-paths');
});

// IPC
ipc.on('reply-file-paths', dealWithNewFilePaths);

// Subfunctions
function dealWithNewFilePaths(event, filePaths) {
    const fileContents = [];
    
    storeNewFilePaths(filePaths);
    parseFilePaths(filePaths);
}

function storeNewFilePaths(filePaths) {
    fs.writeFileSync(pathFile, JSON.stringify(filePaths, null, 4));
}

function parseFilePaths(filePaths) {
    // Assuming it's an array of strings:
    for (const filePath of filePaths) {
        console.log(filePath);
        fs.readFile(filePath, 'utf-8', (err, data) => {

            // Change how to handle the file content
            fileContents.push(data);
        });
    }
    console.log("FILE CONTENTS");
    console.log(fileContents);
}

// Util functions
const show = (elem) => {
	elem.classList.remove('hide');
};

const hide = (elem) => {
	elem.classList.add('hide');
};

// Main
// hide(document.querySelector('#request-file-paths'));
// TODO reveal button if no file found
// TODD if file found, parseFilePaths of the contents, json read


