import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

if (Meteor.isClient) {
  Meteor.subscribe('collection1_front');
  Meteor.subscribe('collection2_front');
  Meteor.subscribe('collection3_front');
  Meteor.subscribe('collection4_front');
  Meteor.subscribe('collection5_front');
  Meteor.subscribe('collection6_front');
  Meteor.subscribe('collection7_front');
  Meteor.subscribe('collection8_front');
  Meteor.subscribe('collection10_front');
  Meteor.subscribe('collection11_front');
  Meteor.subscribe('collection12_front');
  Meteor.subscribe('collection13_front');
  Meteor.subscribe('collection14_front');
  Meteor.subscribe('collection18_front');
  Meteor.subscribe('collection20_front');
}
