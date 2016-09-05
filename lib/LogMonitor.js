var fs = require("fs"),
    Tail = require('tail').Tail,
    util = require('util'),
    EventEmitter = require('events').EventEmitter;

function FileMonitor (path, options) {  
    this.path = path;
    this.options = options;
    this.start();
    this.files = [];
    EventEmitter.call(this);
}

FileMonitor.prototype.start = function () {
    var path = this.path,
        self = this;

    if (!path) {
        throw new Error('path is required');
    }

    fs.readdir(path, (err, files) => {
        var _files = [];
        files.forEach(function(file) {
            if (file.indexOf(".") >= 0) {
                _files.push(file);
                tail = new Tail(path+file, {
                    fromBeginning: false
                });

                tail.on("line", function(data) {
                    self.emit("change", {
                        file: this.filename,
                        data: data
                    });
                });

                tail.on("error", function(error) {
                    self.emit("error", error);
                });
            }
        }, this);
        self.files = _files;
        self.emit("init",   {
            path: self.path,
            files: self.files        
        });
        self.loadFiles();
    });
};

FileMonitor.prototype.loadFiles = function(){
    this.files.forEach(file => {
        try {
            var fileContent = fs.readFileSync(this.path+file, "utf8");
            this.emit("load", {
                file: this.path+file,
                data: fileContent
            });
        } catch (error) {
            throw new Error(error);
        }
    });
};

util.inherits(FileMonitor, EventEmitter);  

module.exports = FileMonitor;  