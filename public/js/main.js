//var socket = io('http://kiver-pc:8191');
var socket = io('https://monitor.omegasistemas.net.br', {transports: ['websocket', 'polling', 'flashsocket']});

socket.on('init', function(obj){
    $(".path").text(obj.path); 
    buildMenus(obj.files);
});

socket.on('changeFile', function(obj){
    onChange(obj); 
});

socket.on('loadFile', function(obj){
    $("#" +extractFileName(obj.file)).html(obj.data);
});

document.addEventListener('DOMContentLoaded', function () {
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.'); 
        return;
    }

    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
    
});

function notify(msg, titulo, onclick) {
    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification("Erro - " + titulo , {
            body: msg
        });

        notification.onclick = function(){
            window.focus();
            if (onclick) {
                onclick.call(window);
            }
        };
    }
}


function buildMenus(files){
    var menu = "", 
        content = "";
    files.forEach(function(file){
        menu += `<li id="mn-${extractFileName(file)}">
                    <a href="#${extractFileName(file)}">
                        ${file}
                    </a>
                </li>`;

        content += `<pre id="${extractFileName(file)}"></pre>`;
    });
    $("#logFiles").html(menu);
    $("#logs").html(content);
    actions();  
};

var error = false;
function onChange(obj){
    var filename = extractFileName(obj.file),
        pre = $("#" + filename),
        el = $("#mn-"+ filename + " a");
    pre.html(pre.html() + "\n" + obj.data);
    
    if (obj.data.indexOf("ERROR ") > 0) {
        if (!error) {
            notify(obj.data,  filename, function() {
                el.click();
            });
            error = true;
            setTimeout(() => {
                error = false;
            }, 1000 * 60);
        } else {
            console.log(filename, obj.data);
        }
        $("#mn-"+ filename + " a").addClass("error");
    } 
}

function actions() {
    $("#logFiles a").on("click", function(e){
        e.preventDefault();
        $("pre").removeClass("show");
        $(this.hash).addClass("show");
        $("#logFiles a").removeClass("active");
        this.classList.add("active");
        $(".file").text(this.innerText);
    });
}

function extractFileName(file) {
    file = file.split("/");
    file = file[file.length - 1];
    if (file) {
        file = file.split(".");
        return file[0];
    }
}