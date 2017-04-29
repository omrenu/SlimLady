///**
// * Created by apoorvaagrawal on 13/03/17.
// */
//
//
////Create Instance of Models
//
//var express = require('express');
//var mongoose = require('mongoose');
//var session = require('express-session');
//var bodyParser = require('body-parser');
//
//var db = require('./server/config/database');
//
//// Create Port variable, set to Heroku ENV port
//
//var port = process.env.PORT || 3000;
//var app = express();
////app.use(app.router);
//// Connect to Database =========================================================
//
//mongoose.connect(process.env.MONGOLAB_URI || db.url, function(err) {
//    if(err) {
//        console.log('problem connecting!');
//    } else {
//        console.log('connected to heroku mongo');
//    }
//});
//
//var Catogery = mongoose.model('AdminCat');
//
//
//var API_URL = '/api/workouts';
//
//
//
//// App Config =======================================
//
//app.use(bodyParser.json({limit:'50mb'}));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//
//console.log("app config");
//
//// Config for Express Sessions
////app.use(session({
////    secret: 'williamhgoughMMUThirdYearEnterpriseNodeApiAssignment',
////    resave: false,
////    saveUninitialized: true
////}));
//
//// Set static directory to public for use on front-end
//app.use(express.static(__dirname + '/app'));
//console.log("app static directory");
//
////define index page for use with Angular Application
//app.get('/', function(req, res) {
//    res.sendFile(path.join(__dirname, '/app', 'index.html'));
//});
//
//console.log("app index page");
//
//// Add & Configure the Admin API routes
//var admin = require('./server/routes/adminRoutes');
//
//app.use('/admin', admin);
//
//console.log("app admin");
//
//
//fs.readFile(DATA_FILE, function(err, data) {
//    JSON.parse(data).forEach(function(catogery) {
//
//       console.log("data is ",catogery);
//
//    });
//
//    app.listen(PORT, function() {
//        open('http://localhost:' + PORT + '/');
//        // console.log('Go to http://localhost:' + PORT + '/');
//    });
//});
//
//
////
////// Launch Application ==========================================================
////app.listen(port);
////console.log('The magic happens on port ' + port);



/**
 * Created by apoorvaagrawal on 19/03/17.
 */
var express = require('express');
var mongoose = require('mongoose');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var open = require('open');
var fs = require('fs');

require('./models/catogeries');

var db = require('./config/database');

var port = process.env.PORT || 3000;
//var app = express();
//app.use(app.router);

// Connect to Database =========================================================

mongoose.connect(db.url, function(err) {
    if(err) {
        console.log('problem connecting!');
    } else {
        console.log('connected to mongo');
    }
});


var Workouts = mongoose.model('Workouts');


var API_URL = '/api/workouts';

exports.start = function(PORT,STATIC_DIR,DATA_FILE){

    var app = express();

    app.use(logger('dev'));

    app.use(express.static(STATIC_DIR));

    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({extended:true}));

    //API


    // Add & Configure the Admin API routes
    var admin = require('././routes/adminRoutes');

    app.use('/admin', admin);

    //console.log("app admin");

    // read the data from .json and start the server

    app.listen(PORT, function() {
        open('http://localhost:' + PORT + '/');
        // console.log('Go to http://localhost:' + PORT + '/');
    });
//    fs.readFile(DATA_FILE, function(err, data) {
//    JSON.parse(data).forEach(function(catogery) {
//
//
//        var slimWorkout = new Workouts({
//
//            catid:catogery.catid,
//            catName:catogery.catName,
//            break:catogery.break,
//            workouts:catogery.workouts
//
//        });
//        slimWorkout.save(function(err,workout){
//
//            //if(err){
//            //    return next(err);
//            //}
//            //console.log("slimWorkout Saved ---------",workout);
//        });
//
//    });
//
//
//});


}