/**
 * Created by apoorvaagrawal on 04/03/17.
 */
/**
 * Created by apoorvaagrawal on 04/03/17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WorkoutSchema = new Schema({
    workoutId:String,
    category:String,
    name: String,
    workout_image: String,
    break:[{
        name:String,
        video:String,
        audio:String,
        image:String
    }],
    catId: [{ type: mongoose.Schema.Types.ObjectId, ref:'Categories'}],
    excercises: [{ type: mongoose.Schema.Types.ObjectId, ref:'Excercise'}]
});

var WorkoutCat = mongoose.model('WorkoutCat', WorkoutSchema);
module.export = WorkoutCat;
