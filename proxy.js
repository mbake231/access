var https = require('https');
var httpProxy = require('http-proxy');
var express = require('express');
var HttpProxyRules = require('http-proxy-rules');


var proxyRules = new HttpProxyRules({
    rules: {
        '.*/home': 'http://localhost:3001', // Rule (1) docs, about, etc
        '.*/docs/*': 'http://localhost:3001',
        '.*/about': 'http://localhost:3001',
        '.*/press': 'http://localhost:8081',
        '.*/jobs': 'http://localhost:8081',
        '.*/developers': 'http://localhost:8081',

        '.*/forum': 'http://localhost:4567/forum', // Rule (2) forums
        '.*/forum/*': 'http://localhost:4567/forum',
        '/forum/*': 'http://localhost:4567/forum',
        './forum/*': 'http://localhost:4567/forum',
        '/forum': 'http://localhost:4567/forum'
    },
    default: 'http://localhost:3001' // default target, will be landing page
});
var proxy = httpProxy.createProxy();

var bodyParser = require('body-parser')
var mainapp = express();

mainapp.use(function(req,res,next){
    try{
        if (req.url.substr(0, 18).indexOf("socket.io")>-1){
            //console.log("SOCKET.IO", req.url)
            return proxy.web(req, res, { target: 'wss://localhost:4567', ws: true }, function(e) {
            //console.log('PROXY ERR',e)
            });
        } else {
            var target = proxyRules.match(req);
            if (target) {
                //console.log("TARGET", target, req.url)
                return proxy.web(req, res, {
                    target: target
                }, function(e) {
                //console.log('PROXY ERR',e)
                });
            } else {
                res.sendStatus(404);
            }
        }
    } catch(e){
        res.sendStatus(500);
    }
});
mainapp.use(bodyParser.json());
mainapp.use(bodyParser.urlencoded({ extended: false }));

var options = {/*Put your TLS options here.*/};

var mainserver = https.createServer(options, mainapp);
mainserver.listen(process.env.PORT || 4433);
//mainserver.on('listening', onListening);
mainserver.on('error', function (error, req, res) {
    
    var json;
    console.log('proxy error', error);
    if (!res.headersSent) {
    res.writeHead(500, { 'content-type': 'application/json' });
    }

    json = { error: 'proxy_error', reason: error.message };
    res.end(JSON.stringify(json));
});