
/** app.js Packing List IP project
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/packingdb');
// convention: model name should have initial cap
//also, "packingListName" is redundant; better practice is to use "name"
var packingListModel = mongoose.model('packingList', { packingListName: String });
var itemModel = mongoose.model('item', { listName: String, itemName: String, isChecked: Boolean});

//from Raine:
//create a PackingList more OO model
// var Packinglist = mongoose.model('PackingList' {
// 	name: String
// 	items: [Item]
// });
// var Item [
// 	name: String
// 	isChecked: Boolean
// ]

// var firstpackingList = new packingListModel({ packingListName: 'beach' });
// firstpackingList.save();
// var firstItem = new itemModel({listName: 'beach', itemName: 'umbrella', isChecked: false});
// firstItem.save();
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

// app.get('/', routes.index);
// app.get('/users', user.list);
app.get('/PackingList', function(req, resp){
	itemModel.find({listName : req.query.name}, function(err, items_from_db) {
		resp.render("PackingList", {
			PackingListDetails: req.query,
			items_inJade: items_from_db
		})
	});
});

app.get('/', function(req, res) {

	// 
	packingListModel.find(function(err, packingLists_from_db) {
		res.render('index', {
			packingLists_inJade: packingLists_from_db
		});
	});


});

// WHOLE THING: route
// 1st arg: url
// 2nd arg: route handler (a callback)
//	- anon function
// 	- named function, defined elsewhere
app.post('/add', function(req, res) {

	// 1. create new packing list
	var newPackingList = new packingListModel({ 
		packingListName: req.body.packingListName
	});
	console.log(req.body.itemEntered);
	//save the items to the db:
	for (var i = 0; i < req.body.itemEntered.length; i++) {
		var item = new itemModel({
			listName : req.body.packingListName,
			itemName : req.body.itemEntered[i],
			isChecked : false
	 	});
		item.save(function (err) {
			if (err) {
				console.log(err);
				res.send(500, 'Error encountered saving item ' + i);			
			}
		});
	};

// save the packinglist to the database
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

app.post('/updateCheckbox', function(req, res) {

	//UPDATE the item in the db:
	console.log(req.body);
	itemModel.update({_id : req.body.id}, {$set: {isChecked : true }}, function(err, items_from_db) {	
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
