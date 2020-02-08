var express=require("express");
var mysql=require("mysql");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var dateFormat = require('dateformat');
var dateTime = require('node-datetime');
var bodyParser =require("body-parser");
var multer  = require('multer');
var fs = require('fs');
var nodemailer = require('nodemailer');
var moment = require("moment");


var app=express();

var dt = dateTime.create();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.use(session({
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true,
    resave: true,
    saveUninitialized: true
}));

app.use(function(req, res, next) {

    if (req.session && req.session.user) {
        var sql = "select * from login where user_id="+req.session.user.user_id+";";
        connection.query(sql, function(err, user) {
            if (user) {
                req.user = user[0];
                delete req.user.password; // delete the password from the session
                req.session.user = user[0];  //refresh the session value
                res.locals.user = user[0];
            }
            // finishing processing the middleware and run the route
            next();
        });
    } else {
        next();
    }
});


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname+'/public/upload/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname+ '-' + Date.now()+'.pdf')
    }
});
var upload = multer({ storage: storage });


var connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'mypass',
    database:'student_gs'
});

connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log("Error connecting database ... nn"+err);
    }
});


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ganeshbelure123@gmail.com',
        pass: '7798713140'
    }
});


function calculateDays(startDate,endDate)
{
    var start_date = moment(startDate, 'YYYY-MM-DD HH:mm:ss');
    var end_date = moment(endDate, 'YYYY-MM-DD HH:mm:ss');
    var duration = moment.duration(end_date.diff(start_date));
    var days = duration;
    return days;
}

function sendmail(to,subject,text){

    var mailOptions = {
        from: 'ganeshbelure123@gmail.com',
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

//------------------------------------Main code--------------------------------------------------------------------------------------


app.get("/",function(req,res){
    res.sendFile(__dirname + '/public/views/LoginRegistrationForm.html');
});




app.post("/registration", function (req, res) {

    console.log(req.body);


   var fname = req.body.fname;
   var DOB = req.body.DOB;
   var Mobile_No=req.body.Mobile_No;
   var Branch = req.body.Branch;
   var year = req.body.year;
   var mail = req.body.mail;
   var  userId = req.body.userId;
   var password = req.body.password;
   var confirm_password = req.body.confirm_password;
   var dob= dateFormat(DOB, "isoDate");
    var sql1 =  "select user_id from login where user_id="+userId+";";

    connection.query(sql1, function (err, result) {
        if (err){
            console.log(err);
        }
        var numrow=result.length;
        if(numrow==0){

            var sql = "INSERT INTO grievance_by (std_id, std_name, dob, std_dept_id, std_year, std_email_id, mobile_no) VALUES ?";
            var values = [
                [userId, fname, dob, Branch, year, mail, Mobile_No]
            ];
            connection.query(sql, [values], function (err, result) {
                if (err){
                    console.log(err);
                }
                console.log(result.affectedRows + " record(s) updated2");
            });
            var sql = "INSERT INTO login (user_id, pass,user_type) VALUES ?";
            var values = [

                [userId, password,'Student']
            ];
            connection.query(sql, [values], function (err, result) {
                if (err){
                    console.log(err);
                }
                console.log(result.affectedRows + " record(s) updated3");

                var subject="Regarding Registration";
                var text="Dear, "+fname+"\n" +
                    "You have successfully registered for Student Grievance System \n" +
                    "Thank You!";

                sendmail(mail,subject,text);

                res.send("Registerd successfully...please login using Your Roll Number");
            });
        }
        else{
            console.log("invalid userid");
            res.send("invalid userid");
        }
    });

});

app.get('/redirect_to_login', function(req, res, next) {

    res.redirect("/");

});


app.post('/login', function(req, res, next) {

    //console.log(req.body);
    var sql = "select * from login where user_id="+req.body.uname+";";
    connection.query(sql, function (err, user) {
        if (err){
            console.log(err.code);
            res.redirect('/');
        }
        if (!user[0]) {
           // res.send('invalid credential');
            res.redirect('/');
            //console.log("ggg");
        } else {
            if (req.body.pass == user[0].pass && req.body.user_type == user[0].user_type) {
                // sets a cookie with the user's info
                req.session.user = user[0];
                //console.log("hhh");
                if(user[0].user_type=='Admin'){
                    res.redirect('/ADMIN');
                }
                if(user[0].user_type=='Cell Member'){
                    res.redirect('/CELL_MEMBER');
                }
                if(user[0].user_type=='Student'){
                    res.redirect('/dashboard');
                }

            } else {
                //console.log("kkk");
                //res.send('invalid credential');
                res.redirect('/');
            }
        }
        console.log(" login successful");
    });
});

function requireLogin (req, res, next) {
    if (!req.user) {
        res.redirect('/');
    } else {
        next();
    }
};

var user_name;

app.post('/login1', function(req, res, next) {
    sql1="SELECT user_id,pass FROM login ";
    connection.query(sql1, function (err, result) {
        if (err){
            console.log(err);
            console.log(result);

        }
        //console.log(result);
        res.json(result);

    });

});

app.get('/dashboard', requireLogin, function(req, res) {

    var sql = "SELECT std_name FROM grievance_by WHERE std_id="+req.session.user.user_id;
    connection.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        }

        user_name=result[0].std_name;
    });

    res.sendFile(__dirname + '/public' + '/views/student_interface.html');
});

