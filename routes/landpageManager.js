var express = require('express');
var router = express.Router();

var request=require('request');
var async=require('async');
var fs=require('fs');

router.get('/getPackage', function(req, res, next) {
  var c1=req.query.c1;
  var c4=req.query.c4;

  var db=req.app.locals.db;

  var col_pac=db.collection('package');

  col_pac.find({app_id:c1,c4:c4}).toArray(function (err,docs) {
    var data={
      app_id:'',
      c4:'',
      android:'',
      ios:''
    };

    if(!err&&docs.length>0){
      data.app_id = docs[0].app_id;
      data.c4 = docs[0].c4;
      data.android = docs[0].android;
      data.ios = docs[0].ios;
    }else {
      return res.jsonp({
        code:1,
        status:'failed',
        data:data
      });
    }

    res.jsonp({
      code:0,
      status:'success',
      data:data
    })
  })
});

router.get('/setDefaultUrl',function (req,res,next) {
  var appid=req.query.appid;
  var domain=req.query.domain;
  var c3=req.query.c3;

  //var path='/root/public/'+domain+'/'+c3+'.html';
  var path='/public/'+domain+'/'+c3+'.html';

  var db=req.app.locals.db;

  var col_pac=db.collection('package');

  var android='';
  var ios='';
  
  async.waterfall([
    function (callback) {
      col_pac.find({app_id:appid}).limit(1).toArray(function (err,docs) {

        if(!err&&docs.length>0){
          android = docs[0].android;
          ios = docs[0].ios;
        }
        
        callback(null,android,ios);
      })
    },function (android,ios,callback) {
      var htmlText=fs.readFileSync(path).toString();
      var reg=/<script>var android=\'[\w\W]*\'; var ios=\'[\w\W]*\'<\/script>/;
      var exists=reg.test(htmlText);

      var str="<script>var android='"+android+"'; var ios='"+ios+"'</script>";
      if(exists){
        var result=htmlText.split(reg);
        var newHtmlText=result[0]+str+result[1];
        fs.writeFileSync(path,newHtmlText);
      }else {

        var result=htmlText.split('<head>');
        console.log(result.length)
        var newHtmlText=result[0]+'<head>'+str+result[1];
        fs.writeFileSync(path,newHtmlText);
      }

      callback(null);
    }
  ],function (err) {
    res.json({
      code:0,
      status:'success',
      data:'ok'
    });
  })

  
});

module.exports = router;