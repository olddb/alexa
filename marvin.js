var getRatpNextTiming = require("./ratp.js")

function noop() {}

function handler(event, context){
  console.log("befor try");
  try {
    if (event.session.new){
      console.log("reqId:", event.request.requestId, "session:", event.session);
    }
    function callback(sessionAttributes, speechletResponse) {
      context.succeed(buildResponse(sessionAttributes, speechletResponse));
    }
    console.log("next to calback");
    var options = {
      LaunchRequest: onLaunch.bind(null, event, callback),
      IntentRequest: onIntent.bind(null, event, callback),
      SessionEndedRequest: context.succeed,
    }
    console.log("yolo1");
    (options[event.request.type] || noop)();
  } catch (e) {
    context.fail("Exception: " + e);
  }
}

function onLaunch(event, callback) {
  console.log("onLaunch requestId=" + event.request.requestId+ ", sessionId=" + event.session.sessionId);
  getWelcomeResponse(callback);
}

var intents = {
  metro: getMetroInfo//,
  //bus: getBusInfo,
  //event: getEventInfo
}

function onIntent(event, callback) {
  console.log("onIntent requestId=" + event.request.requestId+ ", sessionId=" + event.session.sessionId);
  var fn = intents[event.request.intent.name];
  console.log(event.request.intent.name);
  if (typeof fn !== "function") {
    console.log("let's trow this fuking shit");
    throw "Invalid intent wesh"
  }
  console.log("befor start the event");
  fn(event.request.intent, event.session, callback);
}


function getWelcomeResponse(callback) {
  var speechOutput = "Hello, Welcom to 42, What do you want to know ?";
  // If the user either does not reply to the welcome message or says something that is not
  // understood, they will be prompted again with this text.
  var repromptText = "Please tell me what do you want to know ?";

  console.log("getWelcomRespons");
  callback({
   // If we wanted to initialize the session to have some attributes we could add those here.
  }, buildSpeechletResponse("Welcome", speechOutput, repromptText, false));
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
  return {
    outputSpeech: {
      type: "PlainText",
      text: output
    },
    card: {
      type: "Simple",
      title: "SessionSpeechlet - " + title,
      content: "SessionSpeechlet - " + output
    },
    reprompt: {
      outputSpeech: {
        type: "PlainText",
        text: repromptText
      }
    },
    shouldEndSession: shouldEndSession
  }
}

function buildResponse(sessionAttributes, speechletResponse) {
  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }
}

function getMetroInfo (intent, session, callback) {
  console.log("getMetroInfo");
  var output, rePrompt;
  sessionAttributes = { metro_station: intent.slots.station.value };
  if (intent.slots.station) {
    getRatpNextTiming("metro").then(function (data) {
      rePrompt = output = "The next metro at " + data + " is in 5 minutes";
      callback(sessionAttributes, buildSpeechletResponse(intent.name, output, rePrompt, true));
    }).catch(function (error) {
      output = "I wasn't able to communicate with the R A T P, what a surprise...";
      rePrompt = "Do you want to try again ?";
      callback(sessionAttributes, buildSpeechletResponse(intent.name, output, rePrompt, false));
    })
  } else {
    output = "I'm not sure what you asking for, please try again";
    rePrompt = "I'm not sure what you asking for, you can say, What the next metro at Porte de clichy";
    callback(sessionAttributes, buildSpeechletResponse(intent.name, output, rePrompt, true));
  }
  console.log("getMetroInfo fin");
}

module.exports = handler;