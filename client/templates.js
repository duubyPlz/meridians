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

  $('#searchbutton').on('click', function() {
    var input = $('#searchbox').val();
    search(input);
  });
  $('#searchbox').keydown(function (e) {
    if (e.keyCode == 13)  {
        e.preventDefault();
        var input = $(this).val();
        search(input);
    }
  });

  function search(inputRaw) {
    $('#buffer').slideUp();
    $('#results-module').show();

    // 0. Sanitise input [TODO revise blacklist]
    var input = inputRaw.replace('[;\ ,./');
    if (input == "") {
      return;
    }

    // > nontrivial search, continue.
    console.log("Searching: " + input);

    // 1. Looking at all collections for match in 其他
    var regex = '.*' + input + '.*';
    console.log('regex: ' + regex);
    // var regex = '.*痛.*';

    var results = [];
    // var results = Collection1.find({
    //   其他: { '$regex': regex },
    // }).fetch();
    for (var j=0; j<collections.length; j++) {
      var currentQuery = collections[j].find({
        其他: { '$regex': regex },
      }).fetch();
      results = results.concat(currentQuery);
    }
    console.log('final results: ' + results);

    // 2. Display results, i.e. points with wanted sickness
    if (results.length > 0) {
      var resultObj = $('#results-module');
      // clear module first
      resultObj.html('');

      // then display new results
      resultObj.append("<div class='info'>Results for: \"" + input + "\"</div>");
      for (var i=0; i<results.length; i++) {
        var currentResult = results[i];
        var string = "<div class='list-result'>" +
                     "<a class='list-title'>" + currentResult.穴位 + "</a>" +
                     "<div class='list-description'>" + currentResult.其他 + "</div>" +
                     "</div>";
        resultObj.append(string);
      }
    } else {
      $('#results-module').html('No sickness results for: "' + input + '".');
    }
  }
}