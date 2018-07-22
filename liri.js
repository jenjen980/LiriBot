require("dotenv").config();
//require the request
var request = require("request");
var fs = require("fs");
var Twitter = require("twitter");
var spotify = require('node-spotify-api');
//var spotify = require("spotify");
var sourceKeys = require('./keys.js');

var spotify = new spotify(sourceKeys.spotify);
var client = new Twitter(sourceKeys.twitter);

const cb = (err) => { if(err) console.error(err); }

var userCommand = process.argv[2];
var userInput = process.argv[3];


switch(userCommand){
    case "my-tweets":
        myTweets();
    break;

    case "spotify-this-song":
        var songName = userInput;
        spotifySong(songName);
    break;

    case "movie-this":
        var movieName = userInput;
        movieThis(movieName);
    break;

    case "do-what-it-says":
        doWhat();
    break;

    default:
        console.log("Enter command");
    }

//twitter function
function myTweets(){
//parameters for twitter
var params = {screen_name: 'Jenny88953142', count:'20'};

    client.get("statuses/user_timeline", params, function(error, tweets, response) {
        if (!error) {
            for(var i = 0; i<tweets.length; i++){
                var tweet = tweets[i].text;
                var tweetTime = tweets[i].created_at;
                //console.log('Jenny88953142' + tweet + 'at' + tweetTime);
                fs.appendFile('log.txt', 'Jenny88953142' + tweet + 'at' + tweetTime +"\n", cb);
        }
    } else {
        console.log("Error: " + error);

    }
    });
};

//spotify
function spotifySong(songName){

    var songName = process.argv[3];
    if(songName == null){
        songName = "I Saw the sign, Ace of Base";
    } 

    var parameter = songName;
    spotify.search({type: 'track', query: parameter}, function(error, data){
        if(!error && songName != null){
            for(var i=0; i<data.tracks.items.length; i++){
                var artists = data.tracks.items[i].artists[0].name;
                var name = data.tracks.items[i].name;
                var preview = data.tracks.items[i].preview_url;
                var album = data.tracks.items[i].album.name;
                console.log('Artist: ' + artists);
                console.log('Song Name: ' + name);
                console.log('Preview URL: ' + preview);
                console.log('Album Name: ' + album);
            }
        } else {
            console.log(error);
        }
        fs.appendFile('log.txt', 'Artist: ' + artists +"\n", cb);
        fs.appendFile('log.txt', 'Song Name: ' + name +"\n", cb);
        fs.appendFile('log.txt', 'Preview URL: ' + preview +"\n", cb);
        fs.appendFile('log.txt', 'Album Name: ' + album +"\n", cb);
    })
}
    

function movieThis(title){

   if(title == null){
        title = "Mr. Nobody";
   }

//url for omdb
request(`http://www.omdbapi.com/?t=${title}&y=&plot=short&apikey=trilogy`, function(error, response, body){

  // If there were no errors and the response code was 200 (i.e. the request was successful)...
  if (!error && response.statusCode === 200) {
    //parsing out the output for the omdb
    console.log(`Title of Movie: ${JSON.parse(body).Title}`);
    console.log(`Year Released: ${JSON.parse(body).Year}`);
    console.log(`IMDB Rating: ${JSON.parse(body).Ratings[0].Value}`);
    console.log(`Rotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}`);
    console.log(`Country that Movie was Produced: ${JSON.parse(body).Country}`);
    console.log(`Language of Movie: ${JSON.parse(body).Language}`);
    console.log(`Plot: ${JSON.parse(body).Plot}`);
    console.log(`Actors: ${JSON.parse(body).Actors}`);
    
   // appending the info to the log file
    fs.appendFile('log.txt', `Title of Movie: ${JSON.parse(body).Title}` +"\n", cb);
    fs.appendFile('log.txt', `Year Released: ${JSON.parse(body).Year}`+"\n", cb);
    fs.appendFile('log.txt', `IMDB Rating: ${JSON.parse(body).Ratings[0].Value}`+"\n", cb);
    fs.appendFile('log.txt', `Rotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}`+"\n", cb);
    fs.appendFile('log.txt', `Country that Movie was Produced: ${JSON.parse(body).Country}`+"\n", cb);
    fs.appendFile('log.txt', `Language of Movie: ${JSON.parse(body).Language}`+"\n", cb);
    fs.appendFile('log.txt', `Plot: ${JSON.parse(body).Plot}`+"\n", cb);
    fs.appendFile('log.txt', `Actors: ${JSON.parse(body).Actors}`+"\n", cb);
    // } else {
    //    console.log(error);
    }
});
}

function doWhat(){
//readFile from text doc
fs.readFile('random.txt', "utf8", function(error, data){
    if(error){
        console.log(error);
    } else {
        var stuffToDo = data.split(",");
        userCommand = stuffToDo[0];
        userInput = stuffToDo[1];

        switch (userCommand) {
            case "my-tweets":
            myTweets();
        break;
    
        case "spotify-this-song":
            var songName = userInput;
            spotifySong(songName);
        break;
    
        case "movie-this":
            var movieName = userInput;
            movieThis(movieName);
        break;
    
        case "do-what-it-says":
            doWhat();
        break;
    
        default:
            console.log("Enter command");
        }
    
    }
})
}
