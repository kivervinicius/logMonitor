var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    LogMonitor = require("./lib/LogMonitor"),
    path = "/home/kiver/Desktop/testeLog/",
    port = process.env.PORT || 8191,
    io = require('socket.io')(server);

// Routing
app.use(express.static(__dirname + '/public'));

var mnt = new LogMonitor(path);


io.on('connection', function(socket){

    socket.emit("init", {
        path: path,
        files: LogMonitor.files        
    });

    mnt.on("change", log => {
        console.log(log.data);
        socket.emit("changeFile", log);
    });

    mnt.on("load", log => {
        console.log(log.data);
        socket.emit("loadFile", log);
    });
});

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});