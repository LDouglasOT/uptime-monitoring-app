var http = require('http');
var https = require('https');
var url = require('url');
var stringDecoder = require('string_decoder').StringDecoder;
var config = require('./config')
var fs = require('fs')
var _data = require('./lib/data')
var handler = require('./lib/handlers')
var helpers = require('./lib/helpers')

// _data.delete('test','newFile',function(err,data){
//     console.log('errored ',err);
// })
// _data.read('test','newFile',function(err,data){
//     console.log(err)
//     console.log(data)
// })

//instantiate an http server
var httpServer = http.createServer(function(req,res){
    unifiedServer(req,res)
})

//start http server
httpServer.listen(config.httpPort,function(){
    console.log("server started on port "+ config.port+" running in "+ config.envName + " mode");
});

//instantiate an http server
var httpsSeverOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
};
var httpsServer = https.createServer(httpsSeverOptions,function(req,res){
    unifiedServer(req,res);
});

//config port set from here
httpsServer.listen(config.httpsPort,function(){
    console.log("server started on port "+ config.httpsPort+" running in "+ config.envName + " mode");
});


var unifiedServer = function (req,res){
//Get path name
var parsedUrl = url.parse(req.url,true);
var path = parsedUrl.pathname;
var trimmedPath = path.replace(/^\/+|\/+$/g,''); //trim off the first and last trailing slashed. /foo/hello/  becomes foo/hello

//Get querystring as an object
var queryStringObject = parsedUrl.query;
console.log(queryStringObject);

//Get http request method
var method = req.method.toLocaleLowerCase();

//Get http headers
var headers = req.headers;

//Parsing payloads
var decoder = new stringDecoder('utf-8');

//req emits the data event on which we subscribe incase the request contains a payload, this is a good spot to decode our data since it comes in as stream
var buffer = '';
req.on('data',function(data){
    buffer +=decoder.write(data);
});

// req will alway emit the end event whether the request has/ has no payload, this is a good spot for sending responses since the event will always be called
req.on('end',function(){
    buffer += decoder.end()
    //choose route by checking key existience in the router object
    var chosePath = router[trimmedPath] !== undefined ? router[trimmedPath] : handler.notFound
    var data = {
        'trimmedPath':trimmedPath,
        'queryStringObject':queryStringObject,
        'method': method,
        'headers': headers,
        'payload': helpers.parseJsonToObject(buffer)
    }
    chosePath(data, function(statusCode,payload){
        statusCode = typeof(statusCode) == 'number' ? statusCode:200
        payload = typeof(payload) == 'object' ? payload: {}
        var payloadString = JSON.stringify(payload);
        res.setHeader('Content-Type','application/json')
        res.writeHead(statusCode);
        res.end(payloadString);
        console.log('returning',statusCode,payloadString)
    })
});
}




var router = {
    'sample':handler.sample,
    'ping':handler.ping,
    'users':handler.users,
    'tokens':handler.tokens
};