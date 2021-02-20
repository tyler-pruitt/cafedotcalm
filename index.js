//Your JavaScript code will go here!
// Firebase App (the core Firebase SDK) is always required and must be listed first



window.onload = function() {
    var queue = [];
    document.getElementById("confirm-btn").addEventListener("click", function () {
        var videoInput = document.getElementById("video-url-input").value;
        queue.push(videoInput);
        console.log(queue);

        db.collection("queue").add({URL: videoInput})


        ul = document.getElementById("video-queue");
        let li = document.createElement('li');
        li.innerHTML = videoInput;
        ul.append(li);
    });
    //date and time
    var dt = new Date();
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var output = days[dt.getDay()];
    output += ", " + months[dt.getMonth()] + " " + dt.getDate() + ".";
    document.getElementById("date").innerHTML = output;

    document.getElementById("time").innerHTML = dt.getHours() + ":" + dt.getMinutes() + ".";

}