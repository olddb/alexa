"use strict"

const path = require("path");

global.include = name => require(path.join(__dirname, name));

const api42 = include("api42");
const url = require("url");
const fs = require("fs");

const toDate = e => new Date(e.begin_at)

function get_event (){
api42.getAll("cursus/42/events").then(data => {
const now = new Date();
const nextEvent = data.filter(e => toDate(e) > now)
  .sort((a, b) => toDate(b) - toDate(a))[0];
return(nextEvent ? nextEvent.name + ". It begin at " + toDate(nextEvent).getHours() : "No event found... i guess you can just keep talking to me then");
});
}

module.exports = get_event;
