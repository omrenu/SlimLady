/**
 * Created by Z003FEWY on 2/6/2017.
 */
/**
 * Created by ic019321 on 12/12/2016.
 */
angular.module('SlimLady')
    .config(function ($httpProvider) {
        $httpProvider.defaults.cache = true;
    })
    .run(function ($rootScope,$state) {
        $rootScope.catCount = 0;
        $rootScope.workoutTitle = "";
        $rootScope.loggedIn = false;
        $rootScope.adminLogin = false;
        $rootScope.loading = true;
        $rootScope.hideForBeta = true;
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
            if (toState.name === 'player.categories.category') {
                console.log("called"+toState.name);
                $state.go(toState.name);
            }
            if (toState.name === 'player.home') {
                /* scope Pointer */
                var appElement = document.querySelector('[ng-app=SlimLady]');
                var scope = angular.element(appElement).scope('[ng-controller=AuthCtrl]');
                scope.$emit("titleChange","");
            }
        });
    });