app.get('/CELL_MEMBER', requireLogin, function(req, res) {

    var sql = "SELECT cell_member_name FROM grievance_to WHERE cell_member_id="+req.session.user.user_id;
    connection.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        }

        user_name=result[0].cell_member_name;
    });

    res.sendFile(__dirname + '/public' + '/views/cell_member_interface.html');
});

app.get('/ADMIN', requireLogin, function(req, res) {

    var sql = "SELECT cell_member_name FROM grievance_to WHERE cell_member_id="+req.session.user.user_id;
    connection.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        }

        user_name=result[0].cell_member_name;
    });

    res.sendFile(__dirname + '/public' + '/views/admin_interface.html');
});


app.post("/session_data", function(req, res) {

    res.send(user_name);

});




app.post("/cdata", function(req, res) {

    var sql = "select dept_name from department WHERE dept_id!=9 AND dept_id!=10 AND dept_id!=14";
    connection.query(sql, function (err, result) {
        if (err){
            console.log(err);
        }
            //console.log(result);
            res.json(result);

    });
});





app.post("/G_dept_data", function(req, res){

    var dept_name = req.body.dept_name;

    var sql1 = "SELECT gtype " +
        "FROM grivance_type " +
        "WHERE department IN (SELECT dept_id FROM department where dept_name='"+dept_name+"');";

    var sql2="SELECT A.cell_member_name,B.desig_name " +
        "FROM grievance_to AS A,designation AS B " +
        "WHERE cell_member_dept_id IN (SELECT dept_id FROM department where dept_name='"+dept_name+"') " +
        "AND A.cell_member_desig_id=B.desig_id";

    connection.query(sql1, function (err, result1) {
        if (err){
            console.log(err);
        }
        //console.log(result);
        connection.query(sql2, function (err, result2) {
            if (err){
                console.log(err);
            }
            //console.log(result);
            var total=[];
            total.push(result1);
            total.push(result2);
            total.push(dept_name);

            //console.log(total);
            res.json(total);

        });

    });
});


app.post('/multer', upload.single('file'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    const file = req.file;
    var link=req.file.filename;

    //console.log(file);
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }
    var file_upload_detail=[{status:"file uploaded",
        link_url:'upload/'+link,
        filename:link
    }];
    res.json(file_upload_detail);

});

app.post("/compose_file_delete", function(req, res) {

    var filename=req.body.filename;

    fs.unlink(__dirname+'/public/upload/'+filename,function(err){
        if(err) return console.log(err);
        console.log('file deleted successfully');
        res.send('file deleted successfully');
    });

});



