angular.module('helpr')
  .controller('LoginController', LoginController);


LoginController.$inject = ['$state', '$rootScope', 'ParseService']

function LoginController($state, $rootScope, ParseService) {
  var self = this;
  this.userData = {}

  this.login = function() {
    ParseService.login(self.userData)
    .then(function(response) {
      $rootScope.currentUser = response;
      $rootScope.loggedIn = true;
      $state.go('tab.home');
    }, function(error) {
      self.errorMessage = error.message;
    })
  }
}