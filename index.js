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

        player.loadVideoByUrl(videoInput);
        player.playVideo();

        addUpdate(videoInput + " was added to the queue!");
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
    
    document.getElementById("clear-queue").addEventListener("click", function () {
        for (let i = 0; i < queue.length; i ++) {
            db.collection("queue").doc(queue[i].id).delete();
        }
    });
    

    async function popQueue() {
        await db.collection("queue").doc(queue[0].id).delete();
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

    //autoscroll
    var ud = document.getElementById("updates-box");
    ud.scrollTop = ud.scrollHeight;

    // document.getElementById("updates").insertAdjacentHTML("beforeend", "<p>" + message + "</p>");    
}

//video player

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// creates an <iframe> (and YouTube player) after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
player = new YT.Player('player', {
    videoId: '5qap5aO4i9A',
    events: {
    'onReady': onPlayerReady,
    'onStateChange': onPlayerStateChange
    }
});
}

function onPlayerReady(event) {
    event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }
}
function stopVideo() {
    player.stopVideo();
}