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
          console.log('inside parse service');
          console.log(user)
          deferred.resolve(user);
        },
        error: function(user, error) {
          console.log(error);
          deferred.reject(error);
        }
      });

      return deferred.promise;
    },

    login: function(loginData) {
      var deferred = $q.defer();
      console.log('loginData', loginData)

      Parse.User.logIn(loginData.email, loginData.password, {
        success: function(user) {
          deferred.resolve(user)
        },
        error: function(user, error) {
          console.log(error);
          deferred.reject(error);
        } 

      });

      return deferred.promise;
    },

    getCurrentUser: function() {
      return Parse.User.current();
    },

    signOut: function() {
      return Parse.User.logOut();
    }
  };

  return ParseService;
}