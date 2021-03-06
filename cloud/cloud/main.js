
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("modifyUser", function(request, response) {

    Parse.Cloud.useMasterKey();

    var bookingQuery = new Parse.Query('Booking');
    bookingQuery.equalTo('objectId', request.params.bookingId);

    var userQuery = new Parse.Query(Parse.User);
    userQuery.equalTo('objectId', request.params.userId);

    userQuery.first({
      success: function(instructor) {
        instructor.set('status', 'busy');
        var bookings = instructor.relation('bookings');

        bookingQuery.first({
          success: function(booking) {
            bookings.add(booking)
            instructor.save();
            response.success('booking saved to user')
          }
        });
      },
      error: function(user, error) {
        response.error("Could not save changes to user.");
      }
    });
  });


Parse.Cloud.define("bookUser", function(request, response) {

    Parse.Cloud.useMasterKey();

    console.log('request useBook', request);

    var studentQuery = new Parse.Query(Parse.User);
    studentQuery.equalTo('objectId', request.params.userId);

    var instructorQuery = new Parse.Query(Parse.User);
    instructorQuery.equalTo('objectId', request.params.instructorId);

    studentQuery.first({
      success: function(student) {
        instructorQuery.first({
          success: function (instructor) {
            var instructorName = instructor.get('name');
            student.set('booked', instructorName);
            student.save();
            response.success('user is booked with ' + instructorName);
          }
        })
      },
      error: function(user, error) {
        response.error("Could not save changes to user.");
      }
    });
  });