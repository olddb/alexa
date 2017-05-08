"use strict"

const path = require("path");

global.include = name => require(path.join(__dirname, name));

const api42 = include("api42");
const url = require("url");
const fs = require("fs");

api42.getAll("locations?active=true").then(data => {
  console.log(data);
});

// start the server
include("server");
