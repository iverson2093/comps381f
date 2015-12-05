var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//var mongodbURL = 'mongodb://localhost:27017/test';
var mongodbURL = 'mongodb://TK17.cloudapp.net:27017/test';
var mongoose = require('mongoose');
var restaurantSchema = require('./models/restaurant');

//create a document [OK]
app.post('/',function(req,res) {
	//console.log(req.body);
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var rObj = {};
		rObj.address = {};
		rObj.address.building = req.body.building;
		rObj.address.street = req.body.street;
		rObj.address.zipcode = req.body.zipcode;
		rObj.address.coord = [];
		rObj.address.coord.push(req.body.lon);
		rObj.address.coord.push(req.body.lat);
		rObj.borough = req.body.borough;
		rObj.cuisine = req.body.cuisine;
		rObj.name = req.body.name;
		rObj.restaurant_id = req.body.restaurant_id;
		//test grades
		rObj.grades = {};		
		rObj.grades.date = req.body.date;
		rObj.grades.grade = req.body.grade;
		rObj.grades.score = req.body.score;

		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var r = new Restaurant(rObj);
		//console.log(r);
		r.save(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		console.log('Restaurant created!')
       		db.close();
			res.status(200).json({message: 'insert done', id: r._id});
			res.end();
    	});
    });
});

//delete the document by id [OK]
app.delete('/restaurant_id/:id',function(req,res) {
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({restaurant_id: req.params.id}).remove(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		console.log('Restaurant removed!')
       		db.close();
			res.status(200).json({message: 'delete done', id: req.params.id});
			res.end();
    	});
    });
});

//delete the document by name [OK]
app.delete('/name/:name',function(req,res) {
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({name: req.params.name}).remove(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		console.log('Restaurant removed!')
       		db.close();
			res.status(200).json({message: 'delete done', name: req.params.name});
			res.end();
    	});
    });
});

//delete the document by any attrib [OK] cuisine&borough
app.delete('/:attrib/:attrib_value', function(req,res) {
	
	var criteria = {};
	criteria[req.params.attrib] = req.params.attrib_value;

	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find(criteria).remove(function(err,results) {
       		if (err) {
				res.status(500).json(err);
				throw err
			} else {
       			console.log('Restaurant removed!');
       			db.close();
			res.status(200).json({message: 'delete done', criteria: criteria});
			res.end();
			}
    	});
    });
});

//delete the document by address inside array of address [OK]
app.delete('/address/:attrib/:attrib_value', function(req,res) {
	
	var criteria = {};
	criteria["address."+req.params.attrib] = req.params.attrib_value;

	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find(criteria).remove(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		console.log('Restaurant removed!');
       		db.close();
			res.status(200).json({message: 'delete done', criteria: criteria});
			res.end();
    	});
    });
});

//find the document by restaurant_id [OK]
app.get('/restaurant_id/:id', function(req,res) {
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({restaurant_id: req.params.id},function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
				res.end();
			}
			else {
				res.status(200).json({message: 'No matching document'});
				res.end();
			}
			db.close();
    	});
    });
});

//find the document by name [OK]
app.get('/name/:name', function(req,res) {
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({name: req.params.name},function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document'});
				res.end();
			}
			db.close();
    	});
    });
});

//find the document by any attribute [OK]
app.get('/:attrib/:attrib_value', function(req,res) {
	
	var criteria = {};
	criteria[req.params.attrib] = req.params.attrib_value;

	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find(criteria,function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document'});
				res.end();
			}
			db.close();
    	});
    });
});

//find the document by address inside array of address [OK]
app.get('/address/:attrib/:attrib_value', function(req,res) {
	
	var criteria = {};
	criteria["address."+req.params.attrib] = req.params.attrib_value;

	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find(criteria,function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document'});
				res.end();
			}
			db.close();
    	});
    });
});

