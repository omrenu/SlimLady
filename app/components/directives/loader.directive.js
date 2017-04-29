/**
 * Created by apoorvaagrawal on 16/11/16.
 */
angular.module('SlimLady')
    .directive('loader', function() {
        return {
            scope: {},
            link: function(scope, element, attrs) {
                var loading = loading;
                // if (!loading) {
                //     element.css('display', 'none');
                // }
            },
            template: "<div class='fountain-container'>\
								<div id='fountain'>\
								    <div id='fountain_1' class='fountain'></div>\
								    <div id='fountain_2' class='fountain'></div>\
								    <div id='fountain_3' class='fountain'></div>\
								    <div id='fountain_4' class='fountain'></div>\
								    <div id='fountain_5' class='fountain'></div>\
								    <div id='fountain_6' class='fountain'></div>\
								    <div id='fountain_7' class='fountain'></div>\
								    <div id='fountain_8' class='fountain'></div>\
								</div>\
							</div>"
        };
    });