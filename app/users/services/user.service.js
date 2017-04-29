/**
 * Created by apoorvaagrawal on 03/12/16.
 */
(function(){

    'use strict';
    angular.module('SlimLady').
        factory('User',User);

    function User($firebaseObject, FIREBASE_URL, $firebaseAuth, $window, $q, $http, $state){

        var ref = firebase.database().ref();
        var auth = $firebaseAuth(firebase.auth());
        var usersRef = ref.child('users');
        var data = null;
        var _isPayingCustomer = null;
        var service = {
            set: set,
            get: get,
            ref: ref,
            auth: auth,
            loggedIn: loggedIn,
            changeEmail: changeEmail,
            changePassword: changePassword,
            sendResetPasswordEmail: sendResetPasswordEmail,
            initialSetup: initialSetup,
            isPayingCustomer:isPayingCustomer,
            clearCache: clearCache,
            check: check,
            setupSetting:setupSetting
        };

        return service;

        function set(authData) {
            data = $firebaseObject(usersRef.child(authData.uid));
            return data;
        }

        function get() {
            if (data) {
                return data;
            } else {
                $state.go('auth.login');
                return false;
            }
        }

        function loggedIn() {
            if (data) {
                return Object.keys(data).length > 0;
            } else {
                return false;
            }
        }

        function changeEmail(newEmail, password) {
            if (data.userProfile.authType.sync_value === 'email') {
                ref.changeEmail({
                    oldEmail: data.userProfile.email.sync_value,
                    newEmail: newEmail,
                    password: password
                }, function (error) {
                    if (error === null) {
                        console.log("Email changed successfully");
                        return afterEmailChange(newEmail);
                    } else {
                        console.log("Error changing email:", error);
                    }
                });
            } else {
                return afterEmailChange(newEmail);
            }
        }

        function changePassword(newPassword, password) {
            ref.updatePassword({
                email: data.userProfile.email.sync_value,
                oldPassword: password,
                newPassword: newPassword
            }, function (error) {
                if (error) {
                    switch (error.code) {
                        case "INVALID_PASSWORD":
                            console.log("The specified user account password is incorrect.");
                            break;
                        case "INVALID_USER":
                            console.log("The specified user account does not exist.");
                            break;
                        default:
                            console.log("Error changing password:", error);
                    }
                } else {
                    console.log("User password changed successfully!");
                    $window.alert("User password changed successfully!");
                }
            });
        }

        function sendResetPasswordEmail(email) {
            ref.resetPassword({
                email: email
            }, function (error) {
                if (error) {
                    switch (error.code) {
                        case "INVALID_USER":
                            console.log("The specified user account does not exist.");
                            break;
                        default:
                            console.log("Error resetting password:", error);
                    }
                } else {
                    console.log("Password reset email sent successfully!");
                    $window.alert("An email has been sent to reset your password");
                }
            });
        }

        function initialSetup(authData) {
            usersRef.child(authData.uid).once('value', function (snapshot) {
                var userExists = snapshot.val() !== null;
                if (userExists) {
                    console.log('there is account data for ' + authData.uid + ' already!');
                    // WE NEED TO STORE THE USER IF THEY HAVE ACCT DATA BUT LOGGED OUT
                    $window.localStorage['uid'] = authData.uid;
                } else {
                    $window.localStorage['uid'] = authData.uid;
                    console.log('there is NO account data for ' + authData.uid + ' yet!');
                    var user = usersRef.child(authData.uid);
                    var provider = authData.provider;
                    if (provider === 'google') {
                        console.log('provider is google');

                        var userProfile = addLastSynced(getGoogleUserProfile(authData));
                        setupAccount(user, userProfile);

                    } else if (provider === 'facebook') {
                        console.log('provider is facebook');

                        var userProfile = addLastSynced(getFacebookUserProfile(authData));

                        setupAccount(user, userProfile);

                    } else {
                        console.log('using email to signup');
                        var userProfile = addLastSynced(getPasswordUserProfile(authData));
                        setupAccount(user, userProfile);
                    }
                    //swAnalytics.trackEvent(GA_EVENT_CATEGORY_KPI, GA_EVENT_ACTION_ACTIVATION, GA_EVENT_LABEL_REGISTRATION);
                }
                //swAnalytics.enableSessionUnification(authData.uid);
            });
        }

        function isPayingCustomer(uid) {
            return true;
        }



        function check() {
            var deferred = $q.defer();
            var authData =auth.$getAuth();

                if (authData) {
                    $window.sessionStorage.loggedIn = true;
                    initialSetup(authData);
                    $window.localStorage['uid'] = authData.uid;
                    set(authData).$loaded(function (user) {
                        deferred.resolve(user);
                    });
                }
                else {
                    $state.go('auth.login');
                }

            return deferred.promise;
        }


        function clearCache() {
            _isPayingCustomer = null;
        }


        function getFacebookUserProfile(authData) {
            return {
                authType: 'facebook',
                birthYear: '',
                email: authData.facebook.email,
                emailPreference: true,
                firstName: authData.facebook.cachedUserProfile.first_name,
                gender: authData.facebook.cachedUserProfile.gender || '',
                goals: [],
                lastName: authData.facebook.cachedUserProfile.last_name,
                locale: authData.facebook.cachedUserProfile.locale,
                newPassword: '',
                oldPassword: '',
                photo: authData.facebook.cachedUserProfile.picture.data.url,
                uid: authData.uid
            };
        }

        function getGoogleUserProfile(authData) {
            return {
                authType: 'google',
                birthYear: '',
                email: authData.google.email,
                emailPreference: true,
                firstName: authData.google.cachedUserProfile.given_name,
                gender: authData.google.cachedUserProfile.gender || '',
                goals: [],
                lastName: authData.google.cachedUserProfile.family_name,
                locale: authData.google.cachedUserProfile.locale,
                newPassword: '',
                oldPassword: '',
                photo: authData.google.cachedUserProfile.picture,
                uid: authData.uid
            };
        }

        function getPasswordUserProfile(authData) {
            return {
                authType: 'password',
                birthYear: '',
                email: authData.email,
                emailPreference: true,
                firstName: authData.firstName,
                gender: '',
                goals: [],
                lastName: authData.lastName,
                locale: 'en',
                newPassword: '',
                oldPassword: '',
                photo: '',
                signUpDate: firebase.database.ServerValue.TIMESTAMP,
                proAccess: true,
                uid: authData.uid
            };
        }

        function addLastSynced(obj) {
            var newObj = {};
            //var time = Firebase.ServerValue.TIMESTAMP;
            angular.forEach(obj, function (value, key) {
                newObj[key] = {
                    sync_value: value || ''
                };
            });
            return newObj;
        }

        function filterToNeededUserSettings() {
            var neededTimingSettings = ['breakFreq', 'breakTime', 'customSet', 'exerciseTime', 'randomizationOption', 'restStatus', 'transitionTime', 'workoutLength'];
            Object.keys(TimingData.GetTimingSettings).filter(function (key) {
                return neededTimingSettings.indexOf(key) === -1;
            }).forEach(function (key) {
                delete TimingData.GetTimingSettings[key];
            });
        }

        function setupAccount(user, userProfile) {
            //filterToNeededUserSettings();
            user.set({
                userSettings: addLastSynced(PersonalData.GetUserSettings),
                userProfile: userProfile,
                userGoals: {
                    dailyGoal: {
                        sync_lastUpdated: firebase.database.ServerValue.TIMESTAMP,
                        sync_value: PersonalData.GetUserGoals.dailyGoal
                    },
                    weeklyGoal: {
                        sync_lastUpdated: firebase.database.ServerValue.TIMESTAMP,
                        sync_value: PersonalData.GetUserGoals.weeklyGoal
                    }
                }
            });
            angular.forEach(PersonalData.GetCustomWorkouts.savedWorkouts, function (workout) {

                workout.sync_lastUpdated = firebase.database.ServerValue.TIMESTAMP;
                user.child('customWorkouts').push(workout);

            });
        }
        function setupSetting(user,userSettings,userGoal){

            user.update({
                userSettings:addLastSynced(userSettings),
                userGoals: {
                    dailyGoal: {
                        sync_lastUpdated: firebase.database.ServerValue.TIMESTAMP,
                        sync_value: userGoal.dailyGoal
                    },
                    weeklyGoal: {
                        sync_lastUpdated: firebase.database.ServerValue.TIMESTAMP,
                        sync_value: userGoal.weeklyGoal
                    }
                }
            });

        }
        function afterEmailChange(newEmail) {
            data.userProfile.email.sync_value = newEmail;
            data.userProfile.email.sync_lastUpdated = Firebase.ServerValue.TIMESTAMP;
            return data.$save();
        }

    }


})();
