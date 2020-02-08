var express = require('express');
var fs = require("fs");
//var multer  =   require('multer');
//var mime    =   require('mime');
var mysql = require('mysql');
var app = express();
var bodyParser =   require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname+"/public"));
var connection = mysql.createConnection({
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

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public' + '/Add-Grievance.html');
    console.log("----------------");
});

app.post("/uname", function(req, res){

var sql1 = "select dept_name from department;";
var sql2 = "select desig_name from designation;";
var sql3 = "select cell_member_name from grievance_to;";

connection.query(sql1, function (err, user1) {
    if (err) throw err;
    connection.query(sql2, function (err, user2) {
        if (err) throw err;
        connection.query(sql3, function (err, user3) {
            if (err) throw err;
            var department = user1;
            var authority = user2;
            var names = user3;
            var total = [];
            total.push(user1);
            total.push(user2);
            total.push(user3);

            console.log(total);

            res.json(total);

        });
    });

});



});

app.listen(3000);
console.log("server is listening on port  no n:3000");