// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const ipc = require('electron').ipcRenderer;
const fs = require('fs');
const { parse } = require('path');
const Papa = require('papaparse');

window.$ = window.jQuery = require('jquery');

// Globals
const pathFile = './assets/pathFile.json';
const jsonCollections = [];

// Listeners
document.querySelector('#request-file-paths').addEventListener('click', function (event) {
  ipc.send('request-file-paths');
});

// search triggered
$('#searchbutton').on('click', function() {
  var input = $('#searchbox').val();
  if (input != "") {
    $('footer').hide();
    search(input);
  }
});

$('#searchbox').keydown(function (e) {
  if (e.keyCode == 13)  {
    e.preventDefault();
    var input = $(this).val();
    if (input != "") {
      $('footer').hide();
      search(input);
    }
  }
});

// link triggered
$('body').on('click', '#results-module .search-term', function() {
  var input = $(this).text();
  
  // search this text
  if (input != "") {
    $('footer').hide();
    search(input);
  }
});

// toggle history
$('#history-button').on('click', function () {
  $('#history-module').toggle();
  if ($('#history-module').is(':visible')) {
    generateHistory();
  }
});

// IPC
ipc.on('reply-file-paths', dealWithNewFilePaths);

// Subfunctions
function dealWithNewFilePaths(event, filePaths) {
  
  storeNewFilePaths(filePaths);
  parseFilePaths(filePaths);
}

function storeNewFilePaths(filePaths) {
  fs.writeFileSync(pathFile, JSON.stringify(filePaths, null, 4));
}

function parseFilePaths(filePaths) {
  const fileContents = [];
    
  // Assuming it's an array of strings:
  for (const filePath of filePaths) {
    console.log(filePath);

    // TODO continue here, readFile() is async, not getting data before we already move on to parseCsvToJson()
    fs.readFile(filePath, 'utf-8', (err, data) => {
      
      // Change how to handle the file content
      fileContents.push(data);
    });
  }

  parseCsvToJson(fileContents);
}

function parseCsvToJson(fileContents) {
  console.log("INSIDE CSV -> JSON");
  console.log(fileContents.length);
  console.log(fileContents);
  for (const currentFile of fileContents) {
    console.log(currentFile);
    const csvObject = Papa.parse(currentFile);
    console.log(csvObject);
    jsonCollections.push(csvObject);
  }

  if (dataExists()) {
    show(document.querySelector('.search'));
    hide(document.querySelector('#request-file-paths'));
  } else {
    // try again
    // TODO add error onto DOM, instead of just logging
    console.log("No data parsed, try import from file again.");
  }
}

function generateHistory() {
  $('#history-module').html(history.toString());
}

function search(inputRaw) {
  $('#buffer').slideUp();
  $('#results-module').show();

  // 0. Sanitise input
  var input = inputRaw.replace(/[\[\];\ ,.\*\\]/, '');
  if (input == "") {
    return;
  }

  // 0.5. Put search string into history
  setTimeout(function() {
    history.push(input);
    generateHistory();
  }, 50);

  // 1. replace search box with search term
  $('#searchbox').val(input); // change textbox value

  // > nontrivial search, continue.
  // 2. Looking at all collections
  if (input.match(/[\(\)]/g)) {
    input = input.replace(new RegExp('([\(\)])', 'g'), '\\$1');
  }

  var regex = '.*' + input + '.*';

  var results = [];
  for (var i=0; i<collections.length; i++) {
    // 0: Collection
    // _collection: LocalCollection {name: "collection1", _docs: _IdMap, _observeQueue: M…r._SynchronousQueue, next_qid: 1, queries: {…}, …}
    // _connection: Connection {options: {…}, onReconnect: null, _stream: ClientStream, _lastSessionId: "LytPN3QApXQ2zHgfe", _versionSuggestion: "1", …}
    // _driver: LocalCollectionDriver {noConnCollections: {…}}
    // _insecure: undefined
    // _makeNewID: ƒ ()
    // _name: "collection1"
    // _prefix: "/collection1/"
    // _restricted: false
    // _transform: null
    // _validators: {insert: {…}, update: {…}, remove: {…}, upsert: {…}, fetch: Array(0), …}
    // __proto__: Object

    console.log("ASDFASDFASDFADSFASDFADS");
    // var currentQuery = collections[i].find({ $or: [{
    //   其他: { '$regex': regex }, // sickness
    // }, {
    //   穴位: { '$regex': regex }, // points
    // }]}).fetch();
    // results = results.concat(currentQuery);

    // // types
    // collections[i].find().forEach(function(entry) {
    //   if (entry.hasOwnProperty(input) && entry[input] == 1) {
    //     results = results.concat(entry);
    //   }
    // });
    }
  }

  // 3. Display results, i.e. points with wanted sickness
  // if (results.length > 0) {
    console.log("ASDFLJAKDS;FOIJQPWOEGQWF IN RESULTS DISPLAY");
