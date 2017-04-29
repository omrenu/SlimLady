///**
// * Created by apoorvaagrawal on 04/03/17.
// */
///**
// * Created by apoorvaagrawal on 04/03/17.
// */
var mongoose = require('mongoose');

var CategoriesSchema = mongoose.Schema({
    catid: {
        type:String,
        unique: true,
        index: true
    },
    catName: {
        type:String,
        unique: true,
        index: true
    },
    break:{
        "name":String,
        "video":String,
        "audio":String,
        "image":String
    },
    workouts : [{
        "id": String,
        "name": String,
        "icon": String,
        "description": String,
        "image": String,
        "audio": String,
        "video": String,
        "category": String,
        "defaultExerciseLength": Number
    }]
});

var Workouts = mongoose.model('Workouts', CategoriesSchema,'workouts');
module.exports = Workouts;






