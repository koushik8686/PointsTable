require("dotenv").config()
const mongoose = require("mongoose")
const express = require("express");
const bodyParser = require("body-parser");
const encrypt = require("mongoose-encryption")
const app = express();app.set('view engine', 'ejs');
const md5 = require("md5")
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
var items =[]
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

app.route("/insert")
.get(function (req, res) { 
    res.render("insert")
 })
.post(function (req, res) { 
    
 const pl1 = new playermodel({
    team:req.body.tname,
    name:req.body.p1name,
    kills:0
})
 const pl2 = new playermodel({
    team:req.body.tname,
    name:req.body.p2name,
    kills:0
 })
 const pl3 = new playermodel({
    team:req.body.tname,
    name:req.body.p4name,
    kills:0
 })
 const pl4 = new playermodel({
    team:req.body.tname,
    name:req.body.p5name,
    kills:0
 })
    
pl1.save()
pl2.save()
pl3.save()
pl4.save()
const team = new teammodel({
  team:req.body.tname,
  p1:pl1,
  p2:pl2,
  p3:pl3,
  p4:pl4,
  pos1:0,
  pos2:0,
  pos3:0,
  kills:0,
  points:0
})

 team.save()
    res. redirect("/")
 })

app.route("/match")
.get(function (req, res) { 
    teammodel.find().then( arr =>{
        res.render("match", {array:arr})
    })
 })
.post(function (req, res) { 
    teammodel.find().then( arr =>{    
       for (let i = 0; i < arr.length; i++) {
        var id =arr[i]._id
        var x=0
        var pos = Number(req.body['wins' + (i + 1)])
          if (pos==1) {
           var p= arr[i].pos1+1
           teammodel.updateOne({_id:id},{$set :{pos1:p}})  .then(result => {
          })         
        x=10      
          }
          if (pos == 2) {
            var p= arr[i].pos2+1
            teammodel.updateOne({_id:id},{$set :{pos2:p}})  .then(result => {
              })
             x=9     
        }     
          if (pos==3) {
            var p= arr[i].pos3+1
            teammodel.updateOne({_id:id},{$set :{pos3:p}})  .then(result => {
              })
             x=8  
      }
      var kill = Number(req.body['kills' + (i + 1)])
      var pot = arr[i].points +kill+x
      console.log("points "+pot)
      var t = arr[i].kills+kill
      teammodel.updateOne({_id:id},{$set :{kills:t}})  .then(result => {
    })      
    teammodel.updateOne({_id:id},{$set :{points:pot}})  .then(result => {
    })
       }
    })
    res. redirect("/")
 })

app.get("/playerkills", function (req, res) { 
    playermodel.find().then(arr=>{
        res.render("playerkills",{array:arr})
    })
 })
 app.post("/playerkills", function (req, res) { 
   console.log(req.body)
    playermodel.find().then(arr=>{
      for (let i = 0; i < arr.length; i++) {
        var p = arr[i].kills
        var k = Number(req.body['kills' + (i + 1)]) + p;
        var ide = arr[i]._id
        playermodel.findOneAndUpdate({ _id: ide }, { $set: { kills: k } }, { new: true })
        .then(updatedPlayer => {
            if (updatedPlayer) {
             
            } else {
                console.log('Player not found.');
            }
        })
        .catch(err => {
            console.error('Error while updating player:', err);
        });
      
    }
    })
    res.redirect("/")
  })
app.get("/players", function (req, res) { 
    playermodel.find().then(arr=>{
        sorterpl(arr)
        res.render("players",{array:arr})
    })
 })
app.get("/", function (req, res) { 
    teammodel.find().then( arr =>{
        sorter(arr)
        res.render("home", {array:arr})
    })
 })

