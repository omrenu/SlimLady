angular.module('SlimLady')
    .directive("outsideClick", ['$document',
        function($document) {
            return {
                link: function($scope, $element, $attributes) {
                    var scopeExpression = $attributes.outsideClick,
                        onDocumentClick = function(event) {
                            if (event.target.id != 'dropdown-menu' && event.target.id != 'dd-toggle' && event.target.id != 'preview-vid' && event.target.id != 'play-modal' && event.target.id != 'seek-back' && event.target.id != 'seek-forward') {
                                $scope.$apply(scopeExpression);
                            }
                        };

                    $document.on("click", onDocumentClick);

                    $element.on('$destroy', function() {
                        $document.off("click", onDocumentClick);
                    });
                }
            }
        }
    ]);/**
 * Created by apoorvaagrawal on 16/11/16.
 */
