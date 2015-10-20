angular.module('helpr')
  .factory('ParseService', ParseService);

ParseService.$inject = ['$q'];

function ParseService($q) {

  var Booking = Parse.Object.extend('Booking');

  // var Bookings = Parse.Collection.extend({
  //   model: Booking
  // });

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

    getInstructors: function() {
      var deferred = $q.defer();

      var query = new Parse.Query(Parse.User);
      query.equalTo('admin', true);
      query.find({
        success: function(instructors) {
          var instructorData = instructors.map(function(instructor) {
            return {
              id: instructor.id,
              name: instructor.get('name'),
              status: 'available'
            };
          });

        deferred.resolve(instructorData)
        } 
      });

      return deferred.promise;
    },

    getBookings: function() {
      var deferred = $q.defer();

      var query = new Parse.Query(Parse.User);
      query.equalTo('email', 'jeremy@ga.co');
      query.find({
        success: function(user) {
          user[0].relation('bookings').query().find({
            success: function(bookings) {
              console.log(bookings[0].get('topic'));
            }
          })
        }
      });

      return deferred.promise;
    },

    signOut: function() {
      return Parse.User.logOut();
    }
  };

  return ParseService;
}