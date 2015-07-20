angular.module('fCRM')
  	.controller('CommentController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$restful', '$facebook', '$auth',
    	function ($scope, $rootScope, $state, $stateParams,  $http, $restful, $facebook, $auth){	
          $scope.getlist = function (){
          	$scope.conversationLoading = true;
            $restful.post('comments/getcomment','', function (err, resp){
              $scope.conversationLoading = false;
              $scope.listcomment         = resp.data;
            })
          };
          $scope.getlist();
          $scope.postbycomment = function() {
          }

  	}])
    .controller('DetailComment', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$restful', '$facebook', '$auth',
      function ($scope, $rootScope, $state, $stateParams,  $http, $restful, $facebook, $auth){  
          $scope.postbycomment = function() {
            $scope.conversationId = $stateParams.conversationId;
            $restful.post('comments/postbycomment',{conversationId:$scope.conversationId}, function (err, resp){
                $scope.postbycomment = resp.data;
                $scope.page          =  resp.page;
            });
          }
          $scope.postbycomment();
    }])
