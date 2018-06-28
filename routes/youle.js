var express = require('express');
var router = express.Router();
var request = require('request');
var util = require('util');


router.get('/lp1',function (req,res,next) {

    var keyword = req.query.keyword||'相';
    var send_url=util.format('https://mobile.hotread.com/third/baidusem?keyword=%s',encodeURI(keyword));
    var options= {
        method: 'GET',
        url: send_url,
        json: true
    };
    request(options,function (error,response,results) {

        if(!error&&response.statusCode===200&&results.DATA[0]){

            return res.jsonp( {keyword:encodeURI(keyword),tt:results});
        }
            res.jsonp( {keyword:'诛仙',tt:results} );
    })

});

module.exports = router;