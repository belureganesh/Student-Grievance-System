var express=require("express");
var app=express();
var mongoose=require("mongoose");
var path=require("path");
/**var promise = mongoose.connect('mongodb://localhost/voice', {
    useMongoClient: true
});
var schema=new mongoose.Schema({
    username:"string",
    password:"string"
});
var user=mongoose.model("user",schema);
app.use(bodyParser);
app.use(express.methodOverride());
app.use(express.static("public"));
app.get('/login',function(req,res){
    res.sendFile(__dirname+"/views/register.html");
});
app.post("/new",function(req,res){
new user({
        username:req.body.uname,
        password:req.body.pwd
    }).save(function(err,docs){
       if(err){console.log("Data is not inserted")}
       else res.send("data inserted succesfully");
    })
});**/
app.use(express.static(__dirname+"./public"));
app.get('/about',function(req,res)
{
    res.sendFile(path.join(__dirname+"/views/Add-Grievance.html"));
});
app.listen(8000);
console.log("server is running on port no:8000");