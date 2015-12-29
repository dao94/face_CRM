angular.module('fCRM')
	.controller('AppController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$restful', '$facebook', '$auth',
	function ($scope, $rootScope, $state, $stateParams,  $http, $restful, $facebook, $auth){	
        $scope.load = function() {
          $restful.post('pages/list',{page_name:'daotran'},function (error, res) {
            $scope.list_page = res.data;
          })
        }
        $scope.load();
	}])