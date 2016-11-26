import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.numsantas = null;
});

Template.hello.helpers({
  counter() {
    return Template.instance().numsantas.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.numsantas.set($(event.target).val);
  },
});
