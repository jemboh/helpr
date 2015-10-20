angular.module('helpr')
  .controller('AccountController', AccountController);

AccountController.$inject = ['$state', '$rootScope', 'ParseService']

function AccountController($state, $rootScope, ParseService) {
  var self = this;

  self.userData = {
    firstName: $rootScope.currentUser.get('firstName'),
    lastName: $rootScope.currentUser.get('lastName')
  }

  self.updateUserData = function() {
    ParseService.updateUser(self.userData)
    .then(function(response) {
      console.log('updateUserData', response);
    })
  }
}
