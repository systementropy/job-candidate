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
app.use(express.static('../brandworks'));
app.use(cors());
app.set('port',process.env.PORT||3000);
app.set('views',__dirname+'views');
app.set('view engine','jade');
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ 
  extended: true
})); 
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/Company';
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

});
var CandidateSchema=new mongoose.Schema({
	name:String,
	experince:String,
	expected:String,
	current:String

});
var JobSchema = new mongoose.Schema ({
	company:String,
	profile:String,
	package:String,
	skills:String
});

var job=mongoose.model('job',JobSchema);
var candidate=mongoose.model('candidate',CandidateSchema);
app.get('/getjob', function (req, res) {
    console.log('I received a GET request');
    MongoClient.connect(url,function(err,db){
    db.collection('Company').find({}).toArray(function(err,docs){
    	res.json(docs);
    })
    db.close();
});
});
app.get('/checkcandidate', function (req, res) {
    console.log('I received a GET request for check');
    MongoClient.connect(url,function(err,db){
    db.collection('Candidate').find({}).toArray(function(err,docs){
    	res.json(docs);
    })
    db.close();
});
});
app.post('/addjob', function(req, res) {
  var job={
  		company:req.body.company,
  		profile:req.body.profile,
  		package:req.body.package,
  		skills:req.body.skills
  };
  MongoClient.connect(url,function(err,db){
  	assert.equal(null,err);
  	db.collection('Company').update(job,job,{upsert:true},function(err,result){
  		assert.equal(null,err);
  		console.log("item inserted");
  		db.close();
  	});
  });
});
app.post('/applyjob', function(req, res) {
  var candidate={
  		name:req.body.name,
  		experience:req.body.experience,
  		expected:req.body.expected,
  		current:req.body.current
  };
  MongoClient.connect(url,function(err,db){
  	assert.equal(null,err);
  	db.collection('Candidate').update(candidate,candidate,{upsert:true},function(err,result){
  		assert.equal(null,err);
  		console.log("item inserted");
  		db.close();
  	});
  });
});
 	 var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, '../brandworks/uploads');
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



app.listen(3000,function(err,data){
	if(err) throw err;
	else{
		console.log("server running on 3000");
	}
});