//update document by name [OK] 401 error on server
app.put('/name/:name/:attrib/:attrib_value', function(req,res) {
	var criteria = {};
	criteria[req.params.attrib] = req.params.attrib_value;

	console.log(criteria);
	
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.update({name:req.params.name},{$set:criteria},function(err,results){
			if (err) {
				res.status(500).json(err);
				throw err;
			}
			else {
				db.close();
				res.status(200).json({message: 'update done!',name:req.params.name});
				//res.status(200).json(results);
				res.end();
			}
		});
	});
});


//update the document by id [OK] 401 error on server
app.put('/restaurant_id/:id/:attrib/:attrib_value', function(req,res) {
	var criteria = {};
	criteria[req.params.attrib] = req.params.attrib_value;

	console.log(criteria);
	
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.update({restaurant_id: req.params.id},{$set:criteria},function(err,results){
			if (err) {
				res.status(500).json(err);
				throw err
			}
			else {
				db.close();
				res.status(200).json({message: 'update done!',restaurant_id:req.params.id});
				//res.status(200).json(results);
				res.end();
			}
		});
	});
});

//update the grade by restaurant_id [OK]
app.put('/restaurant_id/:id/grade',function(req,res) {
	//console.log(req.body);
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var rObj = {};		
		rObj.grades = {};		
		rObj.grades.date = req.body.date;
		rObj.grades.grade = req.body.grade;
		rObj.grades.score = req.body.score;
		
		//rObj.grades = [];
		//rObj.grades.push(req.body.date);
		//rObj.grades.push(req.body.grade);
		//rObj.grades.push(req.body.score);

		console.log(rObj);
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var r = new Restaurant(rObj);
		Restaurant.update({restaurant_id:req.params.id},{$set:rObj},function(err,results){
		//console.log(r);
		//r.save(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       			db.close();
			res.status(200).json({message: 'update grade done!!!',restaurant_id:req.params.id});
			res.end();
    	});
    });
});

//update the address by restaurant_id [OK]
app.put('/restaurant_id/:id/address',function(req,res) {
	//console.log(req.body);
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var rObj = {};
		rObj.address = {};
		rObj.address.building = req.body.building;
		rObj.address.street = req.body.street;
		rObj.address.zipcode = req.body.zipcode;
		rObj.address.coord = [];
		rObj.address.coord.push(req.body.lon);
		rObj.address.coord.push(req.body.lat);

		console.log(rObj);
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var r = new Restaurant(rObj);
		Restaurant.update({restaurant_id:req.params.id},{$set:rObj},function(err,results){
		//console.log(r);
		//r.save(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       			db.close();
			res.status(200).json({message: 'update address done!!!',restaurant_id:req.params.id});
			res.end();
    	});
    });
});

//update the cuisine by restaurant_id [OK]
app.put('/restaurant_id/:id/cuisine',function(req,res) {
	//console.log(req.body);
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var rObj = {};		
		rObj.cuisine = req.body.cuisine;

		console.log(rObj);
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var r = new Restaurant(rObj);
		Restaurant.update({restaurant_id:req.params.id},{$set:rObj},function(err,results){
		//console.log(r);
		//r.save(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       			db.close();
			res.status(200).json({message: 'update cuisine done!!!',restaurant_id:req.params.id});
			res.end();
    	});
    });
});

//update the borough by restaurant_id [OK]
app.put('/restaurant_id/:id/borough',function(req,res) {
	//console.log(req.body);
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var rObj = {};		
		rObj.borough = req.body.borough;

		console.log(rObj);
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var r = new Restaurant(rObj);
		Restaurant.update({restaurant_id:req.params.id},{$set:rObj},function(err,results){
		//console.log(r);
		//r.save(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       			db.close();
			res.status(200).json({message: 'update borough done!!!',restaurant_id:req.params.id});
			res.end();
    	});
    });
});

