import './jquery/jquery-1.10.2.js'
import './bootstrap3/js/bootstrap.min.js'
import './templates.html';

Template.main.rendered = function() {
  $('#searchbutton').on('click', function() {
    search();
  });
  $('#searchbox').keydown(function (e) {
    if (e.keyCode == 13)  {
        e.preventDefault();
        search();
    }
  });

  function search() {
    console.log('clicked');
    $('#buffer').slideUp();
    $('#results-module').show("slow");
  }

  console.log(Collection1.find({}));
  console.log(Collection1.find({}).count());

}