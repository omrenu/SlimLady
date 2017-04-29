/**
 * Created by apoorvaagrawal on 02/12/16.
 */
(function () {
    'use strict';
    angular.module('SlimLady')
        .value('duScrollDuration', 2000)
        .value('duScrollOffset', 30)
        .controller('WorkoutCtrl', WorkoutCtrl);

    function WorkoutCtrl($scope, $rootScope, $state, $stateParams, $timeout, $window, $document, $interval, Api, User, WorkoutService,EXERCISE_BUFFER,VIDEO_SECONDS,$firebaseArray) {
        var vm = this;

        $rootScope.workingOut = false;
        var uid = null;
        var logRef = null;

        // Getting user data/workout logs so we can store at end of workout
        User.check()
            .then(function (user) {
                vm.userData = user;
                vm.workoutLog = user.workoutLog;
                /**/
                //vm.advancedTiming = user.timingSettings;
                //vm.currentExercises = Api.exercises.getWithOrder(vm.currentWorkout, user);


                vm.currentExercises = vm.currentWorkout.workouts;
                //WorkoutService.convertSounds(vm.currentWorkout);

                // handleFirstFour();
                uid = user.$id;
                var ref = firebase.database().ref();
                logRef = ref.child('/users/'+ user.$id + '/workoutlog');
                //logRef = new Firebase(FIREBASE_URL + '/users/' + user.$id + '/workoutLog');
            });
        var workoutInfo = angular.fromJson($window.localStorage.getItem('workoutInfo'));
        vm.currentWorkout = workoutInfo.currentWorkout;
        vm.workoutId = workoutInfo.workoutId;
        vm.workoutName = workoutInfo.workoutName;

        vm.workoutFinished = false;
        vm.timeChosen = false;
        vm.totalTimeCompleted = 0;
        vm.totalTimeInMinutesRounded = 0;
        vm.totalCaloriesBurned = 0;
        vm.selectedPercentage = 0;
        vm.defaultToAdd = 5;
        vm.currentWorkout.isYogaSequence = vm.currentWorkout.isYogaSequence || false;
        vm.currentWorkout.activityWeight = vm.currentWorkout.activityWeight || 6;
        vm.break = vm.currentWorkout.break || {name: "30 Second Break", video: "https://s3.amazonaws.com/m.sworkit.com/assets/exercises/v2/videos/1080/restbreak.mp4", audio: "https://s3.amazonaws.com/m.sworkit.com/assets/exercises/Audio/EN/Break.mp3", image: "https://s3.amazonaws.com/m.sworkit.com/assets/exercises/v2/images/1080/first-frame/restbreak.jpg", videoTiming: false};
        vm.break.videoTiming = false;
        vm.showCustomIntervals = false;


        function handleFirstFour() {
            // getting first 4 exercises to preview for pre-workout screen
            var newArray = $.map(vm.currentExercises, function (value) {
                return [
                    [value]
                ];
            });
            vm.firstFour = [];
            for (var i = 0; i < 4; i++) {
                vm.firstFour.push(newArray[i]);
            }
        }

        vm.exercisesCompleted = 0;

        vm.showPlaylist = true;

        vm.playlistToggledByUser = false;

        vm.showMoreRSM = false;

        var vid = document.getElementById("exercise-vid");
        var videoTimeout;
        var videoPlaying = false;

        // initial volume - this will change with the $watch function below.
        // input type=range is automatically converted to a string in ng-model, so parseInt was needed
        if ($window.localStorage['volume']) {
            $scope.volume = JSON.parse($window.localStorage['volume']);
        } else {
            $scope.volume = 80;
        }

        $scope.$watch('volume', function (newValue) {
            $scope.volume = parseInt(newValue);
            $window.localStorage['volume'] = angular.toJson(newValue, true);
            setVolume(newValue);
        });

        vm.sounds = {
            beginAudio: Api.audio.get('begin'),
            changeSidesAudio: Api.audio.get('changeSides'),
            nextAudio: Api.audio.get('Next'),
            countdownAudio: Api.audio.get('countdownVoice'),
            breakAudio: Api.audio.get('Break'),
            breakAudioGeneric: Api.audio.get('TakeBreak'),
            congratsAudio: Api.audio.get('Congrats')
        };

        vm.changeLength = function (time) {
            vm.workoutLength = time;
        };

        vm.beginWorkout = function () {
            $rootScope.workingOut = true;
            $scope.$emit('workoutTime',Number(vm.workoutLength)); // going up!
            initLog();

            //Saves advancedTiming to Firebase
            //vm.userData.$save().then(function (ref) {
            //    ref.key() === vm.userData.$id;
            //}, function (error) {
            //    console.log("Error:", error);
            //});

            setIntervalTimings();
            setWorkoutTime();
            startFromBeginning();

            var timerInterval = $interval(function () {
                if (vm.timeChosen && !vm.paused) {
                    if (vm.currentWorkout.seconds > 1) {
                        updateTimer();

                        if (vm.exerciseTimer === 0 && vm.changeSidesBreak) {
                            changeSidesBreakEnding();
                        } else if (vm.exerciseTimer === 0) {
                            timerEnding();
                        } else if (vm.exerciseTimer === 1 && vm.onBreak) {
                            vm.onBreak = false;
                        } else if (vm.exerciseTimer === 3 && !vm.intervalBreak && !vm.changeSidesBreak) {
                            // Exercise Ending notifier
                            WorkoutService.playAudio(vm.sounds.countdownAudio);
                        } else if (vm.exerciseTimer === 10) {
                            // Next exercise notifier
                            if (!vm.breakNext && vm.currentWorkout.seconds > vm.defaultExerciseLength) {
                                vm.sounds.nextAudio.bind("ended", function () {
                                    WorkoutService.playAudio(vm.nextExercise.audio);
                                });
                                WorkoutService.playAudio(vm.sounds.nextAudio);
                            } else {
                                vm.breakNext = false;
                            }
                        } else if (vm.exerciseTimer === vm.changeSidesTime && vm.currentExercise.switchOption) {
                            // Switch sides notifier
                            WorkoutService.playAudio(vm.sounds.changeSidesAudio);
                            changeSidesBreak();
                            continueVideo();
                        }
                    }
                    // No time left in workout...
                    else {
                        if (timerInterval) {
                            $interval.cancel(timerInterval);
                        }
                        // Trigger End of Workout Code Here
                        vm.workoutFinished = true;
                        $rootScope.workingOut = false;
                        endLog();
                    }
                }
            }, 1000);

            $scope.$on('$destroy', function () {
                $interval.cancel(timerInterval);
            });

        };

        vm.secondsToHms = function (d) {
            d = Number(d);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);
            return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
        };

        vm.clearTime = function () {
            vm.workoutLength = '';
        };

        vm.calcComplete = function () {
            vm.selectedPercentage = round(Math.min(1 - ((60 - vm.workoutLength) / 60), 1) * 10,2) / 10;
        };

        function round(num, places) {
            var multiplier = Math.pow(10, places);
            return Math.round(num * multiplier) / multiplier;
        }

        vm.validateTime = function () {
            if (vm.workoutLength < 1 || vm.workoutLength > 1000 || vm.workoutLength == '') {
                setWorkoutLength();
            } else {
                vm.calcComplete();
            }
        };

        vm.minusFive = function () {
            if (vm.workoutLength > vm.defaultToAdd) {
                vm.workoutLength = parseInt(vm.workoutLength) - vm.defaultToAdd;
                vm.calcComplete();
            }
        };

        vm.plusFive = function () {
            if (vm.workoutLength < 56) {
                vm.workoutLength = parseInt(vm.workoutLength) + vm.defaultToAdd;
                vm.calcComplete();
            }
        };

        vm.changeRandomizationOption = function () {
            User.get().$loaded().then(function(user) {
                vm.currentExercises = Api.exercises.getWithOrder(vm.currentWorkout, user);
                handleFirstFour();
            });
        };

        function setWorkoutLength() {
            if (vm.workoutId === 'sevenMinute') {
                vm.workoutLength = 7;
                vm.workoutLengthChoices = [7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84];

            } else {
                vm.workoutLength = 5;
                vm.workoutLengthChoices = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
            }
            vm.defaultToAdd = vm.workoutLength;
            vm.calcComplete();
        }

        vm.validateNumber = function (formInput) {
            if (parseInt(customTimings[formInput].value) < parseInt(customTimings[formInput].min)) {
                customTimings[formInput].value = customTimings[formInput].min;
            } else if (parseInt(customTimings[formInput].value) > parseInt(customTimings[formInput].max)) {
                customTimings[formInput].value = customTimings[formInput].max;
            } else if (isNaN(parseInt(customTimings[formInput].value))) {
                customTimings[formInput].value = TimingData.GetTimingSettings[formInput];
            }
        };

        vm.resetAdvancedTiming = function () {
            vm.advancedTiming.randomizationOption.sync_value = true;
            vm.advancedTiming.transitionTime.sync_value = 5;
            vm.advancedTiming.exerciseTime.sync_value = 30;
            vm.advancedTiming.restStatus.sync_value = true;
            vm.advancedTiming.breakFreq.sync_value = 5;
            vm.advancedTiming.breakTime.sync_value = 30;
        };

        function adjustWorkoutIndex(by) {
            vm.workoutIndex = vm.workoutIndex + by;
        }

        function setWorkoutTime() {
            vm.timeChosen = true;
            vm.currentWorkout.minutes = Number(vm.workoutLength);
            vm.currentWorkout.seconds = vm.currentWorkout.minutes * 60;
            vm.currentWorkout.fullTimeInSeconds = vm.currentWorkout.seconds;
        }

        function setIntervalTimings() {
            if (vm.currentWorkout.isYogaSequence) {
                vm.defaultExerciseLength = vm.currentWorkout.defaultExerciseLength ;
            } else {
                /*setting dummy values*/

                //vm.defaultExerciseLength = vm.advancedTiming.exerciseTime.sync_value ;
                //vm.defaultTransitionLength = vm.advancedTiming.transitionTime.sync_value;
                //if (vm.advancedTiming.restStatus.sync_value) {
                //    vm.breakInterval = vm.advancedTiming.breakFreq.sync_value || 5;
                //    vm.defaultBreakLength = vm.advancedTiming.breakTime.sync_value;
                //} else {
                //    vm.breakInterval = 0;
                //    vm.defaultBreakLength = 0;
                //}

                vm.defaultExerciseLength = 30 ;
                vm.defaultTransitionLength = 5;
                vm.breakInterval = 5;
                vm.defaultBreakLength = 30

            }
            vm.changeSidesTime = isOdd(vm.defaultExerciseLength) ? Math.floor(vm.defaultExerciseLength / 2) : vm.defaultExerciseLength / 2;
        }

        function updateTimer() {
            vm.totalTimeCompleted = (vm.currentWorkout.fullTimeInSeconds - vm.currentWorkout.seconds);

            vm.exerciseTimer--;
            if (vm.intervalBreak && !vm.onBreak) {
                vm.arcNumber = vm.exerciseTimer / vm.defaultTransitionLength;
                if (vm.arcNumber === 0) {
                    vm.showExerciseTimer = true;
                }
            } else if (vm.changeSidesBreak) {
                vm.arcNumber = vm.exerciseTimer / vm.defaultTransitionLength;
                if (vm.arcNumber === 0) {
                    vm.showExerciseTimer = true;
                }
            } else {
                vm.currentWorkout.seconds--;
                vm.arcNumber = vm.exerciseTimer / vm.defaultExerciseLength;
                if (vm.arcNumber === 0) {
                    vm.showExerciseTimer = false;
                }
            }

            if (!vm.intervalBreak) {
                var percentage = ((vm.currentWorkout.seconds / vm.currentWorkout.fullTimeInSeconds) * 100) * -1;
                vm.progressBarTransform = {
                    'transform': 'translate(' + percentage + '%, 0)'
                };
            }
        }

        function playVideo() {
            vid.oncanplaythrough = function () {
                vid.play();
                if (!vm.onBreak && vm.currentExercise.videoTiming[0] !== false) {
                    videoTimeout = $timeout(function () {
                        vid.pause();
                    }, vm.currentExercise.videoTiming[0] + 1000);
                }
                videoPlaying = true;
            };
        }

        function continueVideo() {
            $timeout.cancel(videoTimeout);
            vid.play();
            if (vm.currentExercise.videoTiming[1] !== false) {
                videoTimeout = $timeout(function () {
                    vid.pause();
                }, vm.currentExercise.videoTiming[1] + 2000 - vm.currentExercise.videoTiming[0]);
            }
        }

        function changeSidesBreakEnding() {
            vm.changeSidesBreak = false;
            vm.exerciseTimer = vm.changeSidesTime;
            vm.arcNumber = 0.5;
            WorkoutService.playAudio(vm.sounds.beginAudio);
        }

        function timerEnding() {

            if (vm.intervalBreak) { // Interval timer is at 0 -- exercise begins
                vm.arcNumber = 1.0;
                vm.intervalBreak = false;
                vm.changeSidesBreak = false;
                vm.exerciseTimer = vm.defaultExerciseLength;
                WorkoutService.playAudio(vm.sounds.beginAudio);

                // auto-hide playlist
                if (vm.workoutIndex === 0 && !vm.playlistToggledByUser) {
                    vm.showPlaylist = false;
                }

            } else { // Exercise timer is up -- end of exercise

                vm.arcNumber = 1.0;
                vm.exercisesCompleted++;

                addToLog(vm.currentExercise);

                var completedRemainder = vm.exercisesCompleted % vm.breakInterval;

                if (vm.exercisesCompleted > 0 && completedRemainder === 0 && vm.currentWorkout.seconds > vm.defaultExerciseLength && !vm.currentWorkout.isYogaSequence) {
                    vm.onBreak = true;
                } else if (completedRemainder === (vm.breakInterval - 1) && vm.currentWorkout.seconds > 60 && !vm.currentWorkout.isYogaSequence) {
                    vm.breakNext = true;
                }

                if (vm.onBreak) {
                    vm.intervalBreak = false;
                    vm.exerciseTimer = vm.defaultBreakLength;
                    if (vm.workoutIndex === vm.currentExercises.length) {
                        vm.nextExercise = vm.currentExercises[0];
                    } else {
                        vm.nextExercise = vm.currentExercises[vm.workoutIndex];
                    }
                    vm.currentExercise = vm.break;
                    if (vm.defaultBreakLength !== 30) {
                        vm.currentExercise.name = "Take a " + vm.defaultBreakLength + " Second Break";
                        WorkoutService.playAudio(vm.sounds.breakAudioGeneric);
                    } else {
                        WorkoutService.playAudio(vm.sounds.breakAudio);
                    }
                    $timeout(function () {
                        $('video').load();
                    }, 0);

                } else {
                    nextExercise();
                }
            }
        }

        var currentLog;

        function initLog() {
            var str = 'YYYY-MM-DD HH:mm:ss',
                localDate = new Date(),
                localMoment = moment(),
                utcMoment = moment.utc(),
                utcDate = new Date(utcMoment.format(str));

            currentLog = {
                calories: 0,
                connected_apps: 'sworkit-web',
                created_on: localMoment.format(str),
                device_type: 'web',
                exercise_list: [],
                heart_rate: "{average: false, peak: false}",
                minutes_completed: 0,
                sworkit_id: null,
                sync_lastUpdated: localDate.getTime(),
                type: vm.currentWorkout.id ? vm.currentWorkout.name : 'customWorkout',
                utc_created: utcMoment.format(str),
                customName: false
            };

            //swAnalytics.trackEvent(GA_EVENT_CATEGORY_WORKOUT, GA_EVENT_ACTION_START, vm.workoutName, Number(vm.workoutLength));
        }

        function addToLog(exercise) {
            // TODO: Should we add the exercise to workout log if the user skips it after a certain amount of time?
            var exerciseTimeCompleted = (vm.defaultExerciseLength - vm.exerciseTimer);

            currentLog.exercise_list.push({
                'exercise': exercise.name,
                'length': exerciseTimeCompleted
            });
            // console.log('current workout log', currentLog);
        }

        function endLog() {
            if (vm.totalTimeCompleted >= 0) {
                WorkoutService.playAudio(vm.sounds.congratsAudio);
                vm.totalCaloriesBurned = Math.round(vm.currentWorkout.activityWeight * (PersonalData.GetUserSettings.weight / 2.2) * ((vm.totalTimeCompleted / 60) / 60));
                currentLog.calories = vm.totalCaloriesBurned;
                vm.totalTimeInMinutesRounded = getMinutesFromSecondsAsRoundedToNearestHalf(vm.totalTimeCompleted);
                currentLog.minutes_completed = vm.totalTimeInMinutesRounded;
                currentLog.exercise_list = JSON.stringify(currentLog.exercise_list);
                $firebaseArray(logRef).$add(currentLog);
                $scope.$emit('workoutTime',0); // going up!

            }
        }

        function isWorkoutFullyCompleted() {
            return vm.totalTimeInMinutesRounded === vm.currentWorkout.minutes;
        }

        function getMinutesFromSecondsAsRoundedToNearestHalf(seconds) {
            return Math.round(2 * (seconds / 60)) / 2;
        }

        var setVolume = function (volume) {
            // TODO: DRY this out with same code in vm.ToggleMute() fn below
            for (var i in buzz.sounds) {
                buzz.sounds[i].setVolume(volume);
                vm.muted = !(volume > 0);
            }
        };

        vm.togglePlaylist = function () {
            vm.showPlaylist = !vm.showPlaylist;
            vm.playlistToggledByUser = true;
        };

        vm.toggleMute = function () {
            var isVolumePreviouslySet = $scope.volume > 0;
            if (isVolumePreviouslySet) {
                $scope.prevVolume = $scope.volume;
            }
            if (vm.muted) {
                $scope.volume = $scope.prevVolume;
                for (var i in buzz.sounds) {
                    // return volume bar to it's previous state upon un-muting
                    buzz.sounds[i].setVolume($scope.volume);
                }
            } else {
                for (var i in buzz.sounds) {
                    buzz.sounds[i].setVolume(0);
                    $scope.volume = 0;
                }
            }
            vm.muted = !vm.muted;
        };

        vm.togglePlay = function () {
            // pause timeout will preserve videoTimeout location on exercises that switch sides
            var pauseTimeout;
            // var vid = $('video')[0];

            if (vm.paused && !vm.intervalBreak && vm.currentExercise.switchOption === true) {
                vm.paused = false;
                $timeout.cancel(pauseTimeout);
                // vid.play();
            } else if (vm.paused && !vm.intervalBreak) {
                vm.paused = false;
                vid.play();
                // Only play the 'begin' audio if it's the beginning of the exercise and
                // you toggled play after skipping a paused exercise
                if (vm.exerciseTimer === vm.defaultExerciseLength) {
                    WorkoutService.playAudio(vm.sounds.beginAudio);
                    playVideo();
                }
            }

            // Skipping directly to the exercise if you don't want to watch
            // the 5 second intervalBreak vid
            else if (vm.intervalBreak) {
                // auto-hide playlist
                if (vm.workoutIndex === 0 && !vm.playlistToggledByUser) {
                    vm.showPlaylist = false;
                    adjustWorkoutIndex(1);
                }
                vm.intervalBreak = false;
                vm.exerciseTimer = vm.defaultExerciseLength;
                WorkoutService.playAudio(vm.sounds.beginAudio);
                $timeout.cancel(pauseTimeout);
                playVideo();
                vm.arcNumber = 1;
            } else {
                vm.paused = true;
                // We never want the video to stop, so it keeps going, but greyed out...
                // Except in the case of video that changes sides. Then we need to preserve
                // The ongoing timeout function
                if (vm.currentExercise.switchOption === true) {
                    pauseTimeout = $timeout(function () {
                        vid.pause();
                    }, 0);
                }
            }
        };

        vm.next = function () {
            nextExercise();
        };

        vm.goToExercise = function (destIndex) {
            $timeout.cancel(videoTimeout);
            // Declaring this var for determining use of WorkoutService.autoScroll
            // If navigating to an earlier video in the playlist, WorkoutService.autoScroll shouldn't activate
            var prevIndex = vm.workoutIndex;
            vm.workoutIndex = destIndex;
            vm.currentExercise = vm.currentExercises[vm.workoutIndex];

            if (destIndex + 1 === vm.currentExercises.length) {
                console.log("End of exercises array");
                vm.nextExercise = vm.currentExercises[0];
            } else {
                vm.nextExercise = vm.currentExercises[vm.workoutIndex + 1];
            }

            if (vm.paused) {
                vm.intervalBreak = false;
                vm.exerciseTimer = vm.defaultExerciseLength;
                // Audio for the current exercise will start, the 'begin' audio won't
                // start until you toggle play (see togglePlay function)
                WorkoutService.playAudio(vm.currentExercise.audio);
                vm.arcNumber = 1;
                $timeout(function () {
                    $('video').load();
                }, 0);
                playVideo();
                adjustWorkoutIndex(1);
                if (prevIndex < vm.workoutIndex) {
                    WorkoutService.autoScroll();
                }
            } else {
                intervalBreak();
                WorkoutService.playAudio(vm.currentExercise.audio);
                $timeout(function () {
                    $('video').load();
                    adjustWorkoutIndex(1);
                    if (prevIndex < vm.workoutIndex) {
                        WorkoutService.autoScroll();
                    }
                    vm.intervalBreak = true;
                }, 0);
                playVideo();
            }
        };

        vm.previous = function () {
            $timeout.cancel(videoTimeout);
            if (vm.workoutIndex > 1) {
                vm.currentExercise = vm.currentExercises[vm.workoutIndex - 2];
                vm.nextExercise = vm.currentExercises[vm.workoutIndex - 1];
                if (vm.paused) {
                    vm.intervalBreak = false;
                    vm.exerciseTimer = vm.defaultExerciseLength;
                    vm.showPrevExercise = true;
                    // Audio for the current exercise will start, the 'begin' audio won't
                    // start until you toggle play (see togglePlay function)
                    WorkoutService.playAudio(vm.currentExercise.audio);
                    vm.arcNumber = 1;
                    $timeout(function () {
                        $('video').load();
                        vm.workoutIndex--;
                    }, 0);
                    playVideo();
                } else {
                    intervalBreak();
                    WorkoutService.playAudio(vm.currentExercise.audio);
                    $timeout(function () {
                        $('video').load();
                        vm.workoutIndex--;
                        vm.intervalBreak = true;
                    }, 0);
                    playVideo();
                }
            }
        };

        function nextExercise() {
            $timeout.cancel(videoTimeout);

            if (vm.workoutIndex === 0) adjustWorkoutIndex(1);
            if (vm.workoutIndex === vm.currentExercises.length) {
                startFromBeginning();
                return;
            }

            vm.currentExercise = vm.currentExercises[vm.workoutIndex];

            if (vm.workoutIndex === vm.currentExercises.length - 1) {
                vm.nextExercise = vm.currentExercises[0];
            } else {
                vm.nextExercise = vm.currentExercises[vm.workoutIndex + 1];
            }

            // If the workout is paused, we don't want to go to an interval break when clicking next
            if (vm.paused) {
                vm.intervalBreak = false;
                vm.exerciseTimer = vm.defaultExerciseLength;
                // Audio for the current exercise will start, the 'begin' audio won't
                // start until you toggle play (see togglePlay function)
                WorkoutService.playAudio(vm.currentExercise.audio);
                vm.arcNumber = 1;
                $timeout(function () {
                    $('video').load();
                    if (vm.workoutIndex !== vm.currentExercises.length) {
                        adjustWorkoutIndex(1);
                    }
                    WorkoutService.autoScroll();
                }, 0);
                playVideo();

            } else {
                intervalBreak();
                WorkoutService.playAudio(vm.currentExercise.audio);
                vm.arcNumber = 1;
                $timeout(function () {
                    $('video').load();
                    if (vm.workoutIndex !== vm.currentExercises.length) {
                        adjustWorkoutIndex(1);
                    }
                    WorkoutService.autoScroll();
                }, 0);
                playVideo();
            }
        }

        function intervalBreak(isFirstExercise) {
            if ((vm.currentWorkout.isYogaSequence || vm.defaultTransitionLength == 0) && !isFirstExercise) {
                vm.showExerciseTimer = true;
                vm.intervalBreak = false;
                vm.exerciseTimer = vm.defaultExerciseLength;
                vm.arcNumber = vm.exerciseTimer / vm.defaultExerciseLength;
            } else if (isFirstExercise) {
                vm.showExerciseTimer = false;
                vm.intervalBreak = true;

                vm.exerciseTimer = EXERCISE_BUFFER;
                vm.arcNumber = vm.exerciseTimer / vm.defaultTransitionLength;
            } else {
                vm.showExerciseTimer = false;
                vm.intervalBreak = true;
                vm.exerciseTimer = vm.defaultTransitionLength;
                vm.arcNumber = vm.exerciseTimer / vm.defaultTransitionLength;
            }
        }

        function changeSidesBreak() {
            vm.exerciseTimer = 5;
            vm.showExerciseTimer = false;
            vm.changeSidesBreak = true;
            vm.arcNumber = vm.exerciseTimer / vm.defaultTransitionLength;
        }

        function startFromBeginning() {
            intervalBreak(true);
            vm.workoutIndex = 0;
            // console.log('vm.currentExercises', vm.currentExercises);
            //vm.currentExercise = vm.currentExercises[vm.workoutIndex];


            vm.currentExercise = vm.currentExercises[vm.workoutIndex];



            $timeout(function () {
                $('video').load();
            }, 0);

            // this gets the timeout if needed
            playVideo();

            //vm.nextExercise = vm.currentExercises[vm.workoutIndex + 1]

            vm.nextExercise = vm.currentExercises[vm.workoutIndex + 1];


            // Added this to set the volume to the current scope volume as each sound is brought in
            // console.log('vm.currentExercise', vm.currentExercise);
            //WorkoutService.playAudio(vm.currentExercise.audio);
            var container = angular.element(document.getElementsByClassName('playlist-container'));
            container.scrollLeft(0);
            vm.intervalBreak = true;
            vm.paused = false;
            vm.showExerciseTimer = false;
        }

        function isOdd(n) {
            return Math.abs(n % 2) == 1;
        }

        vm.confirmationShowing = false;

        vm.confirmEndWorkout = function () {
            vm.confirmationShowing = true;
            vm.intervalBreak = false;
            if (!vm.paused) {
                vm.togglePlay();
            } else {

            }
        };

        vm.closeConfirmation = function (endWorkout) {
            vm.confirmationShowing = false;
            if (endWorkout) {
                vm.endWorkout();
            }
        };

        vm.endWorkout = function () {
            vm.workoutFinished = true;
            $rootScope.workingOut = false;
            endLog();
            $scope.$emit('workoutTime',0);
        };

        $scope.hoverOn = function () {
            this.hoverShow = true;
        };
        $scope.hoverOff = function () {
            this.hoverShow = false;
        };

        setWorkoutLength();


    }

})();