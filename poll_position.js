var Twit = require('twit')
var fs = require('fs')
var five = require("johnny-five");
var board = new five.Board();

var twitterUsernameIdRecevingPollResults = '928204573642231808'; // http://gettwitterid.com/?user_name=Bastientestdsaa
// 915913284779376640 = bot
var T = new Twit({
  consumer_key:         '2PqYRnBDvBp4jJ3n0qRZGF0pS',
  consumer_secret:      'mqtWA2b7jeulxZUsAK8TANJ6EO9zXO3iPOebFHHQsN7zE0CTHz',
  access_token:         '915913284779376640-eD54LIovJPXy8pAQBs23HUGsgRhoAaE',
  access_token_secret:  'lRylfyxLWvKu55h5RnSlR2ssXtTRX1f11FYOotgGficTh',
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
      hashtag: 'ixda_1',
      score: 0
    },
    team2 : {
      hashtag: 'ixda_2',
      score: 0
    }
  },
  {
    team1 : {
      hashtag: 'ixda_A',
      score: 0
    },
    team2 : {
      hashtag: 'ixda_B',
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
  });
}

var tweet_team1 = {"created_at":"Fri Feb 02 12:58:05 +0000 2018","id":959410594226098200,"id_str":"959410594226098177","text":"#ixda_1 ghj","source":"<a href=\"http://twitter.com/download/android\" rel=\"nofollow\">Twitter for Android</a>","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":928204573642231800,"id_str":"928204573642231808","name":"Bastien_test","screen_name":"Bastientestdsaa","location":null,"url":null,"description":null,"translator_type":"none","protected":false,"verified":false,"followers_count":0,"friends_count":2,"listed_count":0,"favourites_count":1,"statuses_count":155,"created_at":"Wed Nov 08 10:16:30 +0000 2017","utc_offset":null,"time_zone":null,"geo_enabled":false,"lang":"fr","contributors_enabled":false,"is_translator":false,"profile_background_color":"F5F8FA","profile_background_image_url":"","profile_background_image_url_https":"","profile_background_tile":false,"profile_link_color":"1DA1F2","profile_sidebar_border_color":"C0DEED","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"profile_image_url":"http://pbs.twimg.com/profile_images/928902467882029057/cf-Oz-Oz_normal.jpg","profile_image_url_https":"https://pbs.twimg.com/profile_images/928902467882029057/cf-Oz-Oz_normal.jpg","default_profile":true,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null},"geo":null,"coordinates":null,"place":null,"contributors":null,"is_quote_status":false,"quote_count":0,"reply_count":0,"retweet_count":0,"favorite_count":0,"entities":{"hashtags":[{"text":"ixda_1","indices":[0,7]}],"urls":[],"user_mentions":[],"symbols":[]},"favorited":false,"retweeted":false,"filter_level":"low","lang":"und","timestamp_ms":"1517576285307"};

var tweet_team2 = {"created_at":"Fri Feb 02 12:58:05 +0000 2018","id":959410594226098200,"id_str":"959410594226098177","text":"#ixda_2 ghj","source":"<a href=\"http://twitter.com/download/android\" rel=\"nofollow\">Twitter for Android</a>","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":928204573642231800,"id_str":"928204573642231808","name":"Bastien_test","screen_name":"Bastientestdsaa","location":null,"url":null,"description":null,"translator_type":"none","protected":false,"verified":false,"followers_count":0,"friends_count":2,"listed_count":0,"favourites_count":1,"statuses_count":155,"created_at":"Wed Nov 08 10:16:30 +0000 2017","utc_offset":null,"time_zone":null,"geo_enabled":false,"lang":"fr","contributors_enabled":false,"is_translator":false,"profile_background_color":"F5F8FA","profile_background_image_url":"","profile_background_image_url_https":"","profile_background_tile":false,"profile_link_color":"1DA1F2","profile_sidebar_border_color":"C0DEED","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"profile_image_url":"http://pbs.twimg.com/profile_images/928902467882029057/cf-Oz-Oz_normal.jpg","profile_image_url_https":"https://pbs.twimg.com/profile_images/928902467882029057/cf-Oz-Oz_normal.jpg","default_profile":true,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null},"geo":null,"coordinates":null,"place":null,"contributors":null,"is_quote_status":false,"quote_count":0,"reply_count":0,"retweet_count":0,"favorite_count":0,"entities":{"hashtags":[{"text":"ixda_2","indices":[0,7]}],"urls":[],"user_mentions":[],"symbols":[]},"favorited":false,"retweeted":false,"filter_level":"low","lang":"und","timestamp_ms":"1517576285307"};


function processTweet( tweet ) {

  console.log(JSON.stringify(tweet));

  var team;
  var tweet_hashtags = tweet.entities.hashtags;

  for (var i = 0; i < tweet_hashtags.length; i++) {
    if (tweet_hashtags[i].text == polls[currentPoll].team1.hashtag) {
      team = 'team1';
    }
    if (tweet_hashtags[i].text == polls[currentPoll].team2.hashtag) {
      team = 'team2';
    }
  }

  var id = tweet.id;

  polls[currentPoll][team].score++;

  if (team == 'team1') { //put the post media here (red) /!\ modulo put this in an other if
    var led = new five.Led(13);
    led.on();
    setTimeout(function() {
      led.off();
    }, (3000));
  }
  else { //blue here
    var led = new five.Led(12);
    led.on();

    setTimeout(function() {
      led.off();
    }, (3000));
  }


  console.log('Score Team 1 : '+polls[currentPoll].team1.score);
  console.log('Score Team 2 : '+polls[currentPoll].team2.score);

  sendPollResults();

/*
   if (scoreboard[tweet.user.screen_name].score % 3 == 0) {
     console.log("score 1");
     var b64contentred = fs.readFile('D:\\Documents\\GitHub\\Twitometer\\gif\\lap_red.gif', { encoding: 'base64' })

     // first we must post the media to Twitter
     T.post('media/upload', { media_data: b64contentred }, function (err, data, response) {
       // now we can assign alt text to the media, for use by screen readers and
       // other text-based presentations and interpreters
       var mediaIdStr = data.media_id_string
       var altText = "You completed an entire lap, congrats !"
       var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

       T.post('media/metadata/create', meta_params, function (err, data, response) {
         if (!err) {
  now we can reference the media and post a tweet (media will attach to the tweet)
           var params = { status: '@'+tweet.user.screen_name+' You completed a lap !', media_ids: [mediaIdStr] }

           T.post('statuses/update', params, function (err, data, response) {
             console.log(data)
           })
         }
       })
   })
   }
*/



/*
setInterval(function(){check_time();},30000); //check every 10min
function check_time() {
  if (Date.now() > 151067340000) {
    //console.log('oui')
    var result = [];
    for(var username in scoreboard){
      var user = {};
      //scoreboard[username]
      user.name = username;
      user.team = scoreboard[username].team;
      user.score = scoreboard[username].score;
      result.push(user);
    }
    //console.log(result)
    result.sort(
      function(a,b) {
        return a.score - b.score;
      }
    );
    result.reverse();

    //for (var i = 0; i < 3; i++) {
    //result[i]

    var b64contentend = fs.readFile('./gif/fin.gif', { encoding: 'base64' }, function(err,data){
      // console.log(data);

          // first we must post the media to Twitter
          T.post('media/upload', { media_data: b64contentend }, function (err, data, response) {
            // now we can assign alt text to the media, for use by screen readers and
            // other text-based presentations and interpreters
            var mediaIdStr = data.media_id_string
            var altText = "You completed an entire lap, congrats !"
            var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

            T.post('media/metadata/create', meta_params, function (err, data, response) {
              if (!err) {
                // now we can reference the media and post a tweet (media will attach to the tweet)
                var params = { status: '@'+result[0].name+'@'+result[1].name+'@'+result[2].name, media_ids: [mediaIdStr] }

                T.post('statuses/update', params, function (err, data, response) {
                  console.log(data)
                })
              }
            })
          })

    })



      //console.log(result)
*/
}

function lookForNewPollOrder() {
  T.get('direct_messages/events/list', {}, function(err, data, response) {
    console.log(data);
    for (var j = 0; j < data.events.length; j++) {
      if (data.events[j].message_create.target.recipient_id == '915913284779376640') {

        for (var k = 0; k < data.events[j].message_create.message_data.entities.hashtags.length; k++) {
          var hashtag = data.events[j].message_create.message_data.entities.hashtags[k].text;

          if (hashtag.substr(0,5) == 'POLL_') {
            var idNewPoll = parseInt(hashtag.substr(5));
            console.log(idNewPoll);

            if (idNewPoll != currentPoll) {
              currentPoll = parseInt*(idNewPoll);
              doPoll();
              return;
            }
          }

        }

      }
    }
  });
}

function sendPollResults() {
  /*
  T.post('direct_messages/events/new', { event: { type: 'message_create', message_create: {
      "target": {
        "recipient_id": twitterUsernameIdRecevingPollResults
      },
      "message_data": {
        "text": 'Hello ! La team #'+polls[currentPoll].team1.hashtag+' a eu '+polls[currentPoll].team1.score+' votes et la team #'+polls[currentPoll].team2.hashtag+' a eu '+polls[currentPoll].team2.score+' votes.',
      }
    }
  }
} , function(err, data, response) {
    console.log(data)
  })*/
}



board.on("ready", function() {
  doPoll();
  lookForNewPollOrder();
  // sendPollResults();

  processTweet(tweet_team1);
  // processTweet(tweet_team2);

  //setInterval(function(){
    //processTweet(tweet_team1);
  //},3000);
});
