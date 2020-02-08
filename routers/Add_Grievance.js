var express=require('express');
var path=require('path');
var router=express.Router();

router.get('/add',function(req,res,next){
    res.sendFile(path.join(__dirname,"../","views","Add-Grievance.html"));
});
router.post('/add_grievance',function(req,res,next){
    console.log(req.body);
    res.redirect('/data');
});
module.exports=router;