app.post("/compose", function(req, res) {

    var cell_authority = req.body.cell_authority;
    var cell_name = req.body.cell_name;
    var G_department = req.body.G_department;
    var G_type = req.body.G_type;
    var G_Rto_name = req.body.G_Rto_name;
    var G_description = req.body.G_description;
    var gri_to_id;
    var G_type_id;
    var G_detail_id;
    var G_doc=req.body.G_doc;
    var gri_date = dt.format('Y-m-d');


    var sql1="SELECT cell_member_id FROM grievance_to " +
        "WHERE cell_member_name='"+cell_name+"' " +
        "AND cell_member_dept_id IN (SELECT dept_id FROM department WHERE dept_name='"+G_department+"') " +
        "AND cell_member_desig_id IN (SELECT desig_id FROM designation WHERE desig_name='"+cell_authority+"');";

    connection.query(sql1, function (err, result1) {
        if (err){
            console.log(err);
        }
        else{
        //console.log(result1);
        gri_to_id=result1[0].cell_member_id;
        }




    var sql2="SELECT grivance_type_id FROM grivance_type WHERE gtype='"+G_type+"'";

    connection.query(sql2, function (err, result2) {
        if (err){
            console.log(err);
        }
        console.log(result2);
        G_type_id=result2[0].grivance_type_id;




    var gri_by_id = req.session.user.user_id;

    var values1 = [
        [gri_date, G_type_id, G_description, G_doc, G_Rto_name, 'Pending', gri_to_id, gri_by_id, gri_to_id]
    ];

    console.log(values1);

    var sql3="INSERT INTO grievance_details (grievance_date, grievance_type, grievance_desc, grievance_files, grievance_related_to, grievance_status, apply_to, grievance_by_id, gri_holder) VALUES ?";

    connection.query(sql3, [values1], function (err, result3) {
        if (err){
            console.log(err);
        }
        console.log(result3.affectedRows + " record(s) grievance reported");


    var sql4="SELECT grievance_details_id FROM grievance_details " +
        "WHERE grievance_date='"+gri_date+"' " +
        "AND grievance_type="+G_type_id+" " +
        "AND grievance_desc='"+G_description+"' " +
        "AND grievance_related_to='"+G_Rto_name+"' " +
        "AND apply_to="+gri_to_id+" " +
        "AND grievance_by_id="+gri_by_id;

    connection.query(sql4, function (err, result4) {
        if (err){
            console.log(err);
        }
        console.log(result4);
        G_detail_id=result4[0].grievance_details_id;


    var values2 = [
        [gri_date, gri_to_id, G_detail_id]
    ];

    var sql5="INSERT INTO grievance (grievance_u_date, grievance_holder, grievance_details_id) VALUES ?";
    connection.query(sql5, [values2], function (err, result5) {
        if (err){
            console.log(err);
        }
        console.log(result5.affectedRows + " record(s) grievance recorded");



        /*var query="SELECT A.cell_member_email_id,B.std_email_id " +
            "FROM grievance_to AS A,grievance_by AS B " +
            "WHERE A.cell_member_id="+gri_to_id + " " +
            "AND B.std_id="+gri_by_id;


        connection.query(query, function (err, mail) {
            if (err){
                console.log(err);
            }


        var to=mail[0];
        var subject="Regarding grievance";
        var text="Dear, "+std_name+"\n" +
            "You have successfully registered for Student Grievance System \n" +
            "Thank You!";

        sendmail(to,subject,text);


        var to=mail[1];
        var subject="Regarding Registration";
        var text="Dear, "+std_name+"\n" +
            "You have successfully registered for Student Grievance System \n" +
            "Thank You!";

        sendmail(to,subject,text);

        });*/



        res.send("Your grievance is succesfully recorded!");


    });
    });
    });
    });
    });
});



app.post("/other", function(req, res){

    var cell_authority = req.body.cell_authority;
    var cell_name = req.body.cell_name;
    var G_department = req.body.G_department;
    var G_type = req.body.Gri_type;
    var G_Rto_name = req.body.G_Rto_name;
    var G_description = req.body.G_description;
    var gri_to_id;
    var G_type_id;
    var G_detail_id;
    var G_doc=req.body.G_doc;
    var gri_date = dt.format('Y-m-d');

    var sql1="SELECT cell_member_id FROM grievance_to " +
        "WHERE cell_member_name='"+cell_name+"' " +
        "AND cell_member_desig_id IN (SELECT desig_id FROM designation WHERE desig_name='"+cell_authority+"');";

    connection.query(sql1, function (err, result1) {
        if (err){
            console.log(err);
        }
        else{
            //console.log(result1);
            gri_to_id=result1[0].cell_member_id;
        }



            var gri_by_id = req.session.user.user_id;

            var values1 = [
                [gri_date, G_type, G_description, G_doc, G_Rto_name, 'Pending', gri_to_id, gri_by_id, gri_to_id]
            ];

            console.log(values1);

            var sql3="INSERT INTO pri_grievance_table (grievance_date, grievance_type, grievance_desc, grievance_files, grievance_related_to, grievance_status, apply_to, grievance_by_id, gri_holder) VALUES ?";

            connection.query(sql3, [values1], function (err, result3) {
                if (err){
                    console.log(err);
                }
                console.log(result3.affectedRows + " record(s) grievance reported");
                console.log(result3.insertId);
                res.send("Your grievance is succesfully recorded!");

            });
        });

});







