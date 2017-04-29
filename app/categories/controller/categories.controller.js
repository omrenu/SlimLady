//(function(){
//
//    'use strict';
//     angular.module('SlimLady').
//         controller('CategoryCtrl',CategoryCtrl);
//
//    function CategoryCtrl($scope,$state,$stateParams,Api)
//    {
//        var vm = this;
//        vm.workouts = [];
//
//        vm.catName = $stateParams.categoryId;
//
//        init();
//
//        function init(){
//
//            if(vm.catName === 'custom')
//            {
//                Api.workouts.getDashboard()
//            }
//            else
//            {
//                Api.categories.get(vm.catName).then(function(resp){
//
//                    if(vm.catName == "strength")
//                    {
//                        vm.workouts = resp.workouts.slice(0,8);
//                    }else{
//
//                        vm.workouts = resp.workouts;
//                    }
//                    $scope.$emit('titleChange',vm.catName);
//                });
//            }
//
//
//        }
//
//
//    }
//
//
//
//})();
/**
* Created by apoorvaagrawal on 02/12/16.
*/

(function(){

    'use strict';
    angular.module('SlimLady').
        controller('CategoryCtrl',CategoryCtrl);

    function CategoryCtrl($scope,$state,$stateParams,Api)
    {
        var vm = this;
        vm.workouts = [];

        vm.catName = $stateParams.categoryId;

        init();

        function init(){

            if(vm.catName === 'custom')
            {
                Api.workouts.getDashboard()
            }
            else
            {
                Api.workouts.get(vm.catName).then(function(resp){

                    if(vm.catName == "strength")
                    {
                        vm.workouts = resp.workouts.slice(0,8);
                    }else{

                        vm.workouts = resp.workouts;
                    }
                    $scope.$emit('titleChange',vm.catName);
                });
            }


        }


    }



})();/**
* Created by apoorvaagrawal on 02/12/16.
*/
