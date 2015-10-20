angular.module('starter.controllers')

.controller('HomeCtrl', function($scope) {

  $scope.instructors = [ 
    { name: 'Tom', status:'Available', queue: 0 },
    { name: 'Gui', status:'Available',queue: 0 },
    { name: 'Jen', status:'Busy', queue: 3 },
    { name: 'Jeremy', status:'Busy', queue: 4 }
  ];

  

})