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

        addUpdate(videoInput + " was added to the queue!");
    });


    // Updates various things around the page when the database updates.
    db.collection("queue")
        .orderBy("created")
        .onSnapshot((snapshot) => { 
            
             // Refresh queue on user's screen.
            ul.innerHTML = "";
            queue = [];
            snapshot.forEach(doc => {
                let li = document.createElement('li');
                li.innerHTML = doc.data().URL;
                ul.append(li);
                queue.push(doc.data());
            });
    });


    db.collection("currentlyPlaying")
        .onSnapshot((snapshot) => {
            // Detect when a document is deleted (i.e., when we remove from a 
            // queue) and start watching a new video.
            snapshot.docChanges().forEach((change) => { 
                if (change.type === "added") { 
                    // Getting ID from video URL.
                    // https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
                    // console.log("test" + db.collection("currentlyPlaying").get());
                    // let videoURL = 

                    let videoID = change.doc.data().URL.split('v=')[1];
                    var ampersandPosition = videoID.indexOf('&');
                    if(ampersandPosition != -1) {
                        videoID = videoID.substring(0, ampersandPosition);
                    }

                    player.loadVideoById(videoID);
            }});
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
    
    document.getElementById("next-song").addEventListener("click", function () {
        popQueue();
    });
    

    // Remove a video from the queue and make it the currently playing video.
    function popQueue() {
        // Remove the previously "currently-playing" video.
        console.log(db.collection("currentlyPlaying").get());
        db.collection("currentlyPlaying")
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    doc.ref.delete();
                })
            });

        // Grab the video from the top of the queue and make it the new
        // currently playing video.
        var newDocRef = db.collection("currentlyPlaying").doc(queue[0].id);
        
        newDocRef.set({
            id: queue[0].id,
            URL: queue[0].URL,
        });

        // Remove that video from the queue.
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
    var hour = dt.getHours();
    if (hour >= 12)
    {
        var ampm = "pm";
    }
    else
    {
        var ampm = "am";
    }
    
    if (hour == 0)
    {
        hour = 12;
    }
    else
    {
        hour %= 12;
    }

    document.getElementById("time").innerHTML = hour + ":" + dt.getMinutes().toLocaleString('en-US', {
        minimumIntegerDigits: 2}) + ampm;
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
    'onStateChange': onPlayerStateChange,
    'onError': onError
    }
});
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function onError(error) {
    console.log(error);
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    // if (event.data == YT.PlayerState.PLAYING && !done) {
    //     setTimeout(stopVideo, 6000);
    //     done = true;
    // }
}
function stopVideo() {
    player.stopVideo();
}