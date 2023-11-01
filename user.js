const mongoose = require("mongoose")
const express = require("express");
const bodyParser = require("body-parser");
const encrypt = require("mongoose-encryption")
const app = express();app.set('view engine', 'ejs');
const md5 = require("md5")
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb+srv://pinnukoushik1:koushik2004@koushik.jttd3u3.mongodb.net/pointstable');
const playerschema = mongoose.Schema({
    name:String,
    kills:Number,
    team :String
})

const playermodel = mongoose.model("players",playerschema)

const schema = mongoose.Schema({
   team:String,
   p1:playerschema,
   p2:playerschema,
   p3:playerschema,
   p4:playerschema,
   pos1:Number,
   pos2:Number,
   pos3:Number,
   kills:Number,
   points:Number
})
const teammodel = mongoose.model("group1", schema)
const grp2teams = mongoose.model("group2",schema)
app.get("/", async function (req, res) {
    try {
      const arr1 = await teammodel.find();
      const arr2 = await grp2teams.find();
      sorter(arr1)
      sorter(arr2)
      res.render("user", { array: arr1, array2: arr2 });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching data from the database.");
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

app.listen(4000, function (param) {  })