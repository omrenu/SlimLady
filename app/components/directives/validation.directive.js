/**
 * Created by apoorvaagrawal on 03/03/17.
 */
angular.module('SlimLady')
    .directive('wjValidationError', function() {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctl) {
                scope.$watch(attrs['wjValidationError'], function(errorMsg) {
                    elm[0].setCustomValidity(errorMsg);
                    ctl.$setValidity('wjValidationError', errorMsg ? false : true);
                });
            }
        };
    });