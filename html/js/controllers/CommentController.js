angular.module('fCRM')
	.controller('CommentController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$restful', '$facebook', '$auth',
	function ($scope, $rootScope, $state, $stateParams,  $http, $restful, $facebook, $auth){	
      $scope.getlist = function (){
        $restful.post('comments/getcomment','', function (err, resp){
              console.log(resp);
        })
      };
      $scope.getlist();

	}])