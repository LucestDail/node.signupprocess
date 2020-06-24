//basic express module import
var express = require('express');
var http = require('http');
var path = require('path');

//express midleware module import
var bodyparser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');
var errorHandler = require('errorhandler');

//errorhandler midleware import
var expressErrorHandler = require('express-error-handler');

//session midleware import
var expressSession = require('express-session');

//file io midleware import
var multer = require('multer');
var fs = require('fs');

//multiple server connection midleware, called cors, import
var cors = require('cors');

// declear express variable as app
var app = express(); 

//set port env, or 3000
app.set('port', process.env.PORT || 3000); 

// path set using path function(var path) - upblic for html, uploads for file io
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

//set body-parser as middleware
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//set cookieparser as middleware
app.use(cookieParser());

//set expressSession as middleware, it contained information from session object
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

//set cors as middleware
app.use(cors());

//define storage function as middleware that have dependency on multer module
var storage = multer.diskStorage({
    destination: function(req, file, callback)
    {
        callback(null, 'uploads')
    },
    filename: function(req, file, callback)
    {
        callback(null, file.originalname)
    }
});

//define upload function as middleware that have dependency on multer module
var upload = multer({
    storage: storage,
    limits: {
        files: 10,
        fileSize: 1024 * 1024 * 1024
    }
});

// router decleared
var router = express.Router();

// when requesting process/login route, respond log and got ID/Password
router.route('/process/signup').post(upload.array('photo',1),function(req,res){
    console.log('/process/signup functin called');
    try{
        var files = req.files;
        console.log('[uploaded file information]');
        console.dir(req.files[0]);
        console.log('---------------------------');
        var originalname = '',
            filename = '',
            mimetype = '',
            size = 0;
        
        if(Array.isArray(files))
            {
                console.log('file number which contained in array : %d', files.length);
                for(var index = 0; index < files.length; index++)
                    {
                        originalname = files[index].originalname;
                        filename = files[index].filename;
                        mimetype = files[index].mimetype;
                        size = files[index].size;
                    }
            }else
                {
                    console.log('file number : 1');
                    originalname = files[index].originalname;
                    filename = files[index].filename;
                    mimetype = files[index].mimetype;
                    size = files[index].size;
                }
        console.log('[file information] : ' +
                    originalname + ',' +
                    filename + ',' +
                    mimetype + ',' +
                    size)
        var paramName = req.body.name||req.query.name;
        var paramBirth = req.body.birth||req.query.birth;
        var paramAny = req.body.any||req.query.any;
        console.log('Name : ' + paramName);
        console.log('Birthday : ' + paramBirth);
        console.log('Anything this user want : ' + paramAny);
        res.writeHead('200',{'Content-type':'text/html;charset=utf8'});
        res.write('<h1>sign up succesful!!!</h1>');
        res.write('<img src="/uploads/' + originalname + '" width="200" height="200" </p>');
        res.write('<br><br> Welcome, '+ paramName+'we hope you enjoy our community');
        res.write("<br><br><a href='/process/comm'> go to prcommunity </a>");
        res.end();
    }catch(err){
        console.dir(err.stack);
    }
});

router.route('/process/comm').get(function(req, res){
    console.log('/process/comm function called');
    res.redirect('/public/comm.html');
});


// use router as middleware, that could route path given '/'
app.use('/', router);

// error handling function, module importing, use it as middleware when httperror 404 happened, outprint 404.html
app.use(expressErrorHandler.httpError(404));
var errorHandler = expressErrorHandler({
    static:
    {
        '404': './public/404.html'
    }
});

//ues errorHandler as middleware
app.use(errorHandler);

// server function, ues app struct 'port' num(if would be contain env port or 3000)
var server = http.createServer(app).listen(app.get('port'), function(){
   console.log('express web server port : '+ app.get('port')); 
});