var fs = require("fs"),
    Tail = require('tail').Tail,
    util = require('util'),
    EventEmitter = require('events').EventEmitter;

function FileMonitor (path, options) {  
    this.path = path;
    this.options = options;
    this.start();
    EventEmitter.call(this);
}

FileMonitor.prototype.start = function () {
    var path = this.path,
        self = this;

    if (!path) {
        throw new Error('path is required');
    }

    fs.readdir(path, (err, files) => {
        files.forEach(function(file) {
            tail = new Tail(path+file, {
                fromBeginning: false
            });

            try {
                var fileContent = fs.readFileSync(path+file, "utf8");
                self.emit("load", {
                    file: path+file,
                    data: fileContent
                });
            } catch (error) {
                throw new Error(error);
            }

            tail.on("line", function(data) {
                self.emit("change", {
                    file: this.filename,
                    data: data
                });
            });

            tail.on("error", function(error) {
                self.emit("error", error);
            });

        }, this);

        FileMonitor.files = files;
    });
};

util.inherits(FileMonitor, EventEmitter);  

module.exports = FileMonitor;  