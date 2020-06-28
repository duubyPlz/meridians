// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const ipc = require('electron').ipcRenderer;
const fs = require('fs');

document.querySelector('#asdfBtn').addEventListener('click', function (event) {
    ipc.send('request-file-paths');
});

ipc.on('reply-file-paths', (event, filePaths) => {
    const fileContents = [];
    
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
});
