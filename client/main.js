import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './jquery/jquery-1.10.2.js'
import './bootstrap3/js/bootstrap.min.js'
import './main.html';

Template.main.rendered = function() {
  $('#searchbutton').on('click', function() {
    console.log('clicked');
    $('#buffer').slideUp();
    $('#results-module').show("slow");
  });
}