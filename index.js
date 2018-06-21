var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var busUserList = [];


app.get('/', function(req, res) {
  res.send('<h1>HungNH - SocketBus Server</h1>');
});
http.listen(3000, function() {
 console.log('Listening on *:3000');

 for (var i = 0; i < 500; i++) {
  busUserList[i] = []
 }
});


io.on('connection', function(clientSocket) {
  console.log('a user connected');
  

  clientSocket.on('followBusNumber', function(busNumber) {
    console.log('followBusNumber: ' + busNumber);

    var userList = busUserList[busNumber]
    var userInfo = {};
    userInfo["id"] = clientSocket.id;
    userInfo["bus_number"] = busNumber;
    userList.push(userInfo);
  });
  // clientSocket.on('unfollowBusNumber', function(busNumber) { //k cần nữa vì cho client disconnect trước rồi client muốn xem xe bus khác thì connect lại
  //   console.log('unfollowBusNumber: ' + busNumber);

  //   var userList = busUserList[busNumber]
  //   for (var i = 0; i < userList.length; i++) {
  //     if (userList[i]["id"] == clientSocket.id) {
  //       userList.splice(i, 1);
  //       break;
  //     }
  //   }
  // });


  clientSocket.on("pushCurrentBusLocation", function(location, busNumber) {
    var userList = busUserList[busNumber]
    for (var i=0; i<userList.length; i++) {
        io.to(userList[i]["id"]).emit("getCurrentBusLocation", location);
    }
  });


  clientSocket.on('disconnect', function(reason) {
      console.log('a user disconnected: ' + reason);

      for (var i=0; i<busUserList.length; i++) {
        var userList = busUserList[i]
        for (var j = 0; j < userList.length; j++) {
          if (userList[j]["id"] == clientSocket.id) {
            userList.splice(j, 1);
            break;
          }
        }
      }
  });



});