app.post("/status_table", function(req, res){

    var gri_by_id = req.session.user.user_id;

    var sql = "SELECT A.grievance_details_id, C.cell_member_name, A.grievance_date, A.grievance_status " +
        "FROM grievance_details AS A, grievance AS B, grievance_to AS C " +
        "WHERE A.grievance_details_id=B.grievance_details_id " +
        "AND A.apply_to=C.cell_member_id " +
        "AND B.grievance_id IN (SELECT MAX(grievance_id) FROM grievance WHERE grievance_details_id=A.grievance_details_id) " +
        "AND A.grievance_status != 'Resolved' " +
        "AND A.grievance_by_id="+gri_by_id;

    connection.query(sql, function (err, result) {
        if (err){
            console.log(err);
        }
        //console.log(result);
        res.json(result);

    });
});

app.post("/gri_detail", function(req, res) {

    var gri_detail_id = req.body.g_id;

    var sql = "SELECT A.grievance_files,C.cell_member_name AS cell_member_name, D.gtype AS gtype, A.grievance_related_to AS grievance_related_to, A.grievance_desc AS grievance_desc,A.grievance_status " +
        "FROM grievance_details AS A, grievance_to AS C, grivance_type AS D " +
        "WHERE C.cell_member_id=A.apply_to " +
        "AND D.grivance_type_id=A.grievance_type " +
        "AND A.grievance_details_id=" + gri_detail_id;

    connection.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        }
        //console.log(result);

        var sql1 = "SELECT COUNT(resp_id) AS count FROM student_gs.resp_to_grievance " +
            "WHERE grievance_id=" + gri_detail_id;

        connection.query(sql1, function (err, result1) {
            if (err) {
                console.log(err);
            }

            var total = [];
            total.push(result);
            total.push(result1);
            res.json(total);

        });
    });

});



app.post("/reps_detail_to_student",function(req,res,next){

    var gri_detail_id = req.body.g_id;

    var sql="SELECT A.resp_text, A.resp_evidence, B.cell_member_name,A.resp_date " +
        "FROM resp_to_grievance AS A, grievance_to AS B " +
        "WHERE grievance_id=" + gri_detail_id +  " " +
        "AND A.resp_by=B.cell_member_id " +
        "ORDER BY resp_date DESC";

    connection.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        }

        res.json(result);

    });

});





app.get('/logout', function(req, res, next) {

    if (req.session) {

        // delete session object
        req.session.destroy(function(err) {
            if(err) {
                 console.log(err);
            } else {
                console.log("successfully logout");
                res.redirect('/');
            }
        });
    }
});


app.post("/student_edit_prof",function(req,res,next){

    var stu_id = req.session.user.user_id;

    sql1="select A.std_id,A.std_name,A.dob,B.dept_name,B.dept_id,A.mobile_no,A.std_year,A.std_email_id,C.pass "+
        "from grievance_by as A,department as B,login as C "+
        "where A.std_dept_id=B.dept_id "+
        "and C.user_id=A.std_id "+
        "and A.std_id="+stu_id;


    connection.query(sql1,function(err,result1)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            sql2="SELECT dept_name,dept_id FROM department WHERE dept_id <= 8";

            connection.query(sql2,function(err,result2)
            {
                if(err)
                {
                    console.log("err");
                }
                else
                {

                    var total = [];
                    total.push(result1);
                    total.push(result2);
                    res.json(total);
                }
            });

        }
    });
});



app.post("/user_id",function(req,res,next){
    var stu_name=req.body.fName;
    sql="select std_name "+
        "from grievance_by as A,login as B "+
        "where B.user_id="+stu_name;
    connection.query(sql,function(err,result)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log("Yuu are......");
            res.json(result);
        }
    });
});


