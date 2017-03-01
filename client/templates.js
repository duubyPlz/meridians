import './jquery/jquery-1.10.2.js'
import './bootstrap3/js/bootstrap.min.js'
import './templates.html';

Template.main.rendered = function() {
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
    $('#results-module').show("slow");

    // 0. Sanitise input [TODO revise blacklist]
    var input = inputRaw.replace('[;\ ,./');
    console.log("Searching: " + input);

    // 1. Looking at all collections for match in 其他
    var regex = '.*' + input + '.*';
    var results = Collection1.find({
      其他: { '$regex': regex },
    }).fetch();

    // 2. Display results.
    if (results.length > 0) {
      
    } else {
      
    }
  }
}