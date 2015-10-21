angular.module('helpr')
  .controller('HomeCtrl', HomeController);

HomeController.$inject = ['$state', 'ParseService'];

function HomeController($state, ParseService) {

  var self = this;
  var currId = ParseService.getCurrentUser().id;

  ParseService.getInstructors(currId)
  .then(function(response) {
    console.log(response);
    self.instructors = response.instructors;
    // create the current User object
    self.currUser = {
      id: currId,
      booked: response.isCurrUserBooked
    }
    // updateStatus(self.instructors);
  })

  // function updateStatus (instructors) {
  //   instructors.forEach(function (instructor) {
  //     console.log('innnnnstr', instructor);
  //   })
  // }

  self.toggleQueue = function (instructor) {
    // ensure the divs know when to show and hide
    // first hide them all, then show the one we want
    self.instructors.forEach(function(instructor){
      instructor.showMe = false;
    })
    instructor.showMe === true ? instructor.showMe = false : instructor.showMe = true;
  }

  self.addBooking = function (instructor) {
    console.log(instructor)
    // MUST TAKE YOU TO THE BOOKING STATE/PAGE
    $state.go('booking', {
      id: instructor.id, 
      instructorName: instructor.name
    });
  }

  self.cancelBooking = function (instructor) {
    // SEND TO SERVER
    // PUT on instructor, delete a booking and remove it from instructor.bookings

    // assuming succesful response
    self.currUser.booked = "";
    
    // grab booking with current name
    var indexArray;
    for (var i = 0; i < instructor.bookings.length; i++) {
      if (instructor.bookings[i].name === self.currUser.name ) {
        indexArray = i;
        break
      }
    }
    instructor.bookings.splice(indexArray, 1);
  }

} // end HomeController
