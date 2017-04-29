var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ExcerciseSchema = new Schema({
    exId:String,
    workout_cat:String,
    video:String,
    audio:String,
    ex_image:String,
    workoutId:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Workout'}]
});

var ExcerciseCat = mongoose.model('ExcerciseCat', ExcerciseSchema);

module.export = ExcerciseCat;
