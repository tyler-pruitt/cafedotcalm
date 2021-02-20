//Your JavaScript code will go here!
window.onload = function() {
    var queue = [];
    document.getElementById("create-meme").addEventListener("click", function () {
        var videoInput = document.getElementById("video-url-input").value;
        queue.push(videoInput);
    });
}