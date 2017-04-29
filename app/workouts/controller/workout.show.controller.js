///**
// * Created by apoorvaagrawal on 16/11/16.
// */
//(function () {
//    'use strict';
//    angular.module('SlimLady')
//        .value('duScrollDuration', 2000)
//        .value('duScrollOffset', 30)
//        .controller('WorkoutShowCtrl', WorkoutShowCtrl);
//
//    function WorkoutShowCtrl($rootScope,$scope, $state, $stateParams, Api,Util,$window) {
//        var vm = this;
//
//        vm.workoutData = {};
//
//        getWorkOut();
//
//        function getWorkOut()
//        {
//            $rootScope.loading = true;
//
//            if($state.current.data && $state.current.data.custom) {
//
//                Api.workouts.getWithExercises($stateParams.workoutId,$stateParams.excercises).then(function(workout){
//
//                    vm.workoutData.chosenWorkout = workout;
//                    $rootScope.loading = false;
//                    init();
//                })
//            } else{
//                Api.workouts.get($stateParams.workoutId).then(function (workout) {
//                    vm.workoutData.chosenWorkout = workout;
//                    $rootScope.loading = false;
//                    init();
//                });
//            }
//
//        }
//        vm.modalVidPlaying = false;
//
//        vm.playVideoModal = playVideoModal;
//        vm.prevVid = prevVid;
//        vm.nextVid = nextVid;
//        vm.closeModal = closeModal;
//
//        var nextExercise;
//        var prevExercise;
//
//        function playVideoModal(exercise) {
//            vm.currentVid = document.getElementsByTagName('video')[0];
//            vm.currentVid.src = Util.sdVidLink(exercise.video);
//            console.log(vm.currentVid.src);
//
//            var currentIndex = vm.currentExercises.map(function (exercise) {
//                return exercise.id;
//            }).indexOf(exercise.id);
//
//            nextExercise = vm.currentExercises[currentIndex + 1];
//            if (currentIndex > 0) {
//                prevExercise = vm.currentExercises[currentIndex - 1];
//            }
//
//            vm.modalExerciseName = exercise.name;
//            vm.currentVid.setAttribute('poster', exercise.image);
//            vm.modalVidPlaying = true;
//            vm.currentVid.load();
//            vm.currentVid.play();
//        }
//
//        function prevVid() {
//            if (prevExercise) {
//                playVideoModal(prevExercise);
//            } else {
//                console.log("You are on the first exercise");
//            }
//        }
//
//        function nextVid() {
//            playVideoModal(nextExercise);
//        }
//
//        function closeModal() {
//            vm.modalVidPlaying = false;
//        }
//
//        function init() {
//
//
//            console.log('workout data', vm.workoutData);
//            vm.workoutData.workoutId = $stateParams.workoutId;
//            vm.workoutData.workoutName = vm.workoutData.chosenWorkout.prettyName ? vm.workoutData.chosenWorkout.prettyName : vm.workoutData.chosenWorkout.name;
//            vm.workoutData.currentWorkout = vm.workoutData.chosenWorkout;
//            vm.currentExercises = Api.exercises.getWithOrder(vm.workoutData.currentWorkout);
//            $window.localStorage['workoutInfo'] = angular.toJson(vm.workoutData, true);
//            $scope.$emit('titleChange',vm.workoutData.workoutName); // going up!
//
//        }
//
//
//    }
//
//})();
//













///**
// * Created by apoorvaagrawal on 16/11/16.
// */
(function () {
    'use strict';
    angular.module('SlimLady')
        .value('duScrollDuration', 2000)
        .value('duScrollOffset', 30)
        .controller('WorkoutShowCtrl', WorkoutShowCtrl);

    function WorkoutShowCtrl($rootScope,$scope, $state, $stateParams, Api,Util,$window) {
        var vm = this;

        vm.workoutData = {};

        vm.catName = $stateParams.workoutId;
        console.log("catName",vm.catName);
        getWorkOut();

        function getWorkOut()
        {
            $rootScope.loading = true;

            if($state.current.data && $state.current.data.custom) {

                Api.workouts.getWithExercises($stateParams.workoutId,$stateParams.excercises).then(function(workout){

                    vm.workoutData.chosenWorkout = workout;
                    $rootScope.loading = false;
                    init();
                })
            } else{
                Api.workouts.get($stateParams.workoutId).then(function (workout) {
                    vm.workoutData.chosenWorkout = workout;
                    $rootScope.loading = false;
                    init();
                });
            }

            //Api.categories.getWorkoutsById(vm.catName).then(function (workout) {
            //    vm.workoutData.chosenWorkout = workout;
            //    $rootScope.loading = false;
            //    init();
            //});


        }
        vm.modalVidPlaying = false;

        vm.playVideoModal = playVideoModal;
        vm.prevVid = prevVid;
        vm.nextVid = nextVid;
        vm.closeModal = closeModal;

        var nextExercise;
        var prevExercise;

        function playVideoModal(exercise) {
            vm.currentVid = document.getElementsByTagName('video')[0];
            vm.currentVid.src = Util.sdVidLink(exercise.video);
            console.log(vm.currentVid.src);

            var currentIndex = vm.currentExercises.map(function (exercise) {
                return exercise.id;
            }).indexOf(exercise.id);

            nextExercise = vm.currentExercises[currentIndex + 1];
            if (currentIndex > 0) {
                prevExercise = vm.currentExercises[currentIndex - 1];
            }

            vm.modalExerciseName = exercise.name;
            vm.currentVid.setAttribute('poster', exercise.image);
            vm.modalVidPlaying = true;
            vm.currentVid.load();
            vm.currentVid.play();
        }

        function prevVid() {
            if (prevExercise) {
                playVideoModal(prevExercise);
            } else {
                console.log("You are on the first exercise");
            }
        }

        function nextVid() {
            playVideoModal(nextExercise);
        }

        function closeModal() {
            vm.modalVidPlaying = false;
        }

        function init() {


            console.log('workout data', vm.workoutData);
            vm.workoutData.workoutId = $stateParams.workoutId;
            vm.workoutData.workoutName = vm.workoutData.chosenWorkout.prettyName ? vm.workoutData.chosenWorkout.prettyName : vm.workoutData.chosenWorkout.catName;
            vm.workoutData.currentWorkout = vm.workoutData.chosenWorkout;
            vm.currentExercises = vm.workoutData.chosenWorkout.workouts;
            $window.localStorage['workoutInfo'] = angular.toJson(vm.workoutData, true);
            $scope.$emit('titleChange',vm.workoutData.workoutName); // going up!

        }


    }

})();