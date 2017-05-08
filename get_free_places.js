"use strict"
const path = require("path");
global.include = name => require(path.join(__dirname, name));
const api42 = include("api42");
const url = require("url");
const fs = require("fs");

var taken = {};


//////////////

function get_free_places(){
const _Cluster = create_cluster();
return api42.getAll("locations").then(data => data.map(obj => obj.host))
.then(data => _Cluster.filter(e => data.indexOf(e) === -1))
.then(data => (data.slice(0, 5)))
}

function create_cluster ()
{
	var cluster = [];
	var curr_place = "";
	var etage = 1;
	var rang = 1;
	var place = 1;

	while(etage <= 3)
	{
	while (rang <= 13)
		{
		while(place <= 23)
			{
			curr_place = "e" + etage + "r" + rang + "p" + place;
			cluster.push(curr_place);
			place++;
			curr_place="";
			}
		place = 1;
		rang++;
		}
		rang = 1;
		etage++;
	}	
	return (cluster);
}

module.exports = get_free_places;
