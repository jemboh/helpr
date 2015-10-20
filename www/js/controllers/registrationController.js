angular.module('helpr')
  .controller('RegistrationController', RegistrationController);


RegistrationController.$inject = ['$state', '$rootScope', 'ParseService']

function RegistrationController($state, $rootScope, ParseService) {
  var self = this;
  this.newUser = {}

  this.register = function() {
    ParseService.register(self.newUser)
    .then(function(response) {
      $rootScope.currentUser = response;
      $rootScope.loggedIn = true;
      $state.go('tab.home');
    })
  }
}