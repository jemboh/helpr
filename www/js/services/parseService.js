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
      var deferred = $q.defer();

      var newBooking = new Booking()
      newBooking.set("topic", booking.topic);
      newBooking.set("description", booking.description);

      // grab the full student object before saving - must do because using pointers
      ParseService.getUser(booking.student)
      .then(function (student) {
        newBooking.set("student",student);

        newBooking.save(null, {
          success: function(bookingCreated) {
            console.log('New object created with objectId: ' + bookingCreated.id);

            // NEED TO UPDATE INSTRUCTOR with this new booking + change status
            ParseService.getUser(instructorId)
              .then(function (instructor) {
                console.log('instructor to add bookings to', instructor);
                instructor.set('status', 'busy');
                // I keep getting bad requests here
                var relation = instructor.relation('bookings');
                relation.add(bookingCreated);
                instructor.save();

                deferred.resolve({bookingCreated: bookingCreated, instructor: instructor});
              })

          },

          error: function(bookingCreated, error) {
            console.log('Failed to create new object, with error code: ' + error.message);
          }
        });
      })

      return deferred.promise;
    },

    signOut: function() {
      return Parse.User.logOut();
    }
  };

  return ParseService;
}