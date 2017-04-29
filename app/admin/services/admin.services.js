/**
 * Created by apoorvaagrawal on 24/02/17.
 */

(function() {

    'use strict';
    angular.module('SlimLady').
        factory('AdminFactory',AdminFactory);

    function AdminFactory($http,$q,$firebaseArray,$firebaseObject, FIREBASE_URL, $firebaseAuth) {

        var service = {


            setFirebase :{

                setFirebase:setFirebase

            },
            categories : {
                catSet:setCategories
            },
            workouts:{
                workSet : setWorkouts
            },
            excercises:{
                exSet:setExcercise
            }

        };
        return service;

        function setFirebase(){

        }

        function setCategories(catData){

            //return $http.post('/api/catRows',catData).success(function(data){
            //    console.log("catogery data",data);
            //});

            //create promise
            var deferred = $q.defer();

            //create post
            $http({

                method:'POST',
                url:'/admin/addCatgeory',
                data:catData
            }).then(function(response){

                deferred.resolve(response);

            },function(error){

                deferred.reject(error);

            });

            return  deferred.promise;

        }
        function setWorkouts(catId,workoutRow){

            //return $http.post('/api/catRows/:catId/workouts', workoutRow).success(function(data){
            //    console.log("workout data",data);
            //});

            //create promise
            var deferred = $q.defer();

            //create post
            $http({

                method:'POST',
                url:'/admin/addCatgeory/:catId/addWorkout',
                data:{'postData':workoutRow,'param':catId}
            }).then(function(response){

                deferred.resolve(response);

            },function(error){

                deferred.reject(error);

            });

            return  deferred.promise;

        }

        function setExcercise(catId,workoutId,excerciseData){

            //return $http.post('/addCatgeory/:catId/addWorkout/:workoutId/addExcercise', excerciseData).success(function(data){
            //    console.log("posted data",data);
            //});


            //return $http.post('/api/catRows/:catId/workouts', workoutRow).success(function(data){
            //    console.log("workout data",data);
            //});

            //create promise
            var deferred = $q.defer();

            //create post
            $http({

                method:'POST',
                url:'/admin/addCatgeory/:catId/addWorkout/:workoutId/addExcercise',
                data:excerciseData
            }).then(function(response){

                deferred.resolve(response);

            },function(error){

                deferred.reject(error);

            });

            return  deferred.promise;


        }

    }
})();/**
 * Created by apoorvaagrawal on 24/02/17.
 */
