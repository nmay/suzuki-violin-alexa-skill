'use strict';
var Alexa = require("alexa-sdk");

// For detailed tutorial on how to making a Alexa skill,
// please visit us at http://alexa.design/build

const songIdToSongDetailsMap = {
  "song_id_1_1": {"name": "Twinkle Twinkle Little Star", "bookNumber": 1, "songIndex": 0},
  "song_id_1_2": {"name": "Lightly Row", "bookNumber": 1, "songIndex": 1},
  "song_id_1_3": {"name": "Song of the Wind", "bookNumber": 1, "songIndex": 2},
  "song_id_1_4": {"name": "Go Tell Aunt Rhody", "bookNumber": 1, "songIndex": 3},
  "song_id_1_5": {"name": "O Come Little Children", "bookNumber": 1, "songIndex": 4},
  "song_id_1_6": {"name": "May Song", "bookNumber": 1, "songIndex": 5},
  "song_id_1_7": {"name": "Long Long Ago", "bookNumber": 1, "songIndex": 6},
  "song_id_1_8": {"name": "Allegro", "bookNumber": 1, "songIndex": 7},
  "song_id_1_9": {"name": "Perpetual Motion", "bookNumber": 1, "songIndex": 8},
  "song_id_1_10": {"name": "Allegretto", "bookNumber": 1, "songIndex": 9},
  "song_id_1_11": {"name": "Andantino", "bookNumber": 1, "songIndex": 10},
  "song_id_1_12": {"name": "Etude", "bookNumber": 1, "songIndex": 11},
  "song_id_1_13": {"name": "Minuet one", "bookNumber": 1, "songIndex": 12},
  "song_id_1_14": {"name": "Minuet two", "bookNumber": 1, "songIndex": 13},
  "song_id_1_15": {"name": "Minuet three", "bookNumber": 1, "songIndex": 14},
  "song_id_1_16": {"name": "The Happy Farmer", "bookNumber": 1, "songIndex": 15},
  "song_id_1_17": {"name": "Gossec Gavotte", "bookNumber": 1, "songIndex": 16},
  "song_id_2_1": {"name": "Chorus from Judas Maccabaeus", "bookNumber": 2, "songIndex": 0},
  "song_id_2_2": {"name": "Musette", "bookNumber": 2, "songIndex": 1},
  "song_id_2_3": {"name": "Hunters Chorus", "bookNumber": 2, "songIndex": 2},
  "song_id_2_4": {"name": "Long Long Ago Book two", "bookNumber": 2, "songIndex": 3},
  "song_id_2_5": {"name": "waltz", "bookNumber": 2, "songIndex": 4},
  "song_id_2_6": {"name": "bouree book two", "bookNumber": 2, "songIndex": 5},
  "song_id_2_7": {"name": "the two grenadiers", "bookNumber": 2, "songIndex": 6},
  "song_id_2_8": {"name": "theme from witches dance", "bookNumber": 2, "songIndex": 7},
  "song_id_2_9": {"name": "gavotte from mignon", "bookNumber": 2, "songIndex": 8},
  "song_id_2_10": {"name": "lully gavotte", "bookNumber": 2, "songIndex": 9},
  "song_id_2_11": {"name": "minuet in g", "bookNumber": 2, "songIndex": 10},
  "song_id_2_12": {"name": "boccherini minuet", "bookNumber": 2, "songIndex": 11},
  "song_id_3_1": {"name": "martini gavotte", "bookNumber": 3, "songIndex": 0},
  "song_id_3_2": {"name": "bach minuet", "bookNumber": 3, "songIndex": 1},
  "song_id_3_3": {"name": "gavotte in g minor", "bookNumber": 3, "songIndex": 2},
  "song_id_3_4": {"name": "humoresque", "bookNumber": 3, "songIndex": 3},
  "song_id_3_5": {"name": "becker gavotte", "bookNumber": 3, "songIndex": 4},
  "song_id_3_6": {"name": "gavotte in d major", "bookNumber": 3, "songIndex": 5},
  "song_id_3_7": {"name": "bouree book three", "bookNumber": 3, "songIndex": 6},
  "song_id_4_1": {"name": "concerto number two, movement three", "bookNumber": 4, "songIndex": 0},
  "song_id_4_2": {"name": "concerto number five, movement one", "bookNumber": 4, "songIndex": 1},
  "song_id_4_2": {"name": "concerto number five, movement three", "bookNumber": 4, "songIndex": 2}
};