app.post("/resolve",function(req,res,next){

    var gri_id=req.body.data;

    var sql="UPDATE grievance_details SET grievance_status = 'Resolved' " +
        "WHERE (grievance_details_id = "+gri_id+")";

    connection.query(sql,function(err,result)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.send("problem is resolved");
        }
    });
});




app.post("/resolved_grievance",function(req,res,next){

    var stu_id = req.session.user.user_id;

    var sql="SELECT A.grievance_details_id,C.cell_member_name,B.gtype,D.grievance_u_date " +
        "FROM grievance_details AS A,grivance_type AS B,grievance_to AS C,grievance AS D " +
        "WHERE B.grivance_type_id=A.grievance_type " +
        "AND C.cell_member_id=A.apply_to " +
        "AND D.grievance_details_id=A.grievance_details_id " +
        "AND A.grievance_status = 'Resolved' " +
        "AND D.grievance_id IN (SELECT MAX(grievance_id) FROM grievance WHERE grievance_details_id=A.grievance_details_id) " +
        "AND A.gri_holder="+stu_id;

    connection.query(sql,function(err,result)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log("Yuu are......");
            res.json(result);
        }
    });


});






//Cell Member start---------------------------------------------------------------------------------------




app.post('/cell_view_table',function(req,res,next){
    //console.log(req.body);

    var gri_by_id = req.session.user.user_id;

    var sql = "SELECT A.grievance_details_id, A.grievance_u_date, C.gtype, B.grievance_related_to " +
        "FROM grievance AS A,grievance_details AS B,grivance_type AS C " +
        "WHERE B.grievance_status='Pending' " +
        "AND A.grievance_id IN (SELECT MAX(grievance_id) FROM grievance WHERE grievance_details_id=B.grievance_details_id)" +
        "AND B.grievance_type=C.grivance_type_id " +
        "AND A.grievance_details_id=B.grievance_details_id " +
        "AND B.gri_holder=" + gri_by_id;

    connection.query(sql, function (err, result) {
        if (err){
            console.log(err);
        }
        //console.log(result);
        res.json(result);

    });

});
app.post("/cell_replied_gr",function(req,res)
{
    var cell_member_id = req.session.user.user_id;

    sql="SELECT  C.grievance_details_id,B.gtype,A.grievance_u_date,C.grievance_status "+
        "FROM grievance as A,grivance_type as B,grievance_details AS C,resp_to_grievance AS D " +
        "WHERE C.grievance_details_id=D.grievance_id " +
        "AND C.grievance_type=B.grivance_type_id " +
        "AND A.grievance_id IN (SELECT MAX(grievance_id) FROM grievance WHERE grievance_details_id=C.grievance_details_id)" +
        "AND A.grievance_details_id=C.grievance_details_id " +
        "AND C.grievance_status!='Pending' " +
        "AND D.resp_by="+cell_member_id;
    connection.query(sql,function(err,result)
    {
        if(err)
        {
            console.log("err");
        }
        else
        {
            console.log("sent");
            console.log(result);
            res.json(result);
        }
    });
});

app.post("/cell_reply",function(req,res,next){

    var gri_id = req.body.g_id;

    sql="SELECT  A.grievance_related_to,B.std_name,A.grievance_desc,B.std_id " +
        "FROM grievance_details as A,grievance_by as B " +
        "WHERE A.grievance_details_id=" + gri_id + " " +
        "AND A.grievance_by_id=B.std_id";

    connection.query(sql,function(err,result)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            //console.log(result);
            res.json(result);
        }
    });
});


app.post("/cell_member_edit_view",function(req,res,next){

    var cell_member_id = req.session.user.user_id;

    sql1="SELECT A.cell_member_id,A.cell_member_name,C.dept_id,C.dept_name,B.desig_name,A.cell_member_email_id,A.cell_member_mob_no,D.pass " +
    "FROM grievance_to AS A,designation AS B,department AS C,login AS D " +
    "WHERE A.cell_member_dept_id=C.dept_id " +
    "AND A.cell_member_desig_id=B.desig_id " +
    "AND A.cell_member_id=D.user_id " +
    "AND A.cell_member_id="+cell_member_id;

    connection.query(sql1,function(err,result1)
    {
        if(err)
        {
            console.log("err");
        }
        else
        {

            sql2="SELECT dept_name,dept_id FROM department";

            connection.query(sql2,function(err,result2)
            {
                if(err)
                {
                    console.log("err");
                }
                else
                {

                    var total = [];
                    total.push(result1);
                    total.push(result2);
                    res.json(total);
                }
            });

        }
    });
});
app.post("/cell_dept_name",function(req,res,next){

    var cell_member_id = req.session.user.user_id;


});


