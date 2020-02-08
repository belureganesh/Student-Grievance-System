var express=require("express");
var app=express();
var path=require("path");
var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"public")));
var login=require('./routers/login.js');
var cell_member=require('./routers/cell_member.js');
var Add_grievance=require('./routers/Add_Grievance.js');
app.use(express.static(__dirname+"/public"));
app.get('/home',function(req,res,next){
    res.sendFile(path.join(__dirname+ "/" + "public/views/student_interface.html"));
});
app.use(login);
app.use(cell_member);
app.use(Add_grievance);
app.use('/',function(req,res,next){
    console.log("hare krishna");
    res.send("Page not found");
});
app.listen(8080);
console.log("server is listenning on port no:8080");