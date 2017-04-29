/**
 * Created by apoorvaagrawal on 13/11/16.
 */
(function(){

    'use strict';
    angular.module("SlimLady").config(Routes);

    Routes.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider'];


    function Routes($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){

        $stateProvider.
            state('auth',{
                url: '/',
                templateUrl: 'auth/views/auth.html',
                controller: 'AuthCtrl as auth'
            })
            .state('auth.signup', {
                templateUrl: 'auth/views/signup.html'
            })
            .state('auth.login', {
                templateUrl: 'auth/views/login.html'
            })
            .state('auth.emailsignup', {
                templateUrl: 'auth/views/email-signup.html'
            })
            .state('auth.resetpassword', {
                templateUrl: 'auth/views/reset-password.html'
            })
            .state('player', {
                abstract: true,
                templateUrl: 'player/views/player.html'
            })
            .state('player.home', {
                url: '/home',
                templateUrl: 'home/views/home.html',
                controller: 'HomeCtrl as home'
            })
            .state('player.menu', {
                url: '/menu',
                templateUrl: 'home/views/more.html'
            })
            .state('player.exercises', {
                url: '/exercises',
                templateUrl: 'excercises/views/excercises.html',
                controller: 'ExercisesCtrl as ex'
            })
            .state('player.categories', {
                abstract: true,
                url: '/categories',
                templateUrl: 'categories/views/categories.html'
            })
            .state('player.categories.category', {
                url: '/{categoryId}',
                templateUrl: 'categories/views/category.show.html',
                controller: 'CategoryCtrl as cat'
            })
            .state('player.workout', {
                abstract: true,
                url: '/workout',
                template: '<div ui-view></div>'
            })
            .state('player.progress', {
                url: '/progress:',
                controller: 'ProgressCtrl as progress',
                templateUrl: 'progress/views/progress.html'
            }).
            state('player.progress.all',{
                url: '/all:',
                templateUrl: 'progress/views/_progress_all.html'
            })
            .state('player.progress.daily', {
                url: '/daily',
                templateUrl: 'progress/views/_progress_daily.html'
            })

            .state('player.progress.weekly', {
                url: '/weekly',
                templateUrl: 'progress/views/_progress_weekly.html'
            })

            .state('player.progress.monthly', {
                url: '/monthly',
                templateUrl: 'progress/views/_progress_monthly.html'
            })
            .state('player.progress.workout-log', {
                url: '/workout-log',
                templateUrl: 'progress/views/_workout_log.html'
            })
            .state('player.user',{
                url:'/account',
                templateUrl:'users/views/account.html',
                controller:'UsersCtrl as usersCtrl'

            })
            .state('player.user.edit',{
                url:'/edit',
                templateUrl:'users/views/account_edit.html',
                controller:'UsersCtrl as usersCtrl'
            })
            .state('player.user.changePassword',{
                url:'/editPass',
                templateUrl:'users/views/change_password.html',
                controller:'UsersCtrl as usersCtrl'

            })
            .state('player.workout.play', {
                url: '/:workoutId/play',
                templateUrl: 'workouts/views/workout.play.html',
                controller: 'WorkoutCtrl as workout'
            }).
            state('player.custom',{
                url:'/workouts/custom/new',
                templateUrl: 'workouts/views/custom.new.html',
                controller: 'CustomWorkoutController as custom'
            })
            .state('player.workout.show', {
                url: '/:workoutId',
                controller: 'WorkoutShowCtrl as workoutShow',
                templateUrl: 'workouts/views/workout.show.html'
            }).
            state('player.workout.showCustom', {
                url: '/custom/:workoutId',
                controller: 'WorkoutShowCtrl as workoutShow',
                templateUrl: 'workouts/views/workout.show.html',
                params:{
                    excercises:null,
                    firebaseId:null
                },
                data:{custom:true}
            }).
            state('player.workout.add',{
                url:'/workout/add',
                controller:'WorkOutAddCtrl as workoutAdd',
                templateUrl:'workouts/views/workout.add.html'
            }).
            state('player.settings',{
                url:'/settings',
                controller:'SettingsCtrl as settings',
                templateUrl:'settings/views/setting.html'
            }).

            state('player.admin',{
                url:'/admin',
                abstract: true,
                template: '<div ui-view></div>'

            }).
            state('admin', {
                abstract: true,
                templateUrl: 'admin/views/admin.html'
            }).
            state('admin.main', {
                abstract: true,
                url: '/admin',
                template: '<div ui-view></div>'
            }).
            state('admin.main.editor',{
                url:'/editor',
                controller:'AdminCtrl as admin',
                templateUrl:'admin/views/admin.editor.html'
            });



        $urlRouterProvider.otherwise('/');

    }


})();