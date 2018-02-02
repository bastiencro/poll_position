var Twit = require('twit')
var fs = require('fs')
var five = require("johnny-five");
var board = new five.Board();

var T = new Twit({
  consumer_key:         '65Mqgi4IcZATwIytk1uvtIUPW',
  consumer_secret:      'WjcmIF6Xzr3eAY8D4iSOSjtGLwTXqtPSYOOx1vs4tV1a4McEID',
  access_token:         '915913284779376640-D2iQgsZyamzLi5s0Ae8wmPyUJcZhoC8',
  access_token_secret:  'X5bwtrbnAFAg6mSCdGhJgRYaCiDSrIm0VDOMj7u9b67An',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

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

var stream = T.stream('statuses/filter', { track: '#test_ixda18_1' })
stream.on('tweet', function (tweet) {
  console.log(tweet)
  process_tweet(tweet)
})


function process_tweet( tweet ) {
  //console.log(tweet)
  //console.log(tweet.id_str)
  var id = tweet.id;

  if (!(tweet.user.screen_name in scoreboard)) {
    scoreboard[tweet.user.screen_name] = {}
    scoreboard[tweet.user.screen_name].score = 0;
    if (team1) scoreboard[tweet.user.screen_name].team = RHONE; //car bouléen
    else scoreboard[tweet.user.screen_name].team = SAONE; //replace by team name a l'affichage
    team1 = !team1;
  }

  var team  = scoreboard[tweet.user.screen_name].team;
  teamscoreboard[team]+=1;
  scoreboard[tweet.user.screen_name].score+=1;

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
      }, (300));}

      console.log(scoreboard);
    }
  
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
