// > Variables
var jsons = [];
var searchHistory = [];

// > Event handlers
// search triggered
$('#searchbutton').on('click', function() {
  var input = $('#searchbox').val();
  if (input != "") {
    $('footer').hide();
    search(input);
  }
});

$('#searchbox').keydown(function (e) {
  if (e.keyCode === 13)  {
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

function generateHistory() {
  $('#history-module').html(history.toString());
}

// > Functions: logic
function generateHistory() {
  $('#history-module').html(searchHistory.toString());
}

function search(inputRaw) {
  $('#buffer').slideUp();
  $('#results-module').show();

  // 0. Sanitise input [TODO revise blacklist]
  var input = inputRaw.replace(/[\[\];\ ,.\*\\]/, '');
  console.log('query: ' + input);
  if (input == "") {
    return;
  }

  // 0.5. Put search string into history
  setTimeout(function() {
    searchHistory.push(input);
    generateHistory();
  }, 50);

  // 1. replace search box with search term
  $('#searchbox').val(input); // change textbox value

  // > nontrivial search, continue.
  // 2. Looking at all collections
  if (input.match(/[\(\)]/g)) {
    input = input.replace(new RegExp('([\(\)])', 'g'), '\\$1');
  }

  var regex = new RegExp('.*' + input + '.*');

  var results = [];
  console.log("WE'VE REACHED THIS POINT,");
  console.log(jsons);

  var flattened = [].concat.apply([], jsons);
  console.log(flattened);

  // If type e.g. field 炎症 has a 1 value
  // If fields 其他, 穴位 or 經絡 has a string value that matches .*input.*
  results = results.concat(flattened.filter((entry) => 
    entry.其他.match(regex) ||
    entry.穴位.match(regex) ||
    entry.經絡.match(regex) || 
    (entry.hasOwnProperty(input) && entry[input] == 1)
  ));
  console.log("RESULTS NOW");
  console.log(results);

  // 3. Display results, i.e. points with wanted sickness
  if (results.length > 0) {
    var resultObj = $('#results-module');
    // clear module first
    resultObj.html('');

    // then display new results
    resultObj.append("<div class='info'>Results for: \"" + input + "\"</div>");
    for (var j=0; j<results.length; j++) {
      var currentResult = results[j];

      // temp fix: remove all asterisks
      var pressurePoint = currentResult.穴位.replace(/\*/, '');

      // split description into pieces
      var descriptionTitleList = currentResult.其他.split(/: |：|;|:/);
      var descriptionList = [];
      if (descriptionTitleList.length > 1) {
        descriptionList = descriptionTitleList[1].split(/、|，/);
      } else {
        // TODO fix
        descriptionList = currentResult.其他.split(/、|，/);
      }

      var regex = '.*' + input + '.*';
      var string = "<div class='list-result'>";

      if (pressurePoint.match(new RegExp(regex, 'g'))) {
        string = string + "<a class='list-title search-term'><b>" + pressurePoint + "</b></a>";
      } else {
        string = string + "<a class='list-title search-term'>" + pressurePoint + "</a>";
      }

      if (currentResult.經絡.match(new RegExp(regex, 'g'))) {
        string = string + "<div class='list-meridian'><b>" + currentResult.經絡 + "</b></div>";
      } else {
        string = string + "<div class='list-meridian'>" + currentResult.經絡 + "</div>";
      }

      if (descriptionTitleList[0].match(new RegExp(regex, 'g'))) {
        string = string + "<div class='list-description'><a class='search-term'><b>" + descriptionTitleList[0] + "</b></a>: ";
      } else {
        string = string + "<div class='list-description'><a class='search-term'>" + descriptionTitleList[0] + "</a>: ";
      }

      // add description
      for (var k=0; k<descriptionList.length; k++) {
        var currentElem = descriptionList[k];
        if (currentElem == "") {
          continue;
        }
        if (k == 0) {
          string = string + "<a class='search-term'>";
          if (currentElem.match(new RegExp(regex, 'g'))) {
            string = string + "<b>" + currentElem + "</b></a>";
          } else {
            string = string + currentElem + "</a>";
          }
        } else {
          if (currentElem.match(new RegExp(regex, 'g'))) {
            string = string + "、<a class='search-term'><b>" + currentElem + "</b></a>";
          } else {
            string = string + "、<a class='search-term'>" + currentElem + "</a>";
          }
        }
      }
      string = string + "</div>" + "</div>";

      // add tags
      string = string + '<div class="sickness-classes">';

      var tags = [];
      var tagColours = {
       "痛症": "red",
       "炎症": "purple",
       "痺症": "cyan",
       "攣痺": "cyan",
       "血病": "blue",
       "血症": "blue",
       "氣管病": "yellow",
       "熱病": "brown",
       "熱症": "brown",
       "情志": "navy",
       "耳症": "maroon",
       "眼症": "black",
       "鼻病": "dark-purple",
       "男女科": "green",
       "排泄": "orange",
       "others": "default",
      }

      // > for everything in currentResult, add if value is `1`
      $.each(currentResult, function (name, value) {
        if ((value == 1) && (name != '#')) {
          tags.push(name);
        }
      });

      // > colour & append tags
      for (var l=0; l<tags.length; l++) {
        var color = tagColours[tags[l]];
        if (color != undefined) {
          string = string + '<span class="label label-' + color + ' search-term">' + tags[l] + '</span>';
        } else {
          // default colour
          string = string + '<span class="label label-default search-term">' + tags[l] + '</span>';
        }
      }
      string = string + '</div>';

      // finished
      resultObj.append(string);
      $('footer').show();
    }
  } else {
    $('#results-module').html('No results for: "' + input + '"');
  }
}

/**
[
  [ { #: "...", 其他: "...", ... }, {}, ... ],
  [ ... ],
  ...
]
*/
function jsonToMemory() {
  var directory = 'assets/json/';
  var fileNames = [
    'collection1.json',
    'collection2.json',
    'collection3.json',
    'collection4.json',
    'collection5.json',
    'collection6.json',
    'collection7.json',
    'collection8.json',
    'collection10.json',
    'collection11.json',
    'collection12.json',
    'collection13.json',
    'collection14.json',
    'collection18.json',
    'collection20.json',
  ];

  try {
    for (var fileName of fileNames) {
      var path = directory + fileName;
      $.get(path, function(data) {
        if (JSON.parse(data)) {
          jsons.push(JSON.parse(data));
        }
      });
    }
  } catch (e) {
    console.warn(e);
  }
}

// > Main
console.log("STARTING...");
jsonToMemory()
console.log("DONE");