app.post("/cell_member_prof_edit",function(req,res,next){

    var user_id = req.session.user.user_id;
    var cell_member_name=req.body.cell_member_name,
    desig_id=req.body.desig_id,
    dept_id=req.body.dept_id,
    cell_member_mob_no=req.body.cell_member_mob_no,
    cell_member_email_id=req.body.cell_member_email_id,
    cell_member_pass=req.body.cell_member_pass;

var value=[[
    cell_member_name,dept_name,cell_member_email_id,cell_member_mob_no,desig_name
]];


    sql1="UPDATE grievance_to " +
        "SET cell_member_name = ?, cell_member_email_id = ?, cell_member_dept_id = ?, " +
        "cell_member_email_id = ?, cell_member_mob_no = ?, cell_member_desig_id = ? " +
        "WHERE cell_member_id = "+user_id;

    sql2="UPDATE login SET pass = "+cell_member_pass+" WHERE user_id ="+user_id;

    connection.query(sql,function(err,result1)
    {
        if(err)
        {
            console.log("err");
        }
        else
        {

            connection.query(sql2,function(err,result2)
            {
                if(err)
                {
                    console.log("err");
                }
                else
                {
                    res.send("profile is Successfully updated");

                }
            });

        }
    });

});



app.post('/cell_file_upload', upload.single('file'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    const file = req.file;
    var link=req.file.filename;

    //console.log(file);
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }
    var file_upload_detail=[{status:"file uploaded",
        link_url:'upload/'+link}];
    res.json(file_upload_detail);

});

app.post("/reply_to_grievance",function(req,res,next) {

    var cell_desc=req.body.desc,
        doc_url=req.body.file_url,
        gri_id=req.body.gri_id,
        stu_id=req.body.stu_id;
    var cell_member_id = req.session.user.user_id;
    var rep_date = dt.format('Y-m-d');

    var sql="INSERT INTO `resp_to_grievance` " +
        "(`resp_by`, `grievance_id`, `resp_date`, `resp_text`, `resp_evidence`) VALUES ?";

    var values=[[cell_member_id, gri_id, rep_date, cell_desc, doc_url]];

    connection.query(sql, [values], function (err, result) {
        if (err){
            console.log(err);
        }
        console.log(result.affectedRows + " record(s) grievance recorded");
    });

    var sql1="UPDATE grievance_details SET grievance_status = 'Responded',gri_holder="+stu_id+" " +
        "WHERE (grievance_details_id = "+gri_id+")";

    connection.query(sql1, function (err, result1) {
        if (err){
            console.log(err);
        }



        var query="SELECT B.std_name,B.std_email_id " +
            "FROM grievance_details AS A,grievance_by AS B " +
            "WHERE A.grievance_details_id="+gri_id + " " +
            "AND B.std_id=A.grievance_by_id";


        connection.query(query, function (err, mail) {
            if (err){
                console.log(err);
            }


            var to=mail[0].std_email_id;
            var subject="Regarding grievance response";
            var text="Dear, "+mail[0].std_name+"\n" +
                "This mail is to inform you that you have a response for your grievance with id no."+gri_id+"\n" +
                "Thank You!";

            sendmail(to,subject,text);


        });

        console.log("status updated to responded");

    });


});



//Cell Member end----------------------------------------------------------------------------------------
//admin start----------------------------------------------------------------------------------------

app.post("/admin_view_table",function(req,res){
    var sql="SELECT A.grievance_details_id,A.grievance_date,B.gtype,A.grievance_status,C.std_name,D.cell_member_name " +
        "FROM grievance_details AS A,grivance_type AS B,grievance_by AS C,grievance_to AS D " +
        "WHERE A.grievance_type=B.grivance_type_id " +
        "AND A.grievance_by_id=C.std_id " +
        "AND A.apply_to=D.cell_member_id";

    connection.query(sql, function (err, result) {
        if (err){
            console.log(err);
        }
        console.log(result);
        res.json(result);

    });
});


