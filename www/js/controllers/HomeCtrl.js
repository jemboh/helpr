angular.module('helpr')
  .controller('HomeCtrl', HomeController);

HomeController.$inject = ['$state', 'ParseService'];

function HomeController($state, ParseService) {

  console.log(ParseService)
  // make an Instructor Resource
  // $scope.instructors = Instructor.query();
  var self = this;

  self.instructors = [ 
    { id: 1, name: 'Tom', status:'Available', bookings: [], img: 'http://i.imgur.com/pzBLQZx.jpg' },
    { id: 2, name: 'Gui', status:'Available', bookings: [{name: 'Niall', topic: "CSS"}, {name: 'Ambar', topic: "Mongo"}], img: 'http://i.imgur.com/rDlcbJQ.jpg'  },
    { id: 3, name: 'Jen', status:'Busy', bookings: [{name: 'Jack', topic: "CSS"}, {name: 'Rob', topic: "Mongo"}], img: 'http://i.imgur.com/nUmxjUT.jpg' },
    { id: 4, name: 'Jeremy', status:'Busy', bookings: [{name: 'Chris', topic: "D3"}, {name: 'Mark', topic: "General Politics"}, {name: 'Paco', topic: "Database"}], img: 'http://i.imgur.com/0GF4arQ.jpg' }
  ];

  // ensure access to current user
  // Parse.currentUser();
  // fake current user for now
  self.currUser = ParseService.getCurrentUser();
  self.currUser.name = 'Test Donkey';
  self.currUser.booked = '';
  console.log(self.currUser);

  self.toggleQueue = function (instructor) {
    // ensure the divs know when to show and hide
    // first hide them all, then show the one we want
    self.instructors.forEach(function(instructor){
      instructor.showMe = false;
    })
    instructor.showMe === true ? instructor.showMe = false : instructor.showMe = true;
  }

  self.addBooking = function (instructor) {
    // SEND TO SERVER
    // PUT on instructor, create a booking and add it to instructor.bookings
    // assuming succesful response
    // console.log(instructor.name)
    // MUST TAKE YU TO THE BOOKING STATE/PAGE
    $state.go('booking', {
      id: instructor.id, 
      instructorName: instructor.name
    });
    
    // instructor.bookings.push(self.currUser);
    // instructor.status = 'busy';
    // self.currUser.booked = instructor.name;
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
