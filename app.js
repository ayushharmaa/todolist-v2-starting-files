//jshint esversion:6
 
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
 
app.set('view engine', 'ejs');
 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
 
mongoose.connect("mongodb+srv://ayushsharma9216:ayusharma14@cluster0.cqamqhj.mongodb.net/todolistDB", {useNewUrlParser: true});
 
//Created Schema
const itemsSchema = new mongoose.Schema({
  name: String
});
 
//Created model
const Item = mongoose.model("Item", itemsSchema);
 
//Creating items
const item1 = new Item({
  name: "Welcome to your todo list."
});
 
const item2 = new Item({
  name: "Hit + button to create a new item."
});
 
const item3 = new Item({
  name: "<-- Hit this to delete an item."
});
 
//Storing items into an array
const defaultItems = [item1, item2, item3];
 
const ListSchema = {
  name:String,
items:[itemsSchema]
}
 
const List = mongoose.model("List",ListSchema);
 
app.get("/", function(req, res) {

  Item.find({}).then(function(foundItems){
  
    if( foundItems.length ===0){


      Item.insertMany(defaultItems)
  .then(function(){
    console.log("Successfully saved into our DB.");
  })
  .catch(function(err){
    console.log(err);
  });

  res.redirect("/");

    } else{
      res.render("list", { listTitle: "Today", newListItems: foundItems });

    }

   
  })
  .catch(function(err){
    console.log(err);
  });
 

 
});
 

app.get("/:customListName",function(req,res){
 const customListName= _.capitalize(req.params.customListName);

List.findOne({name: customListName},function(err,foundList){
  if(!err){
    if(!foundList){
      const list = new List({
        name:customListName,
        items:defaultItems
       
      
      
      });
       list.save();
       res.redirect("/"+customListName);
    }else{
      console.log("Exists!");
      res.render("list", { listTitle: foundList.name, newListItems: foundList.items })
    }
  }
});


});




app.post("/", function(req, res){
 
  const itemName = req.body.newItem;
  const item = new Item({
    name:itemName
  });
  if(listName === "Today"){
    item.save();
    res.redirect("/");
  } else{
    List.findOne({
      name:listName},function(err,foundList){
        foundList.items.push(item);
        foundList.save();
        res.redirect("/"+listName);
      });
  }
  
  
  
 /* if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }*/
});
 
app.post("/delete",function(req,res){
 const checkedItemId = console.log(req,body);
 const listName = req.body.listName;
if(listName === "Today"){
  Item.findByIdAndRemove(checkedItemId,function(err){
    if(!err){
      console.log("Successfully deleted checked item.");
    
      res.redirect("/");
    }
});

}else{
List.findOneAndUpdate({name: listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
if(!err){
  res.redirect("/"+ listName);
}

});

}

});





 
app.get("/about", function(req, res){
  res.render("about");
});
 
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
 