const sheetdb = require('sheetdb-node');
const mongoose = require("mongoose")
mongoose.connect('mongodb+srv://pinnukoushik1:koushik2004@koushik.jttd3u3.mongodb.net/newpointstable');
const express = require("express");
// create a config file
var config = {
  address: 'yngwhb9fykoht',
  auth_login: 'pinnukoushikp@gmail.com',
  auth_password: 'dldexamgone++',
};

const registeredschema = mongoose.Schema({
  team:String,
  captian:String,
  captianingame:String,
  phone:Number,
  pos1:Number,
  pos2:Number,
  pos3:Number,
  kills:Number,
  points:Number
})

const regmodel=mongoose.model("registeredteams",registeredschema)
// Create new client
var client = sheetdb(config);
   client.read().then(function(data) {
    console.log(data);
    data=JSON.parse(data)
   data.forEach(element => {
    const a = new regmodel({
      team: element['Team Name'],
      captian:element['Captain Name'],
      captianingame:" ",
      phone:element["Phone number"],
      pos1:0,
      pos2:0,
      pos3:0,
      kills:0,
      points:0
    });
   a.save()
   });
  }, function(err){
    console.log(err);
  });
