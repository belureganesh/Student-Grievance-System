var express=require("express");
var mysql=require("mysql");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var dateFormat = require('dateformat');
var dateTime = require('node-datetime');
var bodyParser =require("body-parser");

var app=express();
var dt = dateTime.create();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.get("/",function(req,res) {
    res.sendFile(__dirname + '/public' + '/views/student_interface.html');
});

var connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'admin',
    database:'student_gs'
});



connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log("Error connecting database ... nn");
    }
});


app.post("/cdata", function(req, res) {
    var sql1 = "select dept_name from department;";
    var sql2 = "select dept_name from department WHERE dept_id>8;";
    connection.query(sql1, function (err, result1) {
        if (err) throw err;
        connection.query(sql2, function (err, result2) {
            if (err) throw err;
            var total = [];
            total.push(result1);
            total.push(result2);

            console.log(total);
            res.json(total);

        });
    });
});

app.post("/cell_dept_data", function(req, res){

    var department = req.body.dept_name;

    var sql = "SELECT A.desig_name " +
        "FROM designation AS A, grievance_to AS B " +
        "WHERE B.cell_member_dept_id IN (SELECT dept_id FROM department where dept_name='"+department+"') " +
        "AND A.desig_id=B.cell_member_desig_id";

    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json(result);

    });
});

app.post("/cell_auth_data", function(req, res){

    var desig_name = req.body.desig_name;

    var sql = "SELECT B.cell_member_name " +
        "FROM designation AS A, grievance_to AS B " +
        "WHERE A.desig_name='" + desig_name +"' " +
        "AND A.desig_id=B.cell_member_desig_id;";

    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json(result);

    });
});

app.post("/G_dept_data", function(req, res){

    var dept_name = req.body.dept_name;

    var sql = "SELECT type " +
        "FROM grivance_type " +
        "WHERE department IN (SELECT dept_id FROM department where dept_name='"+dept_name+"');";

    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json(result);

    });
});

app.post("/compose", function(req, res) {

    console.log("start");
    console.log(req.body);
    var cell_department = req.body.cell_department;
    var cell_authority = req.body.cell_authority;
    var cell_name = req.body.cell_name;
    var G_department = req.body.G_department;
    var G_type = req.body.G_type;
    var G_Rto_name = req.body.G_Rto_name;
    var G_description = req.body.G_description;
    var G_doc = req.body.G_doc;
    var gri_to_id;
    var G_type_id;
    var G_detail_id;
    var gri_date = dt.format('Y/m/d');
    /*console.log(cell_department);
    console.log(cell_authority);
    console.log(cell_name);
    console.log(G_department);
    console.log(G_type);*/

});

app.listen(3000);
console.log("server is listening on port  no n:3000");
