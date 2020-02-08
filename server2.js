var express=require("express");
var bodyParser=require("body-parser");
var path=require("path");
var mysql=require("mysql");
var nodemailer = require("nodemailer");
var app=express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

var connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'admin',
    database:'mycompany'
});
connection.connect(function(err){
    if(!err)
    {
        console.log("Database is connected ... nn");
        console.log(Date.now());
    }
    else
    {
        console.log("Error connecting database ... nn");
    }
});
app.get("/",function(req,res,next) {
    res.sendFile(__dirname + "/public/views/m_login.html");
});
/*app.post("/log",function(req,res){
    sql="select designation.desig_name,grievance_to.cell_member_mob_no FROM designation "+
        "inner join grievance_to "+
        "on designation.desig_id=grievance_to.cell_member_desig_id ";
    connection.query(sql,function(err,result){
        if(err) {
            console.log(err);
        }
        else
        {

            console.log(result);
            res.json(result);

        }});
});
app.post('/login',function(req,res){
    sql="select department.hod,grivance_type.gtype FROM department "+
         "inner join grivance_type "+
         "ON department.dept_id=grivance_type.department";
    connection.query(sql,function(err,result){
        if(err) {
            console.log(err);
        }
        else
        {

            console.log(result);
            res.json(result);

        }

    });
});*/
app.post("/submit",function(req,res,next) {
    var p_id = req.body.p_id;
    var p_name = req.body.p_name;
    var sql = "INSERT INTO product (p_idt, p_name) VALUES (p_id,p_name)";

    connection.query(sql, function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(result);
                console.log("result submitted succesfully");
            }
        }
    );
});


app.listen(9000);
console.log("Server is running on port no:9000");