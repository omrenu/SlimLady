/**
 * Created by apoorvaagrawal on 12/03/17.
 */

//create intance of express server
var express = require('express');

//console.log("entered");

//create instance of express Router
var router = express.Router();
var adminCtrl = require('../controllers/admin.controller');

/*
*
*  Adds a workout,catogery
*
* */


router.get('/categories',adminCtrl.getCatogeries);
router.get('/categories/:catName',adminCtrl.getWorkouts);
module.exports = router;