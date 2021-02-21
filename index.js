//Your JavaScript code will go here!

window.onload = function() {
    ul = document.getElementById("video-queue");
    // var queue = [];

    document.getElementById("confirm-btn").addEventListener("click", function () {
        var videoInput = document.getElementById("video-url-input").value;
        // queue.push(videoInput);
        // console.log(queue);

        
        // Having the timestamp serve as the ID might make querying faster? I
        // don't know...

        // const date = new Date();
        // const id = date.toISOString();
        // db.collection("queue")
        //     .doc(id)
        //     .set({URL: videoInput});
        
        db.collection("queue").add({
            URL: videoInput,
            created: firebase.firestore.Timestamp.now()
        })
    });


    // We need to make sure that the user is seeing the same queue as everyone
    // else... So we pull the queue from the database and use it to update
    // the list in our HTML file.
    db.collection("queue")
        .orderBy("created")
        .onSnapshot((snapshot) => {
            ul.innerHTML = "";
            snapshot.forEach(doc => {
                let li = document.createElement('li');
                li.innerHTML = doc.data().URL;
                ul.append(li);
        })
    });

    //date and time
    var dt = new Date();
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var output = days[dt.getDay()];
    output += ", " + months[dt.getMonth()] + " " + dt.getDate() + ".";
    document.getElementById("date").innerHTML = output;

    updateTime();
    window.setInterval(updateTime, 20000);
}


function updateTime(){
    var dt = new Date();
    console.log("updating time");
    document.getElementById("time").innerHTML = dt.getHours()%12 + ":" + dt.getMinutes().toLocaleString('en-US', {
        minimumIntegerDigits: 2}) + ".";
}