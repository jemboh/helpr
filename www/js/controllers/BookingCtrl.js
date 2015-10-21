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
    newBooking.student = ParseService.getCurrentUser().id;
    // send to Parse & // update instructor status to busy (Can only be busy now!)
    ParseService.createBooking(newBooking, $stateParams.id)
    .then(function (response) {
      console.log('response from newBooking', response);
      // when booking successfully made pop up modal
      self.showModal = true;
      self.newBooking = {};
    })
  }

  self.updateInstructorQueue = function() {
    self.showModal = false;
    $state.go('tab.home');
  }

}