//update the cuisine by name [OK]
app.put('/name/:name/cuisine',function(req,res) {
	//console.log(req.body);
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var rObj = {};		
		rObj.cuisine = req.body.cuisine;

		console.log(rObj);
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var r = new Restaurant(rObj);
		Restaurant.update({name:req.params.name},{$set:rObj},function(err,results){
		//console.log(r);
		//r.save(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       			db.close();
			res.status(200).json({message: 'update cuisine done!!!',name:req.params.name});
			res.end();
    	});
    });
});

//update the borough by name [OK]
app.put('/name/:name/borough',function(req,res) {
	//console.log(req.body);
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var rObj = {};		
		rObj.borough = req.body.borough;

		console.log(rObj);
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var r = new Restaurant(rObj);
		Restaurant.update({name:req.params.name},{$set:rObj},function(err,results){
		//console.log(r);
		//r.save(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       			db.close();
			res.status(200).json({message: 'update borough done!!!',name:req.params.name});
			res.end();
    	});
    });
});

//update the grade by name [OK]
app.put('/name/:name/grade',function(req,res) {
	//console.log(req.body);
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var rObj = {};		
		rObj.grades = {};		
		rObj.grades.date = req.body.date;
		rObj.grades.grade = req.body.grade;
		rObj.grades.score = req.body.score;
		
		//rObj.grades = [];
		//rObj.grades.push(req.body.date);
		//rObj.grades.push(req.body.grade);
		//rObj.grades.push(req.body.score);

		console.log(rObj);
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var r = new Restaurant(rObj);
		Restaurant.update({name:req.params.name},{$set:rObj},function(err,results){
		//console.log(r);
		//r.save(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       			db.close();
			res.status(200).json({message: 'update grade done!!!',name:req.params.name});
			res.end();
    	});
    });
});

//update the address by name []
app.put('/name/:name/address',function(req,res) {
	//console.log(req.body);
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var rObj = {};
		rObj.address = {};
		rObj.address.building = req.body.building;
		rObj.address.street = req.body.street;
		rObj.address.zipcode = req.body.zipcode;
		rObj.address.coord = [];
		rObj.address.coord.push(req.body.lon);
		rObj.address.coord.push(req.body.lat);

		console.log(rObj);
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var r = new Restaurant(rObj);
		Restaurant.update({name:req.params.name},{$set:rObj},function(err,results){
		//console.log(r);
		//r.save(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       			db.close();
			res.status(200).json({message: 'update address done!!!',name:req.params.name});
			res.end();
    	});
    });
});

/*
//delete the document by cuisine [OK]
app.delete('/cuisine/:cuisine',function(req,res) {
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({cuisine: req.params.cuisine}).remove(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		console.log('Restaurant removed!');
       		db.close();
			res.status(200).json({message: 'delete done', cuisine: req.params.cuisine});
			res.end();
    	});
    });
});

//delete the document by borough [OK]
app.delete('/borough/:borough',function(req,res) {
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({borough: req.params.borough}).remove(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		console.log('Restaurant removed!');
       		db.close();
			res.status(200).json({message: 'delete done', borough: req.params.borough});
			res.end();
    	});
    });
});
*/

/*
//update the document by grade [OK] must enter grades=xxx
app.put('/grade/:grade',function(req,res) {
	//console.log(req.body);
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var rObj = {};		
		rObj.grades = {};		
		rObj.grades.date = req.body.date;
		rObj.grades.grade = req.body.grade;
		rObj.grades.score = req.body.score;
		
		//rObj.grades = [];
		//rObj.grades.push(req.body.date);
		//rObj.grades.push(req.body.grade);
		//rObj.grades.push(req.body.score);

		console.log(rObj);
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var r = new Restaurant(rObj);
		Restaurant.update({'grades.grade':req.params.grade},{$set:rObj},function(err){
		//console.log(r);
		//r.save(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       			db.close();
			res.status(200).json({message: 'update done'});
			res.end();
    	});
    });
});
*/

app.listen(process.env.PORT || 8099);
