app.post("/cdata", function(req, res){

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