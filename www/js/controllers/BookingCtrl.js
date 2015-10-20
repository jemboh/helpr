angular.module('helpr')
  .controller('BookingCtrl', BookingCtrl);

BookingCtrl.$inject = ['$state', '$stateParams', 'ParseService'];

function BookingCtrl($state, $stateParams, ParseService) {

  var self = this;

  console.log($stateParams);
  self.showModal = false;

  self.newBooking = {};

  self.createBooking = function() {
    var newBooking = self.newBooking;
    // send to Parse
    // when booking successfully made pop up modal
    self.showModal = true;
    self.newBooking = {};
  }

  self.updateInstructorQueue = function() {
    self.showModal = false;
    $state.go('tab.home');
  }

}