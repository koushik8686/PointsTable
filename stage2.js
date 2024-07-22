const mongoose = require("mongoose")
const express = require("express");
const bodyParser = require("body-parser");
const encrypt = require("mongoose-encryption")
const app = express();app.set('view engine', 'ejs');
const md5 = require("md5")
require('dotenv').config()
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect(process.env.URI);

const schema = mongoose.Schema({
  team:String,
  captian:String,
  captainingamename:String,
  pos1:Number,
  pos2:Number,
  pos3:Number,
  kills:Number,
  points:Number
})
const teammodel = mongoose.model("stage2", schema)
app.get("/", async function (req, res) {
    try {
      const arr1 = await teammodel.find();
      sorter(arr1)
      res.render("atage2", { array: arr1});
    } catch (error) {
      console.error(error);
    }
  });
 
  app.get("/pl", function (req, res) { 
    playermodel.find().then(arr=>{
        sorterpl(arr)
        res.render("userpl",{array:arr})
    })
   })

   function sorterpl(arrey) {
    for (let i = 0; i < arrey.length; i++) {
      for (let j = i; j < arrey.length; j++) {
        if (arrey[i].kills<arrey[j].kills) {
          var temp =arrey[i]
          arrey[i]=arrey[j]
          arrey[j]=temp
        }
      }
    }
}

 function sorter(arrey) {
    for (let i = 0; i < arrey.length; i++) {
      for (let j = i; j < arrey.length; j++) {
        if (arrey[i].points<arrey[j].points) {
          var temp =arrey[i]
          arrey[i]=arrey[j]
          arrey[j]=temp
        }
      }
    }
}

app.listen(5000, function (param) {  })