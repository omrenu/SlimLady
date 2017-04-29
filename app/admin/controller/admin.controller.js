/**
 * Created by apoorvaagrawal on 19/02/17.
 */
(function () {
    'use strict';
    angular.module('SlimLady')
        .constant('API_URL', 'https:')
        .controller('AdminCtrl', AdminCtrl);


    function AdminCtrl($scope, $rootScope, $state, $stateParams, $timeout, $window, $document, $interval, Api, User, WorkoutService,EXERCISE_BUFFER,VIDEO_SECONDS,$firebaseArray,$firebaseObject, FIREBASE_URL, $firebaseAuth,AdminFactory) {
        var vm = this;
        vm.catCount = 0;
        vm.workoutCount = 0;
        vm.excerciseCount = 0;

        var ref,auth,catRef,workoutRef,excerRef;

        /*for binding with model*/
        vm.dataRow = {
            categories:{
                id:"",
                name:"strength"
            },
            workouts:{
                id:"",
                name:"coreExcercise",
                category:"strength",
                workout_image:"https://s3.amazonaws.com/m.sworkit.com/assets/workouts/images/small/coreExercise.png",
                break:{
                    name:"30 Second Break",
                    video:"https://s3.amazonaws.com/m.sworkit.com/assets/exercises/v2/videos/1080/restbreak.mp4",
                    audio:"https://s3.amazonaws.com/m.sworkit.com/assets/exercises/Audio/EN/Break.mp3",
                    break_image:"https://s3.amazonaws.com/m.sworkit.com/assets/exercises/v2/images/1080/first-frame/restbreak.jpg"
                }
            },
            excercises:{
                id:"",
                workout_cat:"coreExcercise",
                ex_image:"https://s3.amazonaws.com/m.sworkit.com/assets/exercises/v2/images/1080/first-frame/situps.jpg",
                audio:"https://s3.amazonaws.com/m.sworkit.com/assets/exercises/Audio/EN/Situps.mp3",
                video:"https://s3.amazonaws.com/m.sworkit.com/assets/exercises/v2/videos/1080/situps.mp4"
            }
        };

        /*Sync with database table*/

        vm.catTable = [];

        vm.catRow = {
                name: "",
                workouts:[]

        };
        vm.workoutRow = {

            name:"",
            category:"",
            workout_image:"",
            break:{
                name:"",
                video:"",
                audio:"",
                break_image:""
            },
            excercises:[]
        };
        vm.excerciseRow = {
            workout_cat:"",
            ex_image:"",
            audio:"",
            video:""
        }

        /*Binding primaryKey*/

        vm.bindCat = function(){


            if(vm.dataRow.categories.name != undefined && vm.dataRow.categories.name.length)
            {
                vm.dataRow.workouts.category = vm.dataRow.categories.name;
            }
            else
            {
                vm.dataRow.workouts.category = "";
                vm.dataRow.categories.name = "";
            }
        }

        vm.bindExcercise = function(){

            if(vm.dataRow.workouts.name != undefined && vm.dataRow.workouts.name.length)
            {
                vm.dataRow.excercises.workout_cat = vm.dataRow.workouts.name;
            }
            else
            {
                vm.dataRow.workouts.name = "";
                vm.dataRow.excercises.workout_cat = "";
            }
        }

        vm.saveData = function(){

            vm.catRow.name = vm.dataRow.categories.name;
            vm.catRow.id = vm.dataRow.categories.id;
            /*Workout*/
            vm.workoutRow.workoutId = vm.dataRow.workouts.id;
            vm.workoutRow.name = vm.dataRow.workouts.name;
            vm.workoutRow.category = vm.dataRow.workouts.category;
            vm.workoutRow.workout_image = vm.dataRow.workouts.workout_image;

            /*Break*/
            vm.workoutRow.break.name = vm.dataRow.workouts.break.name;
            vm.workoutRow.break.video = vm.dataRow.workouts.break.video;
            vm.workoutRow.break.audio = vm.dataRow.workouts.break.audio;
            vm.workoutRow.break.break_image = vm.dataRow.workouts.break.break_image;

            /*Excercises*/
            vm.excerciseRow.exid = vm.dataRow.excercises.id;
            vm.excerciseRow.workout_cat = vm.dataRow.excercises.workout_cat;
            vm.excerciseRow.ex_image = vm.dataRow.excercises.ex_image;
            vm.excerciseRow.audio = vm.dataRow.excercises.audio;
            vm.excerciseRow.video = vm.dataRow.excercises.video;

            /*Feed Data into table*/
            vm.workoutRow.excercises.push(vm.excerciseRow);
            vm.catRow.workouts.push(vm.workoutRow);

            //console.log(vm.catRow);
            //vm.catTable.push(vm.catRow);


            ref = firebase.database().ref();
            auth = $firebaseAuth(firebase.auth());

            //catRef = ref.child('catogeries'+'/'+vm.catRow.id).push();
            //workoutRef = catRef.child("workouts").push();
            //excerRef  = workoutRef.child("excercises").push();

            //var catData =  {
            //    catid:vm.catRow.id,
            //    catName: vm.catRow.name
            //};

            AdminFactory.categories.catSet(vm.catRow).then(function(){

                vm.dataRow.categories.name = '';
                vm.dataRow.categories.id = '';

            },function(error){
                console.log();
            });

            //var workoutData = {
            //    workoutId: vm.workoutRow.workoutId,
            //    category: vm.workoutRow.category,
            //    name: vm.workoutRow.name,
            //    workout_image: vm.workoutRow.workout_image,
            //    break: [{
            //        name: vm.workoutRow.break.name,
            //        video: vm.workoutRow.break.video,
            //        audio: vm.workoutRow.audio,
            //        image: vm.workoutRow.break.break_image
            //    }]
            //};
            //
            //
            //AdminFactory.workouts.workSet(vm.catRow.id,workoutData).then(function(){
            //
            //    vm.dataRow.workouts.name = "";
            //    vm.dataRow.workouts.category = "";
            //    vm.dataRow.workouts.workoutId = "";
            //    vm.dataRow.workouts.workout_image = "";
            //    vm.dataRow.workouts.break.name = "";
            //    vm.dataRow.workouts.break.video = "";
            //    vm.dataRow.workouts.break.audio = "";
            //    vm.dataRow.workouts.break.image = "";
            //
            //},function(err){
            //    console.log("err",err);
            //});
            //
            //var exerciseData = {
            //    exId: vm.excerciseRow.exid,
            //    workout_cat: vm.excerciseRow.workout_cat,
            //    ex_image: vm.excerciseRow.ex_image,
            //    audio: vm.excerciseRow.audio,
            //    video: vm.excerciseRow.video
            //};
            //AdminFactory.excercises.exSet(vm.catRow.name,vm.workoutRow.workoutId,exerciseData).then(function(){
            //
            //    vm.dataRow.excercises.id = "";
            //    vm.dataRow.excercises.workout_cat = "";
            //    vm.dataRow.excercises.ex_image = "";
            //    vm.dataRow.excercises.audio = "";
            //    vm.dataRow.excercises.video = "";
            //
            //},function(err){
            //    console.log("excercise ",err);
            //});

        }


    }


})();