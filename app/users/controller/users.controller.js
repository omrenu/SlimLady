/**
 * Created by apoorvaagrawal on 03/12/16.
 */
(function () {
    'use strict';
    angular.module('SlimLady')
        .controller('UsersCtrl', UsersCtrl);

    function UsersCtrl(User, $state, $window) {
        var vm = this;
        vm.changeAccountEmail = changeAccountEmail;
        vm.changeAccountPassword = changeAccountPassword;
        vm.updateUser = updateUser;
        vm.updateSyncLastUpdated = updateSyncLastUpdated;


        User.check()
            .then(function (data) {
                console.log(data);
                vm.userData = data;
                // TODO: DRY this out with AppCtrl

                //getCustomer();
            });

        function changeAccountEmail(newEmail, password) {
            User.changeEmail(newEmail, password)
                .then(function (ref) {
                    vm.flash({
                        type: 'success',
                        msg: 'Your Email has been Successfully Updated!'
                    });
                    vm.changeEmail = {};
                }, function (error) {
                    // Handle the error
                    vm.flash(FirebaseError.get(error));
                });
        }

        function changeAccountPassword(newPassword, newPasswordConfirmation, currentPassword) {
            if (newPassword === newPasswordConfirmation) {
                User.changePassword(newPassword, currentPassword);
                $state.go('player.user');
            } else {
                console.log('The new passwords do not match!');
            }
        }

        function updateUser() {
            vm.userData.$save()
                .then(function () {
                    $window.alert('Your account has been successfully updated');
                    $state.go('player.user');
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        function updateSyncLastUpdated(obj) {
            obj.sync_lastUpdated = Firebase.ServerValue.TIMESTAMP;
        }

    }

})();