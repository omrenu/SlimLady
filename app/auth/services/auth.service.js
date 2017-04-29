/**
 * Created by apoorvaagrawal on 13/11/16.
 */
(function() {
    'use strict';

    angular
        .module('SlimLady')
        .factory('Auth', Auth);

    function Auth($firebaseAuth, FIREBASE_URL) {

        var firebaseAuth = $firebaseAuth(firebase.auth());

        var service = {
            firebaseAuth: firebaseAuth,
            logout: logout
        };

        return service;

        function logout() {
            ref.unauth();
            $rootScope.adminLogin = false;
            console.log("Current User is now logged out");
        }

    }

})();