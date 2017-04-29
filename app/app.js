
(function () {
    'use strict';
    angular.module('SlimLady', [
        'firebase',
        'ui.router',
        'ng-circular-progress',
        'nvd3',
        'ngFlash',
        'ui.sortable'
    ]).
        constant('FIREBASE_URL', 'https://slimlady-8eb38.firebaseio.com/')
        .constant('VIDEO_SECONDS', 30)
        .constant('EXERCISE_BUFFER', 5);
})();

