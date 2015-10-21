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

    updateUser: function(userData) {
      var deferred = $q.defer();

      var user = this.getCurrentUser();

      user.set('firstName', userData.firstName);
      user.set('lastName', userData.lastName);

      user.save(null, {
        success: function(user) {
          console.log('updated user successfully', user);
          deferred.resolve(user);
        },
        error: function(user, error) {
          console.log('error updating user', user);
          deferred.reject(error);
        }
      });

      return deferred.promise;
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

    getUser: function(id) {
      var deferred = $q.defer();

      var query = new Parse.Query(Parse.User);
      query.get(id, {
        success: function(user) {
          deferred.resolve(user)
        }
      });

      return deferred.promise;
    },

    createBooking: function(booking, instructorId) {
      var self = this;

      var deferred = $q.defer();

      var user = this.getCurrentUser();
      
      var newBooking = new Booking();
      newBooking.set('topic', booking.topic);
      newBooking.set('description', booking.description);
      newBooking.set('student', user);

      newBooking.save(null, {
        success: function(booking) {
          console.log('booking successfully saved');
          console.log(booking);
          self.getUser(instructorId)
          .then(function(instructor) {
            // below Cloud function is defined in cloud/main.js
            // Parse requires special rights to modify a user
            Parse.Cloud.run('modifyUser', { userId: instructorId, bookingId: booking.id }, {
              success: function(response) {
                // the user was updated successfully
                console.log('cloud success!');
                console.log(response);
              },
              error: function(error) {
                console.log('cloud fail');
                console.log(error);
              }
            });
          })
        },
        error: function(booking, error) {
          console.log('booking failed to save');
          console.log(error);
        }
      })

      return deferred.promise;
    },

    signOut: function() {
      return Parse.User.logOut();
    }
  };

  return ParseService;
}