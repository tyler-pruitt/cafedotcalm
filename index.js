//Your JavaScript code will go here!

window.onload = function() {
    ul = document.getElementById("video-queue");
    var queue = [];

    document.getElementById("confirm-btn").addEventListener("click", function () {
        var videoInput = document.getElementById("video-url-input").value;
        document.getElementById("video-url-input").value = "";

        let newDocRef = db.collection("queue").doc();
        newDocRef.set({
            id: newDocRef.id,
            URL: videoInput,
            created: firebase.firestore.Timestamp.now()
        });
    });


    // Refresh queue on user's screen.
    db.collection("queue")
        .orderBy("created")
        .onSnapshot((snapshot) => {
            ul.innerHTML = "";
            queue = [];
            snapshot.forEach(doc => {
                let li = document.createElement('li');
                li.innerHTML = doc.data().URL;
                ul.append(li);
                queue.push(doc.data());
            });
    });


    //update message
    // addUpdate("welcome!");

    // Refresh chat on user's screen.
    // Please replace. Super inefficient.
    db.collection("chat")
        .orderBy("created")
        .onSnapshot((snapshot) => {
            let chat = document.getElementById("updates");
            chat.innerHTML = "<p>welcome!</p>";
            snapshot.forEach(doc => {
                chat.insertAdjacentHTML("beforeend", "<p>" + doc.data().message + "</p>");    
        });
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
    
    function popQueue() {
        db.collection("queue").doc(queue[0].id).delete();
    }

    //update/chat
    document.getElementById("enter-btn").addEventListener("click", function(){
        var chat = document.getElementById("chat-input").value;
        document.getElementById("chat-input").value = "";
        addUpdate(chat);
    });   
}


function updateTime(){
    var dt = new Date();
    document.getElementById("time").innerHTML = dt.getHours()%12 + ":" + dt.getMinutes().toLocaleString('en-US', {
        minimumIntegerDigits: 2}) + ".";
}

function addUpdate(message){
    var newDocRef = db.collection("chat").doc();
    newDocRef.set({
        message: message,
        created: firebase.firestore.Timestamp.now()
    });
    // document.getElementById("updates").insertAdjacentHTML("beforeend", "<p>" + message + "</p>");    
}
