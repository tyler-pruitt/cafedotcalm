//Your JavaScript code will go here!
window.onload = function() {
    var queue = [];
    document.getElementById("confirm-btn").addEventListener("click", function () {
        var videoInput = document.getElementById("video-url-input").value;
        queue.push(videoInput);
    });
}