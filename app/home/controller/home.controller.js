/**
 * Created by Z003FEWY on 2/7/2017.
 */
/**
 * Created by apoorvaagrawal on 16/11/16.
 */
(function () {
    'use strict';
    angular.module('SlimLady')
        .controller('HomeCtrl', HomeCtrl);

    function HomeCtrl(User,Api,$state,$scope, $rootScope, $timeout) {
        var vm = this;

        $scope.$emit('titleChange',"");
        init();

        function init() {
            $rootScope.loading = true;
            User.check().then(function (user) {
                if (user) {
                    vm.user = user;
                    $rootScope.loggedIn = true;
                    $rootScope.adminLogin = (vm.user.$id === "7yTtvWr0avZIriTLMuib1k2sd7D2")?true:false
                    getDashboard("google:103677179651986559252");
                }
            });
            //getDashboard("google:103677179651986559252");
        }

        function getDashboard(uid) {
            //Api.workouts.getDashboard(uid).then(function (resp) {
            //    vm.dashboard = {
            //        categories: resp.categories
            //    };
            //    $timeout(function () {
            //        $rootScope.loading = false;
            //    }, 500);
            //});

            Api.categories.get().then(function (resp) {
                vm.dashboard = {
                    categories: resp
                };
                $timeout(function () {
                    $rootScope.loading = false;
                }, 500);
            });


        }

        // function customWorkoutShow(workout) {
        //     console.log('custom workout:', workout);
        //     $state.go('player.workout.showCustom', {obj: workout });
        // }

        function setCustomWorkout(workout) {
            WorkoutService.setCustomWorkout(workout);
            $state.go('player.workout.showCustom');
        }

        function next(id, elem) {
            var forwardIcon = angular.element(document.getElementById(elem + '-forward'));
            var backIcon = angular.element(document.getElementById(elem + '-back'));
            backIcon.removeClass('disabled');

            var container = angular.element(document.getElementById(id));
            var containerLoc = container[0];
            var containerWidth = (containerLoc.offsetWidth * 1.026);
            var scrollWidth = containerLoc.scrollWidth;
            var scrollPosition = containerLoc.scrollLeft;
            var totalScroll = scrollPosition + containerWidth;
            container.scrollLeft(totalScroll, 500);

            if (totalScroll + scrollPosition >= scrollWidth) {
                forwardIcon.addClass('disabled');
            }
        }

        function back(id, elem) {
            var forwardIcon = angular.element(document.getElementById(elem + '-forward'));
            var backIcon = angular.element(document.getElementById(elem + '-back'));
            if (forwardIcon.hasClass('disabled')) {
                forwardIcon.removeClass('disabled');
            }

            var container = angular.element(document.getElementById(id));
            var containerLoc = container[0];
            var containerWidth = (containerLoc.offsetWidth * 1.026);
            var scrollWidth = containerLoc.scrollWidth;
            var scrollPosition = containerLoc.scrollLeft;
            var totalScroll = scrollPosition - containerWidth;
            if (totalScroll < 0) {
                totalScroll = 0;
                backIcon.addClass('disabled');
            }
            container.scrollLeft(totalScroll, 500);
        }

    }

})();
