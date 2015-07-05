angular.module('fCRM')
	.controller('CommentController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$restful', '$facebook', '$auth',
	function ($scope, $rootScope, $state, $stateParams,  $http, $restful, $facebook, $auth){	

        $scope.users    = {};
        $scope.infoPage = {};
        $scope.selectedPage = {};
        $scope.checkUser = function (data){
    		$restful.post('users/checkinFB', data, function (err, resp){
                hideLoader();
        	    if(err){
                }else {
                  $auth.setUser(resp.data);
                  $scope.users    = resp.data;
                  $scope.infoPage = resp.pageinfo;
                  $scope.selectedPage = $scope.infoPage[0];
                }
    		})
    	};
        $scope.load = function() {
        }

	}])