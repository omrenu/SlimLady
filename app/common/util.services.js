/**
 * Created by apoorvaagrawal on 17/11/16.
 */
(function() {
    'use strict';
    angular.module('SlimLady')
        .factory('Util', Util);

    function Util() {
        var service = {
            sdVidLink: sdVidLink,
            minTommss: minTommss,
            minToHHmm: minToHHmm,
            toArr: toArr
        };

        function sdVidLink(url) {
            var res = url.replace('1080', 'ios');
            return res;
        }

        function minTommss(minutes) {
            var sign = minutes < 0 ? "-" : "";
            var min = Math.floor(Math.abs(minutes));
            var sec = Math.floor((Math.abs(minutes) * 60) % 60);
            if (sec === 0) {
                sec = false;
            }
            var totalTime = {
                min: min,
                sec: sec
            };
            return totalTime;
        }

        function minToHHmm(time) {
            var min = Math.round(time % 60);
            var hr = Math.round((time - min) / 60);
            if (hr < 0) hr = '';
            var totalTime = {
                hr: hr,
                min: min
            }
            return totalTime;
        }

        function toArr(collection) {
            var arr = [];
            angular.forEach(collection, function(item) {
                arr.push(item);
            });
            return arr;
        }

        return service;
    }

})();