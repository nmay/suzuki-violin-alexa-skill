'use strict';
var Alexa = require("alexa-sdk");

// For detailed tutorial on how to making a Alexa skill,
// please visit us at http://alexa.design/build

const songIdToSongDetailsMap = {
  "song_id_1_1": {"name": "Twinkle Twinkle Little Star", "book": 1},
  "song_id_1_2": {"name": "Lightly Row", "book": 1},
  "song_id_1_3": {"name": "Song of the Wind", "book": 1},
  "song_id_1_4": {"name": "Go Tell Aunt Rhody", "book": 1},
  "song_id_1_5": {"name": "O Come Little Children", "book": 1},
  "song_id_1_6": {"name": "May Song", "book": 1},
  "song_id_1_7": {"name": "Long Long Ago", "book": 1},
  "song_id_1_8": {"name": "Allegro", "book": 1},
  "song_id_1_9": {"name": "Perpetual Motion", "book": 1},
  "song_id_1_10": {"name": "Allegretto", "book": 1},
  "song_id_1_11": {"name": "Andantino", "book": 1},
  "song_id_1_12": {"name": "Etude", "book": 1},
  "song_id_1_13": {"name": "Minuet one", "book": 1},
  "song_id_1_14": {"name": "Minuet two", "book": 1},
  "song_id_1_15": {"name": "Minuet three", "book": 1},
  "song_id_1_16": {"name": "The Happy Farmer", "book": 1},
  "song_id_1_17": {"name": "Gossec Gavotte", "book": 1},
  "song_id_2_1": {"name": "Chorus from Judas Maccabaeus", "book": 2},
  "song_id_2_2": {"name": "Musette", "book": 2},
  "song_id_2_3": {"name": "Hunters Chorus", "book": 2},
  "song_id_2_4": {"name": "Long Long Ago Book two", "book": 2},
  "song_id_2_5": {"name": "waltz", "book": 2},
  "song_id_2_6": {"name": "bouree book two", "book": 2},
  "song_id_2_7": {"name": "the two grenadiers", "book": 2},
  "song_id_2_8": {"name": "theme from witches dance", "book": 2},
  "song_id_2_9": {"name": "gavotte from mignon", "book": 2},
  "song_id_2_10": {"name": "lully gavotte", "book": 2},
  "song_id_2_11": {"name": "minuet in g", "book": 2},
  "song_id_2_12": {"name": "boccherini minuet", "book": 2},
  "song_id_3_1": {"name": "martini gavotte", "book": 3},
  "song_id_3_2": {"name": "bach minuet", "book": 3},
  "song_id_3_3": {"name": "gavotte in g minor", "book": 3},
  "song_id_3_4": {"name": "humoresque", "book": 3},
  "song_id_3_5": {"name": "becker gavotte", "book": 3},
  "song_id_3_6": {"name": "gavotte in d major", "book": 3},
  "song_id_3_7": {"name": "bouree book three", "book": 3}
};

exports.handler = function (event, context) {
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
  'LaunchRequest': function () {
    this.emit('SayHello');
  },
  // 'HelloWorldIntent': function () {
  //   this.emit('SayHello');
  // },
  // 'MyNameIsIntent': function () {
  //   this.emit('SayHelloName');
  // },
  // 'SayHello': function () {
  //   this.response.speak('Hello World!')
  //     .cardRenderer('hello world', 'hello world');
  //   this.emit(':responseReady');
  // },
  // 'SayHelloName': function () {
  //   var name = this.event.request.intent.slots.name.value;
  //   this.response.speak('Hello ' + name)
  //     .cardRenderer('hello world', 'hello ' + name);
  //   this.emit(':responseReady');
  // },
  'SessionEndedRequest': function () {
    console.log('Session ended with reason: ' + this.event.request.reason);
  },
  'AMAZON.StopIntent': function () {
    this.response.speak('Bye');
    this.emit(':responseReady');
  },
  'AMAZON.HelpIntent': function () {
    this.response.speak("You can try: 'alexa, hello world' or 'alexa, ask hello world my" +
      " name is awesome Aaron'");
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function () {
    this.response.speak('Bye');
    this.emit(':responseReady');
  },
  'GetSongIntent': function () {
    this.response.speak('Twinkle Twinkle Little Star');
    this.emit(':responseReady');
  },
  'TellSongIntent': function () {

    console.log('Calling TellSongIntent');
    const songNameSlot = this.event.request.intent.slots.SongName;
    var songData = getSongData(songNameSlot);

    let speechOutput = "you are in book ";

    if(songData.isValidated) {
      console.log('valid data');
      var songDetail = songIdToSongDetailsMap[songData.id];
      console.log("songDetail: " + JSON.stringify(songDetail));
      speechOutput = "you are in book " + songDetail.book.toString().toLowerCase();
    } else {
      console.log('invalid data');
      speechOutput = "unable to determine book number";
    }
    // if (songNameSlot && songNameSlot.value) {
    //   songName = songNameSlot.value.toLowerCase();
    //   console.log('songName value: ' + songName);
    // } else {
    //   console.log('No songName')
    // }

    // let songId;
    // if (songNameSlot && songNameSlot.resolutions) {
    //   songId = songNameSlot.resolutions.resolutionsPerAuthority;

    //   // for each authority
    //   // look at all 'values'
    //   // find 'value.id'
    //   console.log('songName value: ' + songName);
    // }

    this.response.speak(speechOutput);
    this.emit(':responseReady');
  },
  'Unhandled': function () {
    this.response.speak("Sorry, I didn't get that. You can try: 'alexa, hello world'" +
      " or 'alexa, ask hello world my name is awesome Aaron'");
  }
};

function getSongData(songSlot) {

  let songData;

  console.log('Getting song data for: ' + JSON.stringify(songSlot));

  if (songSlot &&
    songSlot.resolutions &&
    songSlot.resolutions.resolutionsPerAuthority[0] &&
    songSlot.resolutions.resolutionsPerAuthority[0].status &&
    songSlot.resolutions.resolutionsPerAuthority[0].status.code) {

      switch (songSlot.resolutions.resolutionsPerAuthority[0].status.code) {
        case "ER_SUCCESS_MATCH":
        console.log("resolution status code of ER_SUCCESS_MATCH");
          songData = {
            "id": songSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id,
            "synonym": songSlot.value,
            "resolved": songSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name,
            "isValidated": true
          };
          break;
        case "ER_SUCCESS_NO_MATCH":

          console.log("resolution status code of ER_SUCCESS_NO_MATCH");
          songData = {
            "id": -1,
            "synonym": songSlot.value,
            "resolved": songSlot.value,
            "isValidated": false
          };
          break;
        }
    } else {
      console.log("no resolution status code");
      songData = {
        "id": -1,
        "synonym": songSlot.value,
        "resolved": songSlot.value,
        "isValidated": false
      };
    }
  
  console.log("songData: " + JSON.stringify(songData));
  return songData;
}
