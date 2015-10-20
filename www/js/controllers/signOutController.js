angular.module('helpr')
  .controller('SignOutController', SignOutController);


SignOutController.$inject = ['$state', '$rootScope', 'ParseService']

function SignOutController($state, $rootScope, ParseService) {
  var self = this;

  this.signOut = function() {
    ParseService.signOut()
    .then(function(response) {
      $rootScope.currentUser = false;
      $rootScope.loggedIn = false;
      $state.go('login');
    })
  }
}