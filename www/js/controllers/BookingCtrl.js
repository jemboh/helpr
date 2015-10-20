angular.module('helpr')
  .controller('BookingCtrl', BookingCtrl);

BookingCtrl.$inject = ['$state', '$stateParams', 'ParseService'];

function BookingCtrl($state, $stateParams, ParseService) {

  console.log($stateParams);
  var self = this;
  

}