//     var resultObj = $('#results-module');
//     // clear module first
//     resultObj.html('');

//     // then display new results
//     resultObj.append("<div class='info'>Results for: \"" + input + "\"</div>");
//     for (var j=0; j<results.length; j++) {
//       var currentResult = results[j];

//       // temp fix: remove all asterisks
//       var pressurePoint = currentResult.穴位.replace(/\*/, '');

//       // split description into pieces
//       var descriptionTitleList = currentResult.其他.split(/: |：|;|:/);
//       var descriptionList = [];
//       if (descriptionTitleList.length > 1) {
//         descriptionList = descriptionTitleList[1].split(/、|，/);
//       } else {
//         descriptionList = currentResult.其他.split(/、|，/);
//       }

//       var regex = '.*' + input + '.*';
//       var string = "<div class='list-result'>";

//       if (pressurePoint.match(new RegExp(regex, 'g'))) {
//         string = string + "<a class='list-title search-term'><b>" + pressurePoint + "</b></a>";
//       } else {
//         string = string + "<a class='list-title search-term'>" + pressurePoint + "</a>";
//       }

//       if (currentResult.經絡.match(new RegExp(regex, 'g'))) {
//         string = string + "<div class='list-meridian'><b>" + currentResult.經絡 + "</b></div>";
//       } else {
//         string = string + "<div class='list-meridian'>" + currentResult.經絡 + "</div>";
//       }

//       if (descriptionTitleList[0].match(new RegExp(regex, 'g'))) {
//         string = string + "<div class='list-description'><a class='search-term'><b>" + descriptionTitleList[0] + "</b></a>: ";
//       } else {
//         string = string + "<div class='list-description'><a class='search-term'>" + descriptionTitleList[0] + "</a>: ";
//       }

//       // add description
//       for (var k=0; k<descriptionList.length; k++) {
//         var currentElem = descriptionList[k];
//         if (currentElem == "") {
//           continue;
//         }
//         if (k == 0) {
//           string = string + "<a class='search-term'>";
//           if (currentElem.match(new RegExp(regex, 'g'))) {
//             string = string + "<b>" + currentElem + "</b></a>";
//           } else {
//             string = string + currentElem + "</a>";
//           }
//         } else {
//           if (currentElem.match(new RegExp(regex, 'g'))) {
//             string = string + "、<a class='search-term'><b>" + currentElem + "</b></a>";
//           } else {
//             string = string + "、<a class='search-term'>" + currentElem + "</a>";
//           }
//         }
//       }
//       string = string + "</div>" + "</div>";

//       // add tags
//       string = string + '<div class="sickness-classes">';

//       var tags = [];
//       var tagColours = {
//        "痛症": "red",
//        "炎症": "purple",
//        "痺症": "cyan",
//        "攣痺": "cyan",
//        "血病": "blue",
//        "血症": "blue",
//        "氣管病": "yellow",
//        "熱病": "brown",
//        "熱症": "brown",
//        "情志": "navy",
//        "耳症": "maroon",
//        "眼症": "black",
//        "鼻病": "dark-purple",
//        "男女科": "green",
//        "排泄": "orange",
//        "others": "default",
//       }

//       // > for everything in currentResult, add if value is `1`
//       $.each(currentResult, function (name, value) {
//         if ((value == 1) && (name != '#')) {
//           tags.push(name);
//         }
//       });

//       // > colour & append tags
//       for (var l=0; l<tags.length; l++) {
//         var color = tagColours[tags[l]];
//         if (color != undefined) {
//           string = string + '<span class="label label-' + color + ' search-term">' + tags[l] + '</span>';
//         } else {
//           // default colour
//           string = string + '<span class="label label-default search-term">' + tags[l] + '</span>';
//         }
//       }
//       string = string + '</div>';

//       // finished
//       resultObj.append(string);
//       $('footer').show();
//     }
//   } else {
//     $('#results-module').html('No results for: "' + input + '"');
//   }
// }

// Util functions
const show = (elem) => {
  elem.classList.remove('hide');
};

const hide = (elem) => {
  elem.classList.add('hide');
};

const dataExists = () => {
  return jsonCollections && jsonCollections.length > 0;
}

// Main
// hide(document.querySelector('#request-file-paths'));
// TODO reveal button if no file found
// TODD if file found, parseFilePaths of the contents, json read
if (!dataExists()) {
  hide(document.querySelector('.search'));
}