app.listen(3000, function (req) {
 })

 app.get("/d", function (req, res) { 
    deletee()
   res.redirect("/")
  })

  async function deletee() {
    playermodel.find().then(arr=>{
        arr.forEach(element => {
           var ide= element._id
           playermodel.updateOne({ _id: ide }, { $set: { kills: 0 } })
           .then(result => {
               if (result.nModified === 1) {
                   console.log('playermodel kills updated successfully.');
               } else {
                   console.log('playermodel not found or no changes were made.');
               }
           })
           .catch(err => {
               console.error('Error while updating player:', err);
           });
        });
    })
    try {
        const arr = await teammodel.find();
        for (const element of arr) {
            const id = element.id;
            await teammodel.updateOne({ _id: id }, { $set: { pos1: 0 } });
            await teammodel.updateOne({ _id: id }, { $set: { pos2: 0 } });
            await teammodel.updateOne({ _id: id }, { $set: { pos3: 0 } });
            await teammodel.updateOne({ _id: id }, { $set: { kills: 0 } });
            await teammodel.updateOne({ _id: id }, { $set: { points: 0 } });
        }
        console.log('All updates completed.');
    } catch (error) {
        console.error('Error updating documents:', error);
    }
    try {
        const arr = await grp2teams.find();
        for (const element of arr) {
            const id = element.id;
            await grp2teams.updateOne({ _id: id }, { $set: { pos1: 0 } });
            await grp2teams.updateOne({ _id: id }, { $set: { pos2: 0 } });
            await grp2teams.updateOne({ _id: id }, { $set: { pos3: 0 } });
            await grp2teams.updateOne({ _id: id }, { $set: { kills: 0 } });
            await grp2teams.updateOne({ _id: id }, { $set: { points: 0 } });
        }
        console.log('All updates completed.');
      } catch (error) {
        console.error('Error updating documents:', error);
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
const grp2teams = mongoose.model("group2",schema)
app.get("/home2", function (req, res) { 
    grp2teams.find().then( arr =>{
        sorter(arr)
        res.render("home2", {array:arr})
    })
 })

 app.route("/insert2")
.get(function (req, res) { 
    res.render("insert2")
 })
.post(function (req, res) { 
    
 const pl1 = new playermodel({
    team:req.body.tname,
    name:req.body.p1name,
    kills:0
})
 const pl2 = new playermodel({
    team:req.body.tname,
    name:req.body.p2name,
    kills:0
 })
 const pl3 = new playermodel({
    team:req.body.tname,
    name:req.body.p4name,
    kills:0
 })
 const pl4 = new playermodel({
    team:req.body.tname,
    name:req.body.p5name,
    kills:0
 })
    
pl1.save()
pl2.save()
pl3.save()
pl4.save()
const team = new grp2teams({
  team:req.body.tname,
  p1:pl1,
  p2:pl2,
  p3:pl3,
  p4:pl4,
  pos1:0,
  pos2:0,
  pos3:0,
  kills:0,
  points:0
})
 team.save()
    res. redirect("/home2")
 })

 app.route("/match2")
 .get(function (req, res) { 
     grp2teams.find().then( arr =>{
         res.render("match2", {array:arr})
     })
  })
 .post(function (req, res) { 
     grp2teams.find().then( arr =>{    
        for (let i = 0; i < arr.length; i++) {
         var id =arr[i]._id
         var x=0
         var pos = Number(req.body['wins' + (i + 1)])
           if (pos==1) {
            var p= arr[i].pos1+1
            grp2teams.updateOne({_id:id},{$set :{pos1:p}})  .then(result => {
           })         
         x=10      
           }
           if (pos == 2) {
             var p= arr[i].pos2+1
             grp2teams.updateOne({_id:id},{$set :{pos2:p}})  .then(result => {
               })
              x=9     
         }     
           if (pos==3) {
             var p= arr[i].pos3+1
             grp2teams.updateOne({_id:id},{$set :{pos3:p}})  .then(result => {
               })
              x=8  
       }
       var kill = Number(req.body['kills' + (i + 1)])
       var pot = arr[i].points +kill+x
       console.log("points "+pot)
       var t = arr[i].kills+kill
       grp2teams.updateOne({_id:id},{$set :{kills:t}})  .then(result => {
     })      
     grp2teams.updateOne({_id:id},{$set :{points:pot}})  .then(result => {
     })
        }
     })
     res. redirect("/home2")
  })

  app.get("/qualify", async function (req, res) {
      const arr1 = await grp2teams.find().exec();
      const arr2 = await teammodel.find().exec();
      const combinedArray = [...arr1, ...arr2]
      res.render("qualify", { array: combinedArray });
  });
  
   app.post("/qualify", async function (req, res) { 
    const arr1 = await grp2teams.find().exec();
      const arr2 =  await teammodel.find().exec();
      const combinedArray = [...arr1, ...arr2]

      for (let i = 0; i < combinedArray.length; i++) {
         var x=(req.body['wins' + (i + 1)])
         if (x=="on") {
          console.log(combinedArray[i].team)
          const v = new qualifiedteamsmodel({
            team:combinedArray[i].team,
            p1:combinedArray[i].p1,
            p2:combinedArray[i].p2,
            p3:combinedArray[i].p3,
            p4:combinedArray[i].p4,
            pos1:0,
            pos2:0,
            pos3:0,
            kills:0,
            points:0
          })
          v.save()
         }
      }
    res.redirect("/")
    })
const qualifiedteamsmodel= mongoose.model("stage2", schema)
    app.get("/qualifiedteams", function (req , res) { 
      qualifiedteamsmodel.find().then( arr =>{
        sorter(arr)
        res.render("qualifidedteams", {array:arr})
    })
     })

     app.route("/stage2match")
     .get(function (req, res) { 
         qualifiedteamsmodel.find().then( arr =>{
             res.render("stage2match", {array:arr})
         })
      })
     .post(function (req, res) { 
         qualifiedteamsmodel.find().then( arr =>{    
            for (let i = 0; i < arr.length; i++) {
             var id =arr[i]._id
             var x=0
             var pos = Number(req.body['wins' + (i + 1)])
               if (pos==1) {
                var p= arr[i].pos1+1
                qualifiedteamsmodel.updateOne({_id:id},{$set :{pos1:p}})  .then(result => {
               })         
             x=10      
               }
               if (pos == 2) {
                 var p= arr[i].pos2+1
                 qualifiedteamsmodel.updateOne({_id:id},{$set :{pos2:p}})  .then(result => {
                   })
                  x=9     
             }     
               if (pos==3) {
                 var p= arr[i].pos3+1
                 qualifiedteamsmodel.updateOne({_id:id},{$set :{pos3:p}})  .then(result => {
                   })
                  x=8  
           }
           var kill = Number(req.body['kills' + (i + 1)])
           var pot = arr[i].points +kill+x
           console.log("points "+pot)
           var t = arr[i].kills+kill
           qualifiedteamsmodel.updateOne({_id:id},{$set :{kills:t}})  .then(result => {
         })      
         qualifiedteamsmodel.updateOne({_id:id},{$set :{points:pot}})  .then(result => {
         })
            }
         })
         res. redirect("/qualifiedteams")
      })