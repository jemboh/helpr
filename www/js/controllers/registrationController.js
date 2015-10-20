angular.module('helpr')
  .controller('RegistrationController', RegistrationController);


RegistrationController.$inject = ['$state', 'ParseService']

function RegistrationController($state, ParseService) {
  var self = this;
  this.newUser = {}

  this.register = function() {
    ParseService.register(self.newUser)
    .then(function(response) {
      console.log(response);
      $state.go('tab.dash')
    })
  }
}