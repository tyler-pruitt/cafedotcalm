//Your JavaScript code will go here!
window.onload = function() {
    var queue = [];
    document.getElementById("confirm-btn").addEventListener("click", function () {
        var videoInput = document.getElementById("video-url-input").value;
        queue.push(videoInput);
        console.log(queue);

        ul = document.getElementById("video-queue");
        let li = document.createElement('li');
        li.innerHTML = videoInput;
        ul.append(li);
    });
}