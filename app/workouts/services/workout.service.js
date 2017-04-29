/**
 * Created by apoorvaagrawal on 04/12/16.
 */
(function() {
    'use strict';

    angular
        .module('SlimLady')
        .factory('WorkoutService', WorkoutService);

    function WorkoutService($window, $q, $firebaseArray, FIREBASE_URL, User,$firebaseObject) {

        var uid = User.auth.$getAuth().uid;
        var ref = firebase.database().ref();
        var customWorkoutsRef = ref.child('users').child(uid).child('customWorkouts');
        var customWorkouts = $firebaseArray(customWorkoutsRef);

        var categoryRef = ref.child('categories');
        var isExist = false;
        var service = {
            convertSounds: convertSounds,
            autoScroll: autoScroll,
            playAudio: playAudio,
            createCustomWorkout:createCustomWorkout,
            addCategory:addCategory,
            getCategoryList:getCategoryList,
            categoryRef:categoryRef
        };
        return service;


        function set(){



        }


        function createCustomWorkout(workout){
            return customWorkouts.$add(workout).then(function(ref){
                return  ref.key;
            });
        }

        function convertSounds(workout) {
            convertExerciseSounds(workout.exercises);
            convertExerciseSounds(workout.shuffledExercises);
        }

        function convertExerciseSounds(exercises) {
            _.map(exercises, function(exercise) {
                if (exercise.audio) {
                    exercise.audio = new buzz.sound(exercise.audio);
                }
            });
        }

        function playAudio(sound) {
            //sound.play();
        }

        /*Determinines if the right side of active element is near outside of viewport.
         If so, it will then activate scroll event and shift active element to
         the middle of the container. Executed every instance in which next
         workout is triggered */
        function autoScroll() {
            var container = angular.element(document.getElementsByClassName('playlist-container'));
            var activeElem = angular.element(document.getElementsByClassName('active'));
            var activeElemRight = activeElem[0].getBoundingClientRect().right;
            // current horizontal scroll position of the playlist container
            var position = container.scrollLeft();
            var width = container[0].getBoundingClientRect().width * (1.02); // 2% padding-left on the elem
            var scrollChange = width * 0.6;
            var windowWidth = $window.innerWidth;
            if (activeElemRight > (windowWidth * 0.8)) {
                container.scrollLeft(position += scrollChange, 1000);
            }
        }

        /*For Admin */
        function addCategory(category){

            /*Need to see later*/
            //checkIfCatExists(category.name).then(function(response){
            //
            //    console.log(response);
            //    if(!response)
            //    {
            //        categoryRef.push(category);
            //       // cachecategoryList.push(category.name);
            //    }
            //});

            if(category!== undefined && category.name.length > 0)
            {

                categoryRef.push(category);
            }

        }

        function getCategoryList()
        {
                var dbcategoryList = [];
                 var deferred = $q.defer();
                 var data = $firebaseObject(categoryRef);

                 data.$loaded(function(data) {

                     angular.forEach(data,function(value,key){
                         dbcategoryList.push(value);
                     })
                     deferred.resolve(dbcategoryList);
                 });


                // categoryRef.on("value", function(snapshot) {
                // angular.forEach(snapshot.val(), function (value, key) {
                //     dbcategoryList.push(value.name);
                // });
                // deferred.resolve(dbcategoryList);
                //},function (error) {
                //    console.log("Error: " + error.code);
                //});
                return deferred.promise;
        }

        function catExistsCallback(catId, exists) {
            if (exists) {
                //alert('cat ' + catId + ' exists!');
                return true;
            } else {
                //alert('user ' + catId + ' does not exist!');
                return false;
            }
        }

        // Tests to see if /catogery is exist or not.
        function checkIfCatExists(catId) {
            var deferred = $q.defer();
            //categoryRef.once("value", function(snapshot) {
            //    angular.forEach(snapshot.val(), function (value, key) {
            //        var exists = (value.name === catId);
            //        if (exists) {
            //            isExist = true;
            //        }
            //    });
            //    deferred.resolve(isExist);
            //});
            var data = $firebaseObject(categoryRef);
            data.$loaded(function(data) {

                angular.forEach(data,function(value,key){
                    var exists = (value.name === catId);
                    if (exists) {
                        isExist = true;
                    }
                })
                deferred.resolve(isExist);
            });

            return deferred.promise;
        }


    }

})();