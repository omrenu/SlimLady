///**
// * Created by Z003FEWY on 2/7/2017.
// */
///**
// * Created by apoorvaagrawal on 17/11/16.
// */
//(function() {
//    'use strict';
//
//    angular.module('SlimLady')
//        .constant('API_URL', 'https://sworkit-api.herokuapp.com/v1/')
//        // User for Development Mode
//        // .constant('API_URL', 'http://localhost:3000/v1/')
//        .constant('CUSTOM_API_URL', 'http://sworkitapi.herokuapp.com/')
//        .factory('Api', Api);
//
//    function Api($http, API_URL, $q) {
//
//        var data = {};
//
//        var service = {
//            workouts: {
//                get: getWorkouts,
//                getWithExercises: getWorkoutWithExercises,
//                getDashboard: getDashboard
//            },
//            exercises: {
//                get: getExercises,
//                getWithCategories: getExercisesWithCategories,
//                getWithOrder: getWithOrder
//            },
//            categories: {
//                get: getCategories
//            },
//            audio: {
//                get: getAudio
//            },
//            clearCache: clearCache
//        };
//
//        return service;
//
//
//        function getWorkouts(id) {
//            return $http.get('https://sworkit-api.herokuapp.com/v1/' + 'workouts/' + id).then(
//                function(response) {
//                    return $q.when(response.data);
//                },
//                function(error) {
//                    console.log(error);
//                    return $q.when(error);
//                });
//        }
//
//        function getWorkoutWithExercises(name, exercises) {
//            var data = {name: name, exercises: exercises};
//            return $http.post('https://sworkit-api.herokuapp.com/v1/' + 'workout-with-exercises', data).then(
//                function(response) {
//                    return $q.when(response.data);
//                },
//                function(error) {
//                    console.log(error);
//                    return $q.when(error);
//                });
//        }
//
//        function getDashboard(uid) {
//            var url = ('https://sworkit-api.herokuapp.com/v1/' + 'dashboard/' + uid + "?random=" + new Date().getTime() );
//            if (data.dashboard) {
//                return $q.when(data.dashboard);
//            } else {
//                return $http.get(url).then(function(response) {
//                        data.dashboard = response.data;
//                        return $q.when(data.dashboard);
//                    },
//                    function(error) {
//                        console.log(error);
//                        return $q.when(error);
//                    });
//            }
//        }
//
//        function getWithOrder(workout) {
//
//            return workout.exercises;
//
//        }
//
//        function getExercises() {
//            return $http.get('https://sworkit-api.herokuapp.com/v1/' + 'exercises/').then(
//                function(response) {
//                    return $q.when(response.data);
//                },
//                function(error) {
//                    console.log(error);
//                    return $q.when(error);
//                });
//        }
//
//        function getExercisesWithCategories() {
//            return $http.get('https://sworkit-api.herokuapp.com/v1/' + 'exercises?organize_by=category').then(
//                function(response) {
//                    return $q.when(response.data);
//                },
//                function(error) {
//                    console.log(error);
//                    return $q.when(error);
//                });
//        }
//
//        function getCategories(id) {
//            return $http.get('https://sworkit-api.herokuapp.com/v1/' + 'categories/' + id).then(
//                function(response) {
//                    return $q.when(response.data);
//                },
//                function(error) {
//                    console.log(error);
//                    return $q.when(error);
//                });
//        }
//
//        function getAudio(name) {
//            return new buzz.sound('/assets/audio/' + name + '.mp3');
//        }
//
//        function clearCache() {
//            data = {};
//        }
//
//    }
//
//})();



/**
* Created by Z003FEWY on 2/7/2017.
*/
/**
* Created by apoorvaagrawal on 17/11/16.
*/
(function() {
    'use strict';

    angular.module('SlimLady')
        .constant('API_URL', 'https://sworkit-api.herokuapp.com/v1/')
        // User for Development Mode
        // .constant('API_URL', 'http://localhost:3000/v1/')
        .constant('CUSTOM_API_URL', 'http://sworkitapi.herokuapp.com/')
        .factory('Api', Api);

    function Api($http, API_URL, $q) {

        var data = {};

        var service = {
            workouts: {
                get: getWorkouts,
                getWithExercises: getWorkoutWithExercises,
                getDashboard: getDashboard
            },
            exercises: {
                get: getExercises,
                getWithCategories: getExercisesWithCategories,
                getWithOrder: getWithOrder
            },
            categories: {
                get: getCategories,
                getWorkoutsById:getWorkouts
            },
            audio: {
                get: getAudio
            },
            clearCache: clearCache
        };

        return service;


        function getWorkouts(id) {
            return $http.get('/admin/categories/' + id).then(
                function(response) {
                    return $q.when(response.data);
                },
                function(error) {
                    console.log(error);
                    return $q.when(error);
                });
        }

        function getWorkoutWithExercises(name, exercises) {
            var data = {name: name, exercises: exercises};
            return $http.post('https://sworkit-api.herokuapp.com/v1/' + 'workout-with-exercises', data).then(
                function(response) {
                    return $q.when(response.data);
                },
                function(error) {
                    console.log(error);
                    return $q.when(error);
                });
        }

        function getDashboard(uid) {
            var url = ('https://sworkit-api.herokuapp.com/v1/' + 'dashboard/' + uid + "?random=" + new Date().getTime() );
            if (data.dashboard) {
                return $q.when(data.dashboard);
            } else {
                return $http.get(url).then(function(response) {
                        data.dashboard = response.data;
                        return $q.when(data.dashboard);
                    },
                    function(error) {
                        console.log(error);
                        return $q.when(error);
                    });
            }
        }

        function getWithOrder(workout) {

            return workout.exercises;

        }

        function getExercises() {
            return $http.get('https://sworkit-api.herokuapp.com/v1/' + 'exercises/').then(
                function(response) {
                    return $q.when(response.data);
                },
                function(error) {
                    console.log(error);
                    return $q.when(error);
                });
        }

        function getExercisesWithCategories() {
            return $http.get('https://sworkit-api.herokuapp.com/v1/' + 'exercises?organize_by=category').then(
                function(response) {
                    return $q.when(response.data);
                },
                function(error) {
                    console.log(error);
                    return $q.when(error);
                });
        }

        function getCategories() {
            return $http.get('/admin/categories').then(
                function(response) {
                    return $q.when(response.data);
                },
                function(error) {
                    console.log(error);
                    return $q.when(error);
                });
        }

        function getAudio(name) {
            return new buzz.sound('/assets/audio/' + name + '.mp3');
        }

        function clearCache() {
            data = {};
        }

    }

})();