// const states = {
//   GETBOOKMODE: '_GETBOOKMODE', // User is trying to guess the number.
//   GETSONGMODE: '_GETSONGMODE'  // Prompt the user to start or restart the game.
// };

const BOOK_1_SONG_IDS = [
  "song_id_1_1",
  "song_id_1_2",
  "song_id_1_3",
  "song_id_1_4",
  "song_id_1_5",
  "song_id_1_6",
  "song_id_1_7",
  "song_id_1_8",
  "song_id_1_9",
  "song_id_1_10",
  "song_id_1_11",
  "song_id_1_12",
  "song_id_1_13",
  "song_id_1_14",
  "song_id_1_15",
  "song_id_1_16",
  "song_id_1_17"
];

const BOOK_2_SONG_IDS = [
  "song_id_2_1",
  "song_id_2_2",
  "song_id_2_3",
  "song_id_2_4",
  "song_id_2_5",
  "song_id_2_6",
  "song_id_2_7",
  "song_id_2_8",
  "song_id_2_9",
  "song_id_2_10",
  "song_id_2_11",
  "song_id_2_12"
];

const BOOK_3_SONG_IDS = [
  "song_id_3_1",
  "song_id_3_2",
  "song_id_3_3",
  "song_id_3_4",
  "song_id_3_5",
  "song_id_3_6",
  "song_id_3_7"
];

const BOOK_4_SONG_IDS = [
  "song_id_4_1",
  "song_id_4_2",
  "song_id_4_3"
];

const CURRENT_SONG_ATTRIBUTE = 'currentSongId';
const LAST_REVIEW_SONG_ATTRIBUTE = 'lastReviewSongId';
const NO_SONG = 'NO_SONG';

exports.handler = function (event, context) {
  var alexa = Alexa.handler(event, context);
  alexa.appId = "amzn1.ask.skill.6d8f1a62-f99a-452a-87e5-c505a83f85d9";
  alexa.dynamoDBTableName = 'suzukiViolinUsers';
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
  'LaunchRequest': function () {
    //this.emit('RequestSongIntent');
    console.log('Launch Request');
  },
  'SessionEndedRequest': function () {
    console.log('Session ended with reason: ' + this.event.request.reason);
    if(this.event.request.error)
      console.log('Error Type: ' + this.event.request.error.type + '; Error Message: ' + this.event.request.error.message);
  },
  'AMAZON.StopIntent': function () {
    this.response.speak('Bye');
    this.emit(':responseReady');
  },
  'AMAZON.HelpIntent': function () {
    this.response.speak("You can try: 'alexa, tell suzuki violin I am playing twinkle twinkle little star'" +
    "or 'alexa, ask suzuki violin for a song to review'");
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function () {
    this.response.speak('Bye');
    this.emit(':responseReady');
  },
  'AMAZON.YesIntent': function () {
    console.log("Entering YesIntent.");
    this.response.speak('Perfect. I can now start giving you review pieces.');
    this.emit(':responseReady');
  },
  'AMAZON.NoIntent': function () {
    console.log("Entering NoIntent.");
    this.attributes[CURRENT_SONG_ATTRIBUTE] = NO_SONG;
    this.response.speak("I'm sorry. Let's try that again. Please tell me the name of your current song.");
    this.emit(':responseReady');
  },
  'RequestSongIntent': function () {

    let speechOutput = 'Before I can give you songs to review, please tell me the name of your current song.';
    this.response.speak(speechOutput).listen(speechOutput)
    this.emit(':responseReady');
  },
  'GetSongIntent': function () {
    console.log("Entering GetSongIntent.");
    if(Object.keys(this.attributes).length === 0) {
      //this.attributes['previousReviewSong'] = 0;
      //this.attributes['bookNumber'] = 0;
      console.log('Attributes have a length of zero');
    }

    console.log('Checking if attributes contains a current song');
    if(!hasSong(this.attributes)){
      console.log('No current song');
      this.emit('RequestSongIntent');
    } else {
      console.log('Has current song');
      let currentSongId = this.attributes[CURRENT_SONG_ATTRIBUTE]
      console.log('current song ID: ' + currentSongId);
      var songDetail = songIdToSongDetailsMap[currentSongId];

      var reviewSongId = findReviewPiece(songDetail);
      var reviewSongDetail = songIdToSongDetailsMap[reviewSongId];

      this.response.speak('Please play ' + reviewSongDetail.name + ", from book " + reviewSongDetail.bookNumber.toString().toLowerCase());
      this.emit(':responseReady');
    }
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
      this.attributes[CURRENT_SONG_ATTRIBUTE] = songData.id;
      speechOutput = "Great. You are playing " + songDetail.name + ", in book " + songDetail.bookNumber.toString().toLowerCase() + ". Is that correct?";
    } else {
      console.log('song name did not resolve to a defined suzuki song');
      speechOutput = "I didn't quite get that. Could you please tell me which song you are on again?";
    }

    //this.emit(':saveState', true); // Be sure to call :saveState to persist your session attributes in DynamoDB
    this.response.speak(speechOutput);
    this.emit(':responseReady');
  },
  'Unhandled': function () {
    console.log("unhandled request");
    const message = "Sorry, I didn't get that. Can you say that again?";
    this.response.speak(message).listen(message);
    this.emit(':responseReady');
  }
};

