const express = require("express");
const bodyParser=require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const date=require(__dirname+"/date.js");
const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname +"/public"));
app.set('view engine', 'ejs');

var port = process.env.PORT || 3000;
var url = process.env.DB_URI || "mongodb://localhost:27017/moneyDB";
mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true});

const infoSchema = new mongoose.Schema({
  name:String,
  amount:Number,
  type:String,
  date:String
});

const day=date.getDate();

const Data = mongoose.model("Data",infoSchema);

 app.get('/favicon.ico', (req, res) => res.status(204));

app.get("/",function(req,res){
  res.render("home");
})

app.get("/:types",function(req,res){
  const types =(req.params.types);
  
  Data.find({type:types},function(err,result){
    if(err){
      console.log(err)
    }
    else{
      res.render(types,{details_in_ejs:result});
    }
  })
});

// app.post("/:types",function(req,res){
//   const types =(req.params.types);
  
//   Data.find({type:types},function(err,result){
//     if(err){
//       console.log(err)
//     }
//     else{
//       res.render(types,{details_in_ejs:result});
//     }
//   })
// });

app.get("/:types/add",function(req,res){
  res.render("add",{types:req.params.types});
})

app.get("/:types/edit/:id",function(req,res){
  Data.findById({_id:req.params.id},function(err,result){
    if(err){
      console.log(err)
    }
    
    res.render("edit",{types:req.params.types, result:result});
  })
})

app.get("/:types/delete/:id",function(req,res){

  const types=req.params.types;
  const id=req.params.id;

  Data.findByIdAndDelete({_id:id},function(err){
    if(err){
      console.log(err);
    }
    res.redirect("/"+types);
  })
})

app.post("/:types/edit/:id",function(req,res){
  // const crud=req.params.crud;
  const types=req.params.types;
  const id=req.params.id;
  
    Data.updateOne({_id:id},{$set:{amount:req.body.amount,name:req.body.name,date:day}},function(err){
      if(err){
        console.log(err);
      }
      else{
        res.redirect("/"+types);
      }
    })
})

app.post("/:types/add",function(req,res){
  
  const types=req.params.types;
  const p_name=req.body.name;
  const p_amount=req.body.amount;


  const details={
    name:p_name,
    amount:p_amount,
    type:types,
    date:day
  }
    Data.create(details,function(err){
      if(err){
        console.log(err);
      }
      else{
        res.redirect("/"+types);
      }
    }); 
})
    
app.listen(port,() =>{
    console.log("Server running on port 3000");
});