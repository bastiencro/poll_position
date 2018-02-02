var Twit = require('twit')
var fs = require('fs')
var five = require("johnny-five");
// var board = new five.Board();

var T = new Twit({
  consumer_key:         'fR0WktkLF4G3rm9OfdbMOsQny',
  consumer_secret:      'zq7AgRVRySGnKSM5HPSGoJ1T9f2po0vqvvlm9hWkFSOmPCUZrt',
  access_token:         '915913284779376640-P472Fzwz1gAhadSXdt9bKERvqPhJPI6',
  access_token_secret:  'xQRw2QMm7rB29L3pYxlxFRmJueuf2dYbzyAluMWujdF5T',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

var stream;

var scoreboard = {};
var teamscoreboard = { //lancer team, declarer structure donnees
  1 : 0,
  2 : 0,
  3 : 0, //lap rhone
  4 : 0, //lap
};
var team1 = true;
var RHONE = 1; //var globale
var SAONE = 2;

var polls = [
  {
    team1 : {
      hashtag: '#ixda_1',
      score: 0
    },
    team2 : {
      hashtag: '#ixda_2',
      score: 0
    }
  },
  {
    team1 : {
      hashtag: '#ixda_A',
      score: 0
    },
    team2 : {
      hashtag: '#ixda_B',
      score: 0
    }
  }
];

var currentPoll = 0;

function doPoll() {
  console.log('-----------');
  console.log('New Poll (id: '+currentPoll+')');
  console.log('> Team 1 hashtag: '+polls[currentPoll].team1.hashtag);
  console.log('> Team 2 hashtag: '+polls[currentPoll].team2.hashtag);
  console.log('Let\'s go!');

  stream = T.stream('statuses/filter', { track: [polls[currentPoll].team1.hashtag, polls[currentPoll].team2.hashtag] })

  stream.on('tweet', function(tweet) {
    processTweet(tweet);
  }).on('error', function() {
    console.log('error');
  });
}

doPoll();


function processTweet( tweet ) {
  //console.log(tweet)
  //console.log(tweet.id_str)

console.log('new tweet!');

  var tweet_hashtags = tweet.entities.hashtags;
  for (var i = 0; i <= tweet_hashtags.length; i++) {
    console.log(tweet_hashtags[i].text);
  }
  /*
  var team = team;
  var id = tweet.id;

  polls[currentPoll][team].score++;

  console.log('Score Team 1 : '+polls[currentPoll].team1.score);
  console.log('Score Team 2 : '+polls[currentPoll].team2.score);
  */

  //  if (scoreboard[tweet.user.screen_name].score % 3 == 0) {
  //    console.log("score 1");
  //    var b64contentred = fs.readFile('D:\\Documents\\GitHub\\Twitometer\\gif\\lap_red.gif', { encoding: 'base64' })

  //    // first we must post the media to Twitter
  //    T.post('media/upload', { media_data: b64contentred }, function (err, data, response) {
  //      // now we can assign alt text to the media, for use by screen readers and
  //      // other text-based presentations and interpreters
  //      var mediaIdStr = data.media_id_string
  //      var altText = "You completed an entire lap, congrats !"
  //      var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

  //      T.post('media/metadata/create', meta_params, function (err, data, response) {
  //        if (!err) {
  // now we can reference the media and post a tweet (media will attach to the tweet)
  //          var params = { status: '@'+tweet.user.screen_name+' You completed a lap !', media_ids: [mediaIdStr] }
  //
  //          T.post('statuses/update', params, function (err, data, response) {
  //            console.log(data)
  //          })
  //        }
  //      })
  //  })
  //  }


  /*
  if (team === 1) { //put the post media here (red) /!\ modulo put this in an other if
  var led = new five.Led(13);
  led.on();
  setTimeout(function() {
  led.off();
}, (300));
}
else { //blue here
var led = new five.Led(12);
led.on();
setTimeout(function() {
led.off();
}, (300));
}
*/



// setInterval(function(){check_time();},30000); //check every 10min
// function check_time() {
//   if (Date.now() > 151067340000) {
//     //console.log('oui')
//     var result = [];
//     for(var username in scoreboard){
//       var user = {};
//       //scoreboard[username]
//       user.name = username;
//       user.team = scoreboard[username].team;
//       user.score = scoreboard[username].score;
//       result.push(user);
//     }
//     //console.log(result)
//     result.sort(
//       function(a,b) {
//         return a.score - b.score;
//       }
//     );
//     result.reverse();
//
//     //for (var i = 0; i < 3; i++) {
//     //result[i]
//
//     var b64contentend = fs.readFile('./gif/fin.gif', { encoding: 'base64' }, function(err,data){
//       // console.log(data);
//
//           // first we must post the media to Twitter
//           T.post('media/upload', { media_data: b64contentend }, function (err, data, response) {
//             // now we can assign alt text to the media, for use by screen readers and
//             // other text-based presentations and interpreters
//             var mediaIdStr = data.media_id_string
//             var altText = "You completed an entire lap, congrats !"
//             var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
//
//             T.post('media/metadata/create', meta_params, function (err, data, response) {
//               if (!err) {
//                 // now we can reference the media and post a tweet (media will attach to the tweet)
//                 var params = { status: '@'+result[0].name+'@'+result[1].name+'@'+result[2].name, media_ids: [mediaIdStr] }
//
//                 T.post('statuses/update', params, function (err, data, response) {
//                   console.log(data)
//                 })
//               }
//             })
//           })
//
//     })
//
//
//
//       //console.log(result)
//
}
