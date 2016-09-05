var socket = io('http://kiver-pc:8191');

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


function buildMenus(files){
    var menu = "", 
        content = "";
    files.forEach(function(file){
        menu += `<li>
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

function onChange(obj){
    var pre = $("#" +extractFileName(obj.file));
    pre.html(pre.html() + "\n" + obj.data);
    
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