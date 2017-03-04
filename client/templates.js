import './jquery/jquery-1.10.2.js'
import './bootstrap3/js/bootstrap.min.js'
import './templates.html';

Template.main.rendered = function() {
  var collections = [
    Collection1,
    Collection2,
    Collection3,
    Collection4,
    Collection5,
    Collection6,
    Collection7,
    Collection8,
    Collection10,
    Collection11,
    Collection12,
    Collection13,
    Collection14,
    Collection18,
    Collection20,
  ];

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

  function search(inputRaw) {
    $('#buffer').slideUp();
    $('#results-module').show();

    // 0. Sanitise input [TODO revise blacklist]
    var input = inputRaw.replace(/[\[\];\ ,.\*\\]/, '');
    console.log(input);
    if (input == "") {
      return;
    }

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
      var currentQuery = collections[i].find({ $or: [{
        其他: { '$regex': regex }, // sickness
      }, {
        穴位: { '$regex': regex }, // points
      }]}).fetch();
      results = results.concat(currentQuery);
    }

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
        var descriptionTitleList = currentResult.其他.split(/: |：/);
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
        resultObj.append(string);
        $('footer').show();
      }
    } else {
      $('#results-module').html('No results for: "' + input + '"');
    }
  }
}
