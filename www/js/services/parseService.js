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

    getInstructors: function(currId) {
      var deferred = $q.defer();

      // only get Instructors = admin true
      var query = new Parse.Query(Parse.User);
      query.equalTo('admin', true);
      query.find({
        success: function(instructors) {
          // PArse does not return an object but the ability to retrieve the object's attributes 1 by 1
          // iterate through the instructors to build the instructorData object
          var instructorDataArray = [];
          var isCurrUserBooked = '';

          instructors.forEach(function(instructor) {
            var instructorData = {};
            instructorData.id = instructor.id;
            instructorData.name = instructor.get('name');
            instructorData.status = instructor.get('status');
            instructorData.bookings = [];
            
            // same iteration process to retrieve the array of bookings for that user            
            instructor.relation('bookings').query().find({
              success: function(bookings) {
                bookings.forEach(function(booking){

                  var bookingData = {
                    topic: booking.get('topic'),
                    description: booking.get('description')
                  }
                  // retrieve the student (!) and check if the current user is anywhere!
                  var student = booking.get('student');
                  var subQueryStudent = new Parse.Query(Parse.User);
                  subQueryStudent.get(student.id, {
                    success: function(student){
                      bookingData.student = student.get('username')
                      console.log('instructor', instructor.get('name'));
                      console.log('logged', student.id, 'currID', currId);
                      if (student.id === currId) isCurrUserBooked = instructor.name;
                      instructorData.bookings.push(bookingData);
                    }
                  })
                });
              }
            })

            instructorDataArray.push(instructorData);
          });

        deferred.resolve({instructors: instructorDataArray, isCurrUserBooked: isCurrUserBooked});
        } 
      });

      return deferred.promise;
    },


    getBookings: function() {
      var deferred = $q.defer();

      // var query = new Parse.Query(Parse.User);
      // query.equalTo('email', 'jeremy@ga.co');
      // query.find({
      //   success: function(user) {
      //     user[0].relation('bookings').query().find({
      //       success: function(bookings) {
      //         console.log(bookings[0].get('topic'));
      //       }
      //     })
      //   }
      // });

      return deferred.promise;
    },

    signOut: function() {
      return Parse.User.logOut();
    }
  };

  return ParseService;
}