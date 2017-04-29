/**
 * Created by ic019321 on 12/20/2016.
 */
(function () {
    'use strict';
    angular.module("SlimLady").controller('ProgressCtrl', ProgressCtrl);


    function ProgressCtrl($scope,Api, User,Util,$timeout) {

        var vm = this;

        init();

        vm.userData = {};
        vm.userWorkouts = {};
        function init() {
            User.check().then(function (data) {

                vm.userData = data;
                /*created for dummy purpose*/
                //data.workoutLog = [
                // {
                //    $$hashKey: "object:2289",
                //    calories: 36,
                //    connected_apps: "Sworkit",
                //    created_on: "2016-05-10 09:13:31",
                //    device_type: "iPhone8,1",
                //    exercise_list:[{"exercise":"ReachUps","length":18},{"exercise":"Reach Ups","length":30},{"exercise":"Lateral Pillar Bridge","length":30},{"exercise":"Plank","length":30},{"exercise":"Twisting Crunches","length":30}],
                //    heart_rate: "{average:false,peak:false}",
                //    minutes_completed: 5,
                //    sworkit_id: 1,
                //    sync_lastUpdated: 1462851815921,
                //    type: "coreExercise",
                //    utc_created: "2016-05-10 03:43:31"
                //},
                //{
                //    $$hashKey: "object:2289",
                //    calories: 36,
                //    connected_apps: "Sworkit",
                //    created_on: "2016-06-10 09:13:31",
                //    device_type: "iPhone8,1",
                //    exercise_list: [{"exercise":"Single Leg Hamstring","length":30},{"exercise":"Seated Hamstring Stretch","length":30},{"exercise":"Arm Circles","length":30},{"exercise":"Ankle on the Knee","length":30},{"exercise":"Bending Windmill Stretch","length":30},{"exercise":"Hurdlers Stretch","length":30},{"exercise":"Knee to Chest Stretch","length":30},{"exercise":"Lower Back Stretch","length":30},{"exercise":"Abdominal Stretch","length":30},{"exercise":"Calf Stretch","length":30}],
                //    heart_rate: "{average:false,peak:false}",
                //    minutes_completed: 5,
                //    sworkit_id: 1,
                //    sync_lastUpdated: 1462851815921,
                //    type: "coreExercise",
                //    utc_created: "2016-05-10 03:43:31"
                //}
                //];

                vm.userWorkouts = data.workoutlog;

                vm.stats = {
                    all:{},
                    monthly:{},
                    weekly:{},
                    daily:{}
                };



                var tabs = document.getElementsByClassName('tabs-custom')[0];

                $timeout(function () {
                    //get the width of the window
                    var windowWidth = window.innerWidth;

                    initializeTabs(windowWidth,vm.tabs.length);

                    $(window).resize(function () {
                        tabs.style.left = 0 + 'px';
                        windowWidth = window.innerWidth;

                        initializeTabs(windowWidth,vm.tabs.length);

                    });

                }, 0);

                getProgressInfo(vm.userWorkouts);
                getDailyInfo(vm.userWorkouts);
                getWeeklyInfo(vm.userWorkouts);
                getMonthlyInfo(vm.userWorkouts);
                updateChartOptions();
            });
            vm.tabs = [
                {
                    name: 'All Time',
                    link:'player.progress.all'
                }, {
                    name: 'Today',
                    link:'player.progress.daily'
                }, {
                    name: 'This Week',
                    link:'player.progress.weekly'
                }, {
                    name: 'Past 30 Days',
                    link:'player.progress.monthly'
                }, {
                    name: 'Workout Log',
                    link:'player.progress.workout-log'
                }];
        }

        function initializeTabs(windowWidth,length){

            //assign the width of each tab to be windowWidth/3
            $(".tab").css('width', windowWidth/3);
            var totalTabsWidth = length * (windowWidth/3) + 1;
            $(".tabs-custom").css('width',totalTabsWidth);

            initializeTabsSwipe(windowWidth,totalTabsWidth);
            checkTabsSwipeStatus(windowWidth, totalTabsWidth);

        }

        function initializeTabsSwipe(windowWidth,totalTabsWidth){

            //swipe handler
            var left = 0;

            $('.tabs-custom').swipe({
                swipeStatus: function (event, phase, direction, distance, duration, fingers, fingerData, currentDirection) {
                    if (phase == 'move') {
                        if (currentDirection == 'left') {
                            if (left > -(totalTabsWidth - windowWidth) - 2)
                                left -= distance;
                        } else {
                            if (left < 0)
                                left += distance;
                        }

                        if (left > 0)
                            left = 0;
                        else if (left < -(totalTabsWidth - windowWidth) - 2)
                            left = -(totalTabsWidth - windowWidth) - 2;

                        $(".tabs-custom").css('left', left);
                    }
                }
            });

        };

        function checkTabsSwipeStatus(windowWidth, totalTabsWidth){

            //checking if window width is less than tabs width
            if (windowWidth < totalTabsWidth) {
                //then enable the swipe
                enableTabsSwipe();
            } else {
                //then disable the swipe
                disableTabsSwipe();
            }

        };

        function enableTabsSwipe(){

            //function to enable the swipe
            function enableTabsSwipe() {
                $('.tabs-custom').swipe("enable");
            };

            //function to disable the swipe
            function disableTabsSwipe() {
                $('.tabs-custom').swipe("disable");
            };

        }


        function getProgressInfo(workouts){

            var totalTime = 0;
            var workoutCount = 0;
            var calories = 0;
            vm.stats.all.data = [{
                "key":"Quantity",
                "bar":true,
                "values":[]
            }];
            if(workouts)
            {

                vm.stats.all.workouts = true;
                _.each(workouts,function(workout){
                    totalTime += workout.minutes_completed;
                    workoutCount +=1;
                    calories += workout.calories;
                    vm.stats.all.data[0]["values"].push([moment(workout.created_on).format('x'),workout.minutes_completed]);
                });
                if (workoutCount > 0) {
                    vm.stats.all.avgDuration = Util.minTommss(totalTime/workoutCount);
                    vm.stats.all.sessions = workoutCount;
                    vm.stats.all.totalTime = Util.minToHHmm(totalTime);
                    vm.stats.all.calories = calories;
                }else{
                    console.log("You do not have workoutlog");
                }

            }else
            {
                console.log("You have no workout logs");
            }
        };

        function getDailyInfo(workouts){
            var today = moment();
            var totalTime = 0;
            var workoutCount = 0;
            var calories = 0;
            vm.stats.daily.data = [{
                "key":"Quantity",
                "bar":true,
                "values":[]
            }];
            _.each(workouts,function(workout){

                var createdDate = moment(workout.sync_lastUpdated);

                // Determine if workout from today
                if (!workout.sync_isDeleted && workout.sync_lastUpdated && moment(createdDate).isSame(today, 'day')) {

                    vm.stats.daily.workouts= true;
                    totalTime += workout.minutes_completed;
                    workoutCount +=1;
                    calories += workout.calories;
                    vm.stats.daily.data[0]["values"].push([moment(workout.created_on).format('x'), workout.minutes_completed])
                }
                if (workoutCount > 0) {
                    vm.stats.daily.avgDuration = Util.minTommss(totalTime / workoutCount);
                    vm.stats.daily.sessions = workoutCount;
                    vm.stats.daily.totalTime = Util.minToHHmm(totalTime);
                    vm.stats.daily.calories = calories;
                } else {
                    console.log("You have no workouts for today");
                }
            });
        };


        function getWeeklyInfo(workouts){
            var today = moment();
            var weekAgo = today.subtract(7,'days');
            var totalTime = 0;
            var workoutCount = 0;
            var calories = 0;
            vm.stats.weekly.data = [{
                "key":"Quantity",
                "bar":true,
                "values":[]
            }];
            _.each(workouts,function(workout){

                var createdDate = moment(workout.sync_lastUpdated);

                // Determine if workout from today
                if (!workout.sync_isDeleted && workout.sync_lastUpdated && moment(createdDate).isSameOrAfter(weekAgo)) {

                    vm.stats.weekly.workouts= true;
                    totalTime += workout.minutes_completed;
                    workoutCount +=1;
                    calories += workout.calories;
                    vm.stats.weekly.data[0]["values"].push([moment(workout.created_on).format('x'), workout.minutes_completed])
                }
                if (workoutCount > 0) {
                    vm.stats.weekly.avgDuration = Util.minTommss(totalTime / workoutCount);
                    vm.stats.weekly.sessions = workoutCount;
                    vm.stats.weekly.totalTime = Util.minToHHmm(totalTime);
                    vm.stats.weekly.calories = calories;
                } else {
                    console.log("You have no workouts for week");
                }


            });
        }

        function getMonthlyInfo(workouts) {
            var today = moment();
            var monthAgo = today.subtract(1, 'month');

            if (workouts) {
                var totalTime = 0;
                var workoutCount = 0;
                var calories = 0;
                vm.stats.monthly.data = [
                    {
                        "key": "Quantity",
                        "bar": true,
                        "values": []
                    }];

                _.each(workouts, function (workout) {
                    var createdDate = moment(workout.sync_lastUpdated);

                    // Determines if workouts are from past month
                    if (!workout.sync_isDeleted && workout.sync_lastUpdated && moment(createdDate).isSameOrAfter(monthAgo)) {
                        vm.stats.monthly.workouts = true;
                        totalTime += workout.minutes_completed;
                        workoutCount += 1;
                        calories += workout.calories;
                        vm.stats.monthly.data[0]["values"].push([moment(workout.created_on).format('x'), workout.minutes_completed]);
                    }
                });

                if (workoutCount > 0) {
                    vm.stats.monthly.avgDuration = Util.minTommss(totalTime / workoutCount);
                    vm.stats.monthly.sessions = workoutCount;
                    vm.stats.monthly.totalTime = Util.minToHHmm(totalTime);
                    vm.stats.monthly.calories = calories;
                } else {
                    console.log("You have no workouts in the past month");
                }
            } else {
                console.log("You have no workouts in for this month");
            }
        };

        function updateChartOptions() {
            vm.options = {
                chart: {
                    type: 'historicalBarChart',
                    height: 450,
                    margin: {
                        top: 20,
                        right: 20,
                        bottom: 65,
                        left: 50
                    },
                    x: function (d) {
                        return d[0];
                    },
                    y: function (d) {
                        return d[1];
                    },
                    showValues: true,
                    valueFormat: function (d) {
                        return d3.format(',.1f')(d);
                    },
                    duration: 100,
                    xAxis: {
                        axisLabel: 'Date',
                        tickFormat: function (d) {
                            return moment(d).format('MMM D YYYY');
                        },
                        rotateLabels: 30,
                        showMaxMin: false
                    },
                    yAxis: {
                        axisLabel: 'Minutes',
                        axisLabelDistance: -10,
                        tickFormat: function(d){
                            return d3.format(',')(d);
                        }
                    },
                    tooltip: {
                        keyFormatter: function (d){
                            return moment(parseInt(d)).format('MMM D, h:mma');
                        }
                    },
                    zoom: {
                        enabled: true,
                        scaleExtent: [1, 10],
                        useFixedDomain: false,
                        useNiceScale: false,
                        horizontalOff: false,
                        verticalOff: true,
                        unzoomEventType: 'dblclick.zoom'
                    }
                }
            };
        }





    }

})();