app.post("/admin_assign_view_table",function(req,res){
    var sql="SELECT A.grievance_details_id,A.grievance_date,A.grievance_type,A.grievance_related_to,C.std_name,D.cell_member_name " +
        "FROM pri_grievance_table AS A,grievance_by AS C,grievance_to AS D " +
        "WHERE A.grievance_by_id=C.std_id " +
        "AND A.apply_to=D.cell_member_id";

    connection.query(sql, function (err, result) {
        if (err){
            console.log(err);
        }
        console.log(result);
        res.json(result);

    });
});


app.post("/admin_view_dept_design_name",function(req,res){

    var sql1 = "select dept_id,dept_name from department WHERE dept_id!=9 AND dept_id!=10";

    var sql2 = "SELECT desig_id,desig_name FROM designation";
    connection.query(sql1, function (err, result1) {
        if (err){
            console.log(err);
        }
        //console.log(result);
        connection.query(sql2, function (err, result2) {
            if (err){
                console.log(err);
            }
            //console.log(result);
            var total=[];
            total.push(result1);
            total.push(result2);
            res.json(total);

        });
    });
});



app.post("/add_cell_member",function(req,res){


    var cell_id=req.body.cell_id,
        cell_name=req.body.cell_name,
        desig_id=req.body.desig_id,
        dept_id=req.body.dept_id,
        contact=req.body.contact,
        E_mail=req.body.E_mail,
        pass=req.body.pass;


    var sql1="INSERT INTO grievance_to (cell_member_id, cell_member_name, cell_member_dept_id, cell_member_email_id, cell_member_mob_no, cell_member_desig_id) VALUES ?";
    var values1=[[
        cell_id,cell_name,dept_id,E_mail,contact,desig_id
    ]];

    var sql2="INSERT INTO login (user_id, pass, user_type) VALUES ?";
    var values2=[[
        cell_id,pass,'Cell Member'
    ]];

    connection.query(sql1, [values1], function (err, result1) {
        if (err){
            console.log(err);
        }
        console.log(result1.affectedRows + " cell member added successfully");


    connection.query(sql2, [values2], function (err, result2) {
        if (err){
            console.log(err);
        }
        console.log(result2.affectedRows + " cell member added to login table");
        res.send("Cell Member Added successfully")


    });
    });
});


app.post("/admin_view_cell_member",function(req,res){


    var sql="SELECT A.cell_member_id,A.cell_member_name,C.desig_name,B.dept_name,A.cell_member_email_id,A.cell_member_mob_no " +
        "FROM grievance_to AS A,department AS B,designation AS C " +
        "WHERE A.cell_member_dept_id=B.dept_id " +
        "AND A.cell_member_desig_id=C.desig_id";

    connection.query(sql, function (err, result) {
        if (err){
            console.log(err);
        }
        console.log(result);
        res.json(result);

    });
});

app.post("/admin_edit_view",function(req,res){
    sql="";

    connection.query(sql1, function (err, result) {
        if (err){
            console.log(err);
        }

        console.log("status updated to responded");

    });
});
app.post("/admin_view_stu_gr",function(req,res){
    sql="select A.cell_member_name,B.grievance_related_to,C.std_name,B.grievance_desc "+
        "from grievance_to as A,grievance_details as B,grievance_by as C "+
        "where C.std_id=B.grievance_by_id "+
        "and A.cell_member_id=B.apply_to ";

    connection.query(sql, function (err, result) {
        if (err){
            console.log(err);
        }
       else
        {
            res.json(result);
            console.log(result);
        }
    });
});
app.post("/admin_assign_gr_view",function(req,res){

console.log(req.body.gri_id);

    sql="select A.cell_member_name,B.grievance_related_to,C.std_name,B.grievance_desc,B.grievance_type "+
        "from grievance_to as A,pri_grievance_table as B,grievance_by as C "+
        "where C.std_id=B.grievance_by_id "+
        "and A.cell_member_id=B.apply_to "+
        "AND B.grievance_details_id="+req.body.gri_id;

    connection.query(sql, function (err, result) {
        if (err){
            console.log(err);
        }
        else
        {
            res.json(result);
            console.log(result);
        }
    });
});





