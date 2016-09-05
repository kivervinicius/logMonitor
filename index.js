var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    LogMonitor = require("./lib/LogMonitor"),
    path = "/home/kiver/Desktop/testeLog/",
    port = process.env.PORT || 8191,
    io = require('socket.io')(server);

// Routing
app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
    var logMonitor = new LogMonitor(path);

    logMonitor.on("init", obj => {
        socket.emit("init", obj);  
    });

    logMonitor.on("change", log => {
        socket.emit("changeFile", log);
    });

    logMonitor.on("load", log => {
        socket.emit("loadFile", log);
    });

    socket.on("disconnect", function(){
        logMonitor = null;
        delete logMonitor;
    });
});

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});