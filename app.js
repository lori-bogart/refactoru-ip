
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var mongoURL = global.process.env.MONGOHQ_URL || 'mongodb://localhost/packingdb'
mongoose.connect(mongoURL);

var packingListModel = mongoose.model('packingList', { packingListName: String });
var itemModel = mongoose.model('item', { listName: String, itemName: String, isChecked: Boolean});

var app = express();

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// initial page displays list of packing lists
app.get('/', function(req, res) {
	packingListModel.find(function(err, packingLists_from_db) {
		res.render('index', {
			packingLists_inJade: packingLists_from_db
		});
	});
});

// specific packing list displayed
app.get('/PackingList', function(req, resp){
	itemModel.find({listName : req.query.name}, function(err, items_from_db) {
		resp.render("PackingList", {
			PackingListDetails: req.query,
			items_inJade: items_from_db
		});
	});
});

// ajax handler to add a new packing list to mongo
// request is coming from the index.jade page
app.post('/add', function(req, res) {

	// create new packing list
	var newPackingList = new packingListModel({ 
		packingListName: req.body.packingListName
	});

	// loop over each item in the newly created packing list
	for (var i = 0; i < req.body.itemEntered.length; i++) {
		var item = new itemModel({
			listName : req.body.packingListName,
			itemName : req.body.itemEntered[i],
			isChecked : false
	 	});
	 	// save each item in packing list to mongo
		item.save(function (err) {
			if (err) {
				console.log(err);
				res.send(500, 'Error encountered saving item ' + i);			
			}
		});
	};

// save the packing list name in mongo
	newPackingList.save(function (err) {
		if (err) {
			console.log(err);
			res.send(500, 'Error encountered saving newPackingList to database.')
		}
		else {
			res.send({name : newPackingList.packingListName})
		}
	});
});

// ajax call from packinglist.jade to update the checkbox state in mongo
app.post('/updateCheckbox', function(req, res) {

	// update the item in the db:
	console.log(req.body);
	itemModel.update({_id : req.body.id}, {$set: {isChecked : req.body.checked }}, function(err, items_from_db) {	
			if (err) {
				console.log(err);
				res.send(500, 'Error encountered saving checkbox ' + req.body.id);			
			}
		else {
			res.send('Success');
		};
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
