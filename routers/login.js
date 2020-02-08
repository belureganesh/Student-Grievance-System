var express=require("express");
var router=express.Router();
router.get("/login",function(req,res,next) {
    console.log(" krishna");
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add</button></form>');
});
router.post('/product',function(req,res,next){
    console.log(req.body);
    res.redirect('/data');
});
module.exports=router;