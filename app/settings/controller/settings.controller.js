/**
 * Created by Z003FEWY on 2/17/2017.
 */
(function(){

    'use strict';
    angular.module('SlimLady')
        .controller('SettingsCtrl',SettingsCtrl);


    function SettingsCtrl(User,$rootScope,$scope,$firebaseObject, FIREBASE_URL, $firebaseAuth,$q){

        var vm = this;
        vm.LBS2KG = 0.453592;
        vm.KG2LBS = 2.20462;
        vm.DAYS = 7;
        init();

        var user,ref,auth,userRef,authData;
        function init()
        {
            vm.calorieData = {
                weight:0,
                weightType:"kgs"
            };
            vm.personalGoalData = {
                dailyGoal:15,
                weeklyGoal:75
            };
            vm.weightCount = "";
            vm.dailyGoalCount = "";
            vm.weeklyGoalCount = "";
            vm.weightCopy = "";
            vm.dailyGoalCopy = 0;
            vm.weeklyGoalCopy = 0;
            vm.selects = [{unitValue:"kgs"},{unitValue:"lbs"}];
            vm.calorieData.unit = vm.selects[0].unitValue;

            ref = firebase.database().ref();
            auth = $firebaseAuth(firebase.auth());
            userRef = ref.child('users');
            authData =auth.$getAuth();

            user = userRef.child(authData.uid);
            /*Getting UserGoals & Settings if exist*/
            var userGoalsRef = user.child("userGoals")
            var userGoalData = $firebaseObject(userGoalsRef);

            var userSettingsRef = user.child("userSettings")
            var userSettingData = $firebaseObject(userSettingsRef);

            getUserGoals(userGoalData);
            getUserSettings(userSettingData);


        }
        function getUserGoals(goalData){

            var deferred = $q.defer();
            goalData.$loaded(function(data){

                vm.dailyGoalCopy =  vm.personalGoalData.dailyGoal = data.dailyGoal.sync_value;
                vm.weeklyGoalCopy = vm.personalGoalData.weeklyGoal = data.weeklyGoal.sync_value;
                deferred.resolve(vm.personalGoalData);
            });

        }

        function getUserSettings(settingData){

            var deferred = $q.defer();
            settingData.$loaded(function(data){

                vm.calorieData.weight = data.weight.sync_value;

                if(data.weightType.sync_value.length>0)
                {
                    vm.calorieData.unit = data.weightType.sync_value;
                }
                else{
                    vm.calorieData.unit = vm.selects[0].unitValue;
                }

                deferred.resolve(vm.calorieData);
            });

        }

        vm.changeWeight = function(){

            if(vm.calorieData.weight){
                vm.weightCount = vm.calorieData.weight.toString();
                if(vm.weightCount.length <=4)
                {
                    vm.weightCopy = vm.weightCount;
                }
                else
                {
                    vm.calorieData.weight = parseInt(vm.weightCopy);
                }
            }
        }
        vm.changeUnit = function(){

            if(vm.calorieData.unit == "lbs")
            {
                vm.calorieData.weightType =  vm.calorieData.unit;
                vm.calorieData.weight =  Math.round(vm.calorieData.weight * vm.KG2LBS);
            }
            else
            {
                vm.calorieData.weightType = vm.calorieData.unit;
                vm.calorieData.weight =   Math.round(vm.calorieData.weight * vm.LBS2KG);
            }

        }
        vm.changeDailyGoal = function(){

            if(vm.personalGoalData.dailyGoal){
                vm.dailyGoalCount = vm.personalGoalData.dailyGoal + '';
                if(vm.dailyGoalCount){
                    vm.weeklyGoalCount = vm.dailyGoalCount*vm.DAYS + '';
                    vm.weeklyGoalCopy = parseInt(vm.weeklyGoalCount);
                    vm.personalGoalData.weeklyGoal = (vm.weeklyGoalCopy);
                }
                if(vm.dailyGoalCount.length <=4)
                {
                    vm.dailyGoalCopy = parseInt(vm.dailyGoalCount);
                    vm.personalGoalData.dailyGoal = (vm.dailyGoalCopy);
                }
                vm.personalGoalData.dailyGoal = (vm.dailyGoalCopy);
            }
            else
            {
                vm.personalGoalData.weeklyGoal = 0;

            }
        }

        vm.changeWeeklyGoal = function(){

            if(vm.personalGoalData.weeklyGoal){
                vm.weeklyGoalCount = vm.personalGoalData.weeklyGoal + '';
                if(vm.weeklyGoalCount){
                    vm.dailyGoalCount = vm.weeklyGoalCount/vm.DAYS + '';
                    vm.dailyGoalCopy = parseInt(vm.dailyGoalCount);
                    vm.personalGoalData.dailyGoal = (vm.dailyGoalCopy);
                }
                 if(vm.weeklyGoalCount.length <=4){
                    vm.weeklyGoalCopy = parseInt(vm.weeklyGoalCount);
                    vm.personalGoalData.weeklyGoal = (vm.weeklyGoalCopy);
                }
                vm.personalGoalData.weeklyGoal = (vm.weeklyGoalCopy);
            }
            else
            {
                vm.personalGoalData.dailyGoal = 0;
            }
        }

        vm.saveData = function(){

            PersonalData.GetUserSettings.weight =  vm.calorieData.weight;
            PersonalData.GetUserSettings.weightType = vm.calorieData.weightType;

            PersonalData.GetUserGoals.dailyGoal = vm.personalGoalData.dailyGoal;
            PersonalData.GetUserGoals.weeklyGoal = vm.personalGoalData.weeklyGoal;

            /*update into database*/
            User.setupSetting(user,PersonalData.GetUserSettings,PersonalData.GetUserGoals);


        }

    }

})();