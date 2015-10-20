angular.module('helpr')
  .factory('ParseService', ParseService);

ParseService.$inject = ['$q'];

function ParseService($q) {

  var ParseService = {
    register: function(signUpData) {
      var deferred = $q.defer();

      var user = new Parse.User();
      user.set('username', signUpData.email);
      user.set('email', signUpData.email);
      user.set('password', signUpData.password);

      user.signUp(null, {
        success: function(user) {
          deferred.resolve(user);
        },
        error: function(user, error) {
          console.log(error);
          deferred.reject(error);
        }
      });

      return deferred.promise;
    }
  };

  return ParseService;
}