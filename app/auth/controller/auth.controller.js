/**
 * Created by Z003FEWY on 2/6/2017.
 */
/**
 * Created by apoorvaagrawal on 13/11/16.
 */
var ref;
(function () {
    'use strict';
    angular
        .module('SlimLady')
        .controller('AuthCtrl', AuthCtrl);

    function AuthCtrl(Auth,User,$state,$rootScope,$scope,$window,$timeout,Flash,FIREBASE_URL) {
        var vm = this;

        $rootScope.loading = false;

        var firebaseAuth = Auth.firebaseAuth;
        var auth = firebaseAuth;

        init();
        var authData = null;
        function init() {
            if (!authData) {
                if ($rootScope.hideForBeta) {
                    $state.go('auth.login');
                } else {
                    $state.go('auth.signup');
                }
            } else {
                if (!$state.is('auth.premium') && !$state.params.upgrade) {
                    $state.go('player.home');
                }
            }

            vm.dropdown = false;
            vm.toggleDropdown = toggleDropdown;
            vm.hideDropdown = hideDropdown;
            vm.isHeaderVisble = true;
            vm.isMenuVisible = true;
            vm.workoutTitle = "";
            vm.createUser = createUser;
            vm.login = login;
            vm.oAuthLogin = oAuthLogin;
            vm.signup = signup;
            vm.resetPassword = resetPassword;
            vm.playVideo = playVideo;

            vm.user = {
                email: '',
                password: ''
            };
            vm.signupData = {};
            vm.resetPasswordData = {
                email: ''
            };

            vm.videoPlayed = false;
        }

        function toggleDropdown() {
            vm.dropdown = !vm.dropdown;
        }

        function hideDropdown() {
            vm.dropdown = false;
        }

        function createUser() {
            firebaseAuth.$unauth();
            firebaseAuth.$createUser({
                email: vm.email,
                password: vm.password
            }).then(function (userData) {
                login();
            }).catch(function (error) {
                vm.error = error;
            });
        }

        function saveUser() {
            // TODO: save the user data at the /users endpoint
        }

        function login(user) {


            auth.$signInWithEmailAndPassword(user.email,user.password).then(function(authData){
                if(authData)
                {
                    $timeout(function(){
                        User.initialSetup(authData);
                        Flash.create('success', 'LoggedIn');
                        console.log('Logged Creation Successful!');
                        authData = authData;
                    });
                    $window.sessionStorage.loggedIn = true;
                    $state.go('player.home');
                }
                else
                {
                    Flash.create('error', 'Please enter registered email Id');
                }

            });
            //
            //firebase.authWithPassword({
            //    email    : user.email,
            //    password : user.password
            //}, function(error, authData) {
            //    if (error) {
            //        Flash.create('error', 'Please enter registered email Id');
            //        $scope.$apply();
            //    } else {
            //        $timeout(function(){
            //            User.initialSetup(authData);
            //            Flash.create('success', 'LoggedIn');
            //            console.log('Logged Creation Successful!');
            //            authData = authData;
            //        });
            //        $window.sessionStorage.loggedIn = true;
            //        $state.go('player.home');
            //    }
            //});
            //


        }

        function oAuthLogin(provider) {

            var provider_google = new firebase.auth.GoogleAuthProvider();


            firebase.auth().signInWithPopup(provider_google).then(function(result){

                var user = result.user;
                console.log("user data",user);
            });


        }

        function signup(signupForm, signupData) {
            if (signupForm.$valid) {

                //var userData = {
                //    email: "jagetiapallavi@gmail.com",
                //    firstName: "ripu",
                //    lastName: "mahesh",
                //    password: "omrenu",
                //    passwordConfirmation: "omrenu",
                //    uid: "5305d8b5-91f3-44d4-b979-777c066c33232"
                //};
                //
                //if(userData)
                //{
                //    angular.extend(userData,signupData);
                //
                //    authData = {
                //        auth :{
                //            provider:"password",
                //            token:{
                //                aud: "sworkit-user",
                //                auth_time: 1481519359,
                //                email: "rdmahesh22@gmail.com",
                //                email_verified: false,
                //                exp: 1512623359
                //
                //            },
                //            uid:"6e3aef2d-4952-4bdd-a7f0-b96329edf054"
                //        },
                //        expires:1512623359,
                //        password:{
                //
                //            email: "jagetiapallav@gmail.com",
                //            isTemporaryPassword: false,
                //            profileImageURL: "https://secure.gravatar.com/avatar/ab4e8b56fcb3a0632483fcb8004b1af9?d=retro"
                //
                //        },
                //        provider:"password",
                //        token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImphZ2V0aWFwYWxsYXZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpYXQiOjE0ODI4MDMzNjEsInYiOjAsImQiOnsicHJvdmlkZXIiOiJwYXNzd29yZCIsInVpZCI6IjZlM2FlZjJkLTQ5NTItNGJkZC1hN2YwLWI5NjMyOWVkZjA1NSJ9fQ.joQVnUn1ohP_fbVRAIT70zM8OmvD0Zo81ImxQmi_s8M",
                //        uid:"6e3aef2d-4952-4bdd-a7f0-b96329edf054"
                //    }
                //    if(authData)
                //    {
                //        User.initialSetup(userData);
                //        Flash.create('success','Account created successfully');
                //        console.log("Account created ");
                //        $window.sessionStorage.loggedIn = true;
                //        $timeout(init, 500);
                //    }
                //
                //
                //
                //
                //}
                auth.$createUserWithEmailAndPassword(
                    signupData.email,
                    signupData.password
                ).then(function (userData) {

                        console.log("Successfully created user account with uid:", userData.uid);
                        var userConfig ={};
                        userConfig.uid = userData.uid;
                        angular.extend(userConfig, signupData);

                        auth.$signInWithEmailAndPassword(signupData.email,signupData.password).then(function(authData){
                            $timeout(function(){
                                User.initialSetup(userConfig);
                                Flash.create('success', 'Account Creation Successful!');
                                console.log('Account Creation Successful!');
                                authData = authData;
                            });
                            $window.sessionStorage.loggedIn = true;
                            $timeout(init, 500);

                        });



                    }).catch(function(error) {
                        console.log(error);
                        Flash.create('error', error.message);
                    });
            } else {
                Flash.create('error', 'Please correct the highlighted errors');
            }
        }

        function resetPassword(email) {
            User.sendResetPasswordEmail(email);
            $state.go('auth');
        }

        function playVideo() {
            swal({
                title: '',
                text: '<video id="intro-video" controls autoplay poster="https://s3.amazonaws.com/sworkit.com/assets/img/video-poster.jpg"><source src="https://s3.amazonaws.com/sworkit.com/assets/video/Sworkit-Web-Video-optimized.mp4" type="video/mp4"> </video>',
                html: true,
                confirmButtonColor: "#FF8614",
                confirmButtonText: "Let's do this!",
                customClass: 'video-intro'
            }, function () {
                var introVideo = document.getElementById("intro-video");
                introVideo.remove();
            });
        }


        /* Broadcast event */
        $scope.$on('titleChange',function(event,data){

            if(data.length)
            {
                vm.workoutTitle = data;
            }
            else
            {
                vm.workoutTitle = "";
            }


        });
        $scope.$on('workoutTime',function(event,data){

           if(data)
           {
               vm.isHeaderVisble = false;
               vm.isMenuVisible = false;
           }
            else
           {
               vm.isHeaderVisble = true;
               vm.isMenuVisible = true;
           }

        });


    }

})();