app.post("/assign",function(req,res){


    var sql1="SELECT cell_member_dept_id FROM grievance_to AS A,pri_grievance_table AS B " +
        "WHERE B.apply_to=A.cell_member_id " +
        "AND B.grievance_details_id="+req.body.gri_id;

    connection.query(sql1, function (err, result1) {
        if (err){
            console.log(err);
        }
        else
        {

            var sql2="SELECT * FROM pri_grievance_table " +
                "WHERE grievance_details_id="+req.body.gri_id;

            connection.query(sql2, function (err, result2) {
                if (err){
                    console.log(err);
                }
                else
                {
                var sql3="INSERT INTO grivance_type (gtype,department) VALUES ?";
                var values1=[[
                    result2[0].grievance_type,result1[0].cell_member_dept_id
                ]];

                    connection.query(sql3,[values1], function (err, result3) {
                        if (err){
                            console.log(err);
                        }
                        else
                        {
                            //console.log(result3);
                            var type_id = result3.insertId;

                        var sql4="INSERT INTO grievance_details (grievance_date, grievance_type, grievance_desc, grievance_files, grievance_related_to, grievance_status, apply_to, grievance_by_id, gri_holder) VALUES ?";
                        var values2=[[
                            result2[0].grievance_date,type_id,result2[0].grievance_desc,result2[0].grievance_files,result2[0].grievance_related_to,result2[0].grievance_status,result2[0].apply_to,result2[0].grievance_by_id,result2[0].gri_holder
                        ]];

                            connection.query(sql4,[values2], function (err, result4) {
                                if (err){
                                    console.log(err);
                                }
                                else
                                {
                                    var id_for_gri=result4.insertId;
                                    var sql6="INSERT INTO `student_gs`.`grievance` (`grievance_u_date`, `grievance_holder`, `grievance_details_id`) VALUES ?";

                                    values6=[[
                                        result2[0].grievance_date,result2[0].gri_holder,id_for_gri
                                    ]];


                                    connection.query(sql6,[values6],function (err, result5) {
                                        if (err){
                                            console.log(err);
                                        }
                                        else
                                        {


                                    var sql5="DELETE FROM `student_gs`.`pri_grievance_table` WHERE (`grievance_details_id` = "+req.body.gri_id+");"

                                    connection.query(sql5,function (err, result5) {
                                        if (err){
                                            console.log(err);
                                        }
                                        else
                                        {

                                            console.log("Successfully assigned");
                                            res.send("Successfully assigned");
                                        }
                                    });

                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });




});


app.post("/reject",function(req,res){



    var sql5="DELETE FROM `student_gs`.`pri_grievance_table` WHERE (`grievance_details_id` = "+req.body.gri_id+");"

    connection.query(sql5,function (err, result5) {
        if (err) {
            console.log(err);
        }
        else {
            res.send("Grievance is successfully Removed");
        }

    });
});













/*var myInt = setInterval(function () {
    console.log("Hello");
}, 2000);
*/

/*var sql = "SELECT B.grievance_u_date,A.grievance_details_id " +
    "FROM grievance_details AS A,grievance AS B " +
    "WHERE grievance_id IN (SELECT MAX(grievance_id) FROM grievance WHERE grievance_details_id=A.grievance_details_id);";

connection.query(sql, function (err, result) {
    if (err) console.log(err);
    console.log(result);
    var datetime = dateTime.create();
    var date_time=datetime.format('m/d/Y H:M:S');
    //console.log(date_time);

    for(var i=0;i<result.length;i++){

       var duration=calculateDays(result[i].grievance_u_date,date_time);
       console.log(duration._data.hours);


    }


});


var past = '2015-01-01 00:00:00';
var pastDateTime = dateTime.create(past);
// get the current timestamp of the past
setTimeout(function () {
    var pastNow = pastDateTime.now();
    // this would be 1420038010000
    console.log(pastNow);
    // this would be 2015-01-01 00:00:10
    console.log(new Date(1420038010000));
}, 1000);

*/
//admin end----------------------------------------------------------------------------------------

app.listen(3000);
console.log("server is listening on port  no n:3000");
