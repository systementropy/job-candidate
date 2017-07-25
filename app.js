var cors = require('cors');
var express=require('express');
var multer = require('multer');
var router=express.Router();
var http=require('http');
var CircularJSON = require('circular-json');
var server=http.createServer();
var path=require('path');
var stringify = require('json-stringify-safe');
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var methodOverride=require('method-override');
var app = express();
app.use(express.static('../job-candidate'));
app.use(cors());
app.set('port',process.env.PORT||3001);
app.set('views',__dirname+'views');
app.set('view engine','jade');
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
var assert = require('assert');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, '../job-candidate/uploads');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

var upload = multer({ //multer settings
  storage: storage
}).single('file');

    /** API path that will upload the files */
app.post('/upload', function(req, res) {
    upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        res.json({error_code:0,err_desc:null});
    });
});



app.listen(3001,function(err,data){
	if(err) throw err;
	else{
		console.log("server running on 3001");
	}
});
