(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();

var express=require("express");
const python = require('compile-run');

var app=express();

const sourcecode = 'print("Hell0 W0rld!")';


let resultPromise = python.runSource(sourcecode);
// resultPromise
//     .then(result => {
//         console.log(result);
//     })
//     .catch(err => {
//         console.log(err);
//     });


app.get('/', function(req, res){
    res.send('<h1>Ganesh</h1>');
});

app.listen(3000);
console.log("server is listening on port  no n:3000");