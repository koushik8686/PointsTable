
const mongoose = require("mongoose")
const express = require("express");
const bodyParser = require("body-parser");
const app = express();app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
var items =[]
mongoose.connect('mongodb+srv://pinnukoushik1:koushik2004@koushik.jttd3u3.mongodb.net/newpointstable');

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
const teammodell = mongoose.model("registeredteams", schema)
const grp1teams=mongoose.model("grupp1", schema)


app.get("/divide", async function (req, res) { 
  await teammodell.find().then((arr)=>{
    res.render("divide",{array:arr})
  })
})
app.post("/divide", async function (req, res) {
  try {
    const arr = await teammodell.find();
    console.log(arr);
    console.log(req.body);
    for (let i = 0; i < arr.length; i++) {
      const teamId = arr[i]._id;
      const selectedGroupId = req.body['team'+i];
      console.log(selectedGroupId);
      if (selectedGroupId === "1") {
        const itemsToTransfer = await teammodell.find({ _id: teamId });
        await grp1teams.insertMany(itemsToTransfer);
        console.log(`Transfer successful to grp1 for team ${teamId}`);
      } else if (selectedGroupId === "2") {
        const itemsToTransfer = await teammodell.find({ _id: teamId });
        await grp2teams.insertMany(itemsToTransfer);
        console.log(`Transfer successful to grp2 for team ${teamId}`);
      }
      // await teammodell.deleteMany({ _id: arr[i]._id });
    }

    res.redirect('/'); // Respond with a success message or redirect as needed

  } catch (error) {
    console.error('Error transferring items:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.route("/match")
.get(function (req, res) { 
    grp1teams.find().then( arr =>{
        res.render("match", {array:arr})
    })
 })
.post(function (req, res) { 
    grp1teams.find().then( arr =>{    
       for (let i = 0; i < arr.length; i++) {
        var id =arr[i]._id
        var x=0
        var pos = Number(req.body['wins' + (i + 1)])
          if (pos==1) {
           var p= arr[i].pos1+1
           grp1teams.updateOne({_id:id},{$set :{pos1:p}})  .then(result => {
          })         
        x=10      
          }
          if (pos == 2) {
            var p= arr[i].pos2+1
            grp1teams.updateOne({_id:id},{$set :{pos2:p}})  .then(result => {
              })
             x=9     
        }     
          if (pos==3) {
            var p= arr[i].pos3+1
            grp1teams.updateOne({_id:id},{$set :{pos3:p}})  .then(result => {
              })
             x=8  
      }
      var kill = Number(req.body['kills' + (i + 1)])
      var pot = arr[i].points +kill+x
      console.log("points "+pot)
      var t = arr[i].kills+kill
      grp1teams.updateOne({_id:id},{$set :{kills:t}})  .then(result => {
    })      
    grp1teams.updateOne({_id:id},{$set :{points:pot}})  .then(result => {
    })
       }
    })
    res. redirect("/")
 })


app.get("/", function (req, res) { 
    grp1teams.find().then( arr =>{
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
        const arr = await grp1teams.find();
        for (const element of arr) {
            const id = element.id;
            await grp1teams.updateOne({ _id: id }, { $set: { pos1: 0 } });
            await grp1teams.updateOne({ _id: id }, { $set: { pos2: 0 } });
            await grp1teams.updateOne({ _id: id }, { $set: { pos3: 0 } });
            await grp1teams.updateOne({ _id: id }, { $set: { kills: 0 } });
            await grp1teams.updateOne({ _id: id }, { $set: { points: 0 } });
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
const grp2teams = mongoose.model("group2",schema)
app.get("/home2", function (req, res) { 
    grp2teams.find().then( arr =>{
        sorter(arr)
        res.render("home2", {array:arr})
    })
 })

app.get("/aa", function (req, res) { 
  teammodell.find().then((arr)=>{
    res.send(arr)
  })
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
      const arr2 = await grp1teams.find().exec();
      const combinedArray = [...arr1, ...arr2]
      res.render("qualify", { array: combinedArray });
  });
  
   app.post("/qualify", async function (req, res) { 
    const arr1 = await grp2teams.find().exec();
      const arr2 =  await grp1teams.find().exec();
      const combinedArray = [...arr1, ...arr2]

      for (let i = 0; i < combinedArray.length; i++) {
         var x=(req.body['wins' + (i + 1)])
         if (x=="on") {
          console.log(combinedArray[i].team)
          const v = new qualifiedteamsmodel({
            team:combinedArray[i].team,
            captian:combinedArray[i].captian,
            captainingamename:combinedArray[i].captainingamename,
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

