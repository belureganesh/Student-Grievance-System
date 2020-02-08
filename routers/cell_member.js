var express=require('express');
var router=express.Router();

router.get('/cell',function(req,res,next){
    res.sendFile(path.join(__dirname,"../","views","homepage2.html"));
});
module.exports=router;
