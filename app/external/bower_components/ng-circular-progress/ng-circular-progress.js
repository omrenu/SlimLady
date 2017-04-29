(function (angular) {

  'use strict';

  var app = angular.module('ng-circular-progress', []);

  app.provider('circularProgressDefaults', function () {

    var defaults = {
      strokeWidth: 10,
      stroke: 'black',
      lineCap: 'butt', // "string" butt | round | square
      background: null
    };

    this.setDefault = function (name, value) {
      defaults[name] = value;
      return this;
    };

    this.$get = function () {
      return function (attr) {
        angular.forEach(defaults, function (value, key) {
          if (!attr[key]) {
            attr[key] = value;
          }
        });
      };
    };
  });

  app.directive('circularProgress', ['circularProgressDefaults', function (circularProgressDefaults) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        strokeWidth:      '@', // Width of progress arc stroke.
        linecap:          '@', // Specifies the shape to be used at the end of the progress ring.
        stroke:           '@', // Color/appearance of stroke.
        complete:         '@', // Expression evaluating to float [0.0, 1.0]
        background:       '@'  // Color of the background ring. Defaults to null.
      },
      compile: function (element, attr) {
        var svg = element.find('svg').eq(0);

        svg.css({
          "display": "block",
          "transform": "rotate(-90deg)"
        });
        element.css({
          "display": "block"
        });
        circularProgressDefaults(attr);

        return function (scope, element, attr) {
          var updateRadius = function () {
            scope.radius = 100 - (scope.strokeWidth/2);
            scope.circumference = 2 * Math.PI * scope.radius;
          };
          scope.$watchCollection('[strokeWidth]', updateRadius);
          updateRadius();
        };
      },
      template:
        '<svg viewBox="0 0 200 200" preserveAspectRatio="none">' +
          '<circle fill="none" ' +
            'ng-if="background" ' +
            'cx="100" ' +
            'cy="100" ' +
            'ng-attr-r="{{radius}}" ' +
            'ng-attr-stroke="{{background}}" ' +
            'ng-attr-stroke-width="{{strokeWidth}}"' +
          '/>' +
          '<circle fill="none" ' +
            'cx="100" ' +
            'cy="100" ' +
            'ng-attr-r="{{radius}}" ' +
            'ng-attr-stroke="{{stroke}}" ' +
            'ng-attr-stroke-width="{{strokeWidth}}"' +
            'ng-attr-stroke-dasharray="{{circumference}}"' +
            'ng-attr-stroke-dashoffset="{{(1 - complete) * circumference}}"' +
            'ng-attr-stroke-linecap="{{linecap}}"' +
          '/>' +
        '</svg>' +
        '<ng-transclude></ng-transclude>'
    };
  }]);

})(window.angular);
