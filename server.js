var express = require('express');
var app = express();
var bodyParser = require("body-parser");
//mongodb native drivers.
var mongodb = require('mongodb');
//"MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://52.36.237.77:27017,52.35.35.128:27017,52.40.55.71:27017/cmpe281';

app.set('port', (process.env.PORT || 5000));

var db;

// Initialize connection once
MongoClient.connect(url, function(err, database) {
	if(err) throw err;

	db = database;

  // Start the application after the database connection is ready
  app.listen(app.get('port'), function () {
  	console.log('App listening on port '+ app.get('port') + '!');
  });
});


//app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Fetch all data , filter on fields
app.get('/', function (req, res) {
	var hellocollection = db.collection('helloworld');
  var masterip = "" 
  var adminDb = db.admin();
  adminDb.serverStatus(function(err,info){
    masterip = info.host;
    console.log("server info :" + info.host );
  });
  //To Retrieve specific fields
  hellocollection.find({},{"name":1 ,"_id" :0}).toArray(function(err,data){
    if (err) {
      console.log (err);
      res.status(400).send('Error Fetching data');
    }
  var hellolist = ""
   data.forEach(function(message){
    hellolist =hellolist + message.name +"\n";
  }); 
   console.log(hellolist);
   res.send(hellolist + "(Data from Node " + masterip+ ")");
 });

	//res.send('Hello World!');
	//res.render('index.html');
});
