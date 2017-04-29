


//console.log("admin module 2");
//Create instance of Mongoose

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// Use External JSON to XML conversion library
var js2xmlparser = require('js2xmlparser');

//console.log("admin module 3");

require('../models/catogeries');
var Workouts = mongoose.model('Workouts');


module.exports = {

    /**
     * Adds a data to Mongo Database
     **/

    getCatogeries: function (req, res) {

        var workoutCat = [];
        Workouts.find({},function(err,workouts){


            for(var i=0;i<workouts.length;i++)
            {
                //console.log(workouts[i]);
                if(workouts[i].catid!== null || workouts[i].catid != undefined)
                {
                    //console.log(workoutCat.push(workouts.catid));
                    workoutCat.push({name:workouts[i].catName});
                }
            }
            console.log(workoutCat.length);
            if(workoutCat.length >0){
                res.send(workoutCat);
            }

        });

        //else{
        //    req.status(500).send("error");
        //}


    },

    getWorkouts: function (req, res) {

        var workoutCat = [];

        Workouts.findOne({
            catName: req.params.catName
        }, function (err, catWorkouts) {
            if (err) res.status(500).send(err);

            console.log(catWorkouts);

            res.send(catWorkouts);
        });


    }


};





