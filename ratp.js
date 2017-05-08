"use strict";

const path = require("path");
const url = require("url");
const request = require("request");

const URL_BASE = "http://www.ratp.fr/horaires/fr/ratp";
const transports = {
  metro: {
    path: "porte+de+clichy/13/",
    A: "Asnières-Gennevilliers",
    R: "Châtillon-Montrouge",
  },
  bus: {
    path: "BPC3/PC3_1045_1076",
    A: "Porte Maillot",
    R: "Porte de la Chapelle",
  },
}

function extractValue(bodyPart) {
  return bodyPart ? bodyPart.split(/<td>(.+?)<\/td>/)[1] : "unavailable";
}

function findTime(body, name) {
  return name +" "+ extractValue(body.split(name)[2]);
}

function buildUrl(key, part, dir) {
  return url.resolve(URL_BASE, path.join(key, "prochains_passages/PP", part, dir));
}

function findTraject(urlPart, key, dir) {
  return new Promise((resolve, reject) =>
    request.get(buildUrl(key, urlPart.path, dir), (err, res, body) =>
      err ? reject(err) : resolve(findTime(body, urlPart[dir]))));
}

function getNextTiming(key) {
  const urlPart = transports[key];

  if (!urlPart) {
    return new Error("No url found for key"+ key);
  }

  return Promise.all([
    findTraject(urlPart, key, "A"),
    findTraject(urlPart, key, "R"),
  ]).then(data => data.join(" and "));
};

getNextTiming("bus").then(console.log).catch(console.error);
getNextTiming("metro").then(console.log).catch(console.error);

module.exports = getNextTiming;