function hasSong(attributes) {

  if(attributes[CURRENT_SONG_ATTRIBUTE] && 
     attributes[CURRENT_SONG_ATTRIBUTE] != NO_SONG)
  {
    return true;
  }

  return false;

}

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

// Returns the ID of the review piece
function findReviewPiece(currentSongDetail) {
  console.log("Finding a review piece.");
  var reviewBookNumber = pickReviewBookNumber(currentSongDetail);
  let reviewBooks;

  switch (reviewBookNumber) {
    case 1:
      reviewBooks = BOOK_1_SONG_IDS;
      break;
    case 2:
      reviewBooks = BOOK_2_SONG_IDS;
      break;
    case 3:
      reviewBooks = BOOK_3_SONG_IDS;
      break;
    case 4:
      reviewBooks = BOOK_4_SONG_IDS;
      break;
    }
  
    var reviewSongIndex = getRandomInt(reviewBooks.length);
    var reviewSongId = reviewBooks[reviewSongIndex];
    //var songDetail = songIdToSongDetailsMap[reviewSongId];

    return reviewSongId;
}

function pickReviewBookNumber(currentSongDetail){
  var reviewBookNumber = 1;

  if(currentSongDetail.bookNumber <= 3 || Math.random() > 0.8)
    reviewBookNumber = pickRecentReviewBookNumber(currentSongDetail);
  else 
    reviewBookNumber = pickEarlierReviewBookNumber(currentSongDetail);

  console.log("Picked review book number " + reviewBookNumber);
  return reviewBookNumber;
}

function pickRecentReviewBookNumber(currentSongDetail){
  console.log("Picking standard review book number.");
  var usePreviousBook = false;

  if(currentSongDetail.bookNumber == 1)
    usePreviousBook = false;
  else if(currentSongDetail.songIndex <= 2)
    usePreviousBook = (Math.random() > .85) ? true : false;
  else
    usePreviousBook = (Math.random() > .4) ? true : false;
  
  var reviewBookNumber = usePreviousBook ? (currentSongDetail.bookNumber -1) : currentSongDetail.bookNumber;

  return reviewBookNumber;
}

function pickEarlierReviewBookNumber(currentBookNumber){
  console.log("Picking review book number from all previous books.");

  // a book # less than three should never be passed in, but adding the checks below just in case.
  if(currentBookNumber <= 3)
    return 1;
  
  var max = currentBookNumber - 2;
  // we don't want to go back too far...stick with books that are within 5 places of their current book.
  var min = (currentBookNumber > 6) ? currentBookNumber - 5 : 1;
  // randomly choose a number between min and max (inclusive of both)
  var reviewBookNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  return reviewBookNumber;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}