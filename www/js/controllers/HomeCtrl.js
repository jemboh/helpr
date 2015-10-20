angular.module('starter.controllers')

.controller('HomeCtrl', function($scope) {

  // make an Instructor Resource

  $scope.instructors = [ 
    { name: 'Tom', status:'Available', bookings: [] },
    { name: 'Gui', status:'Available', bookings: [] },
    { name: 'Jen', status:'Busy', bookings: [{name: 'jack', booked: ""}, {name: 'rob', booked: ""}] },
    { name: 'Jeremy', status:'Busy', bookings: [{name: 'chris', booked: ""}, {name: 'mark', booked: ""}, {name: 'paco', booked: ""}] }
  ];
  // $scope.instructors = Instructor.query();

  // ensure access to current user
  // Parse.currentUser();
  // fake current user for now
  $scope.currUser = {name: 'Test Donkey', booked: ""};

  $scope.toggleQueue = function (instructor) {
    // ensure the divs know when to show and hide
    // first hide them all, then show the one we want
    $scope.instructors.forEach(function(instructor){
      instructor.showMe = false;
    })
    instructor.showMe === true ? instructor.showMe = false : instructor.showMe = true;
  }

  $scope.addBooking = function (instructor) {
    // SEND TO SERVER
    // PUT on instructor, create a booking and add it to instructor.bookings
    // assuming succesful response

    // MUST TAKE YU TO A NEW PAGE
    
    instructor.bookings.push($scope.currUser);
    instructor.status = 'busy';
    $scope.currUser.booked = instructor.name;
  }

  $scope.cancelBooking = function (instructor) {
    // SEND TO SERVER
    // PUT on instructor, delete a booking and remove it from instructor.bookings
    // assuming succesful response
    $scope.currUser.booked = "";
    var indexArray = instructor.bookings.indexOf($scope.currUser);
    instructor.bookings.splice(indexArray, 1);
  }

})



