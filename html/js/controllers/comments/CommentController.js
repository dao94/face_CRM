angular.module('fCRM')
  	.controller('CommentController', ['$scope', '$state', '$stateParams', '$restful',function ($scope, $state, $stateParams, $restful){
          $scope.transitioned = false;
          $scope.getlist = function (){
          	$scope.conversationLoading = true;
            $restful.post('comments/getcomment',{username: $stateParams.page}, function (err, resp){
              $scope.conversationLoading = false;
              $scope.listcomment         = resp.data;
              if(!$scope.transitioned){
                $state.go('app.comments.detail', {page: $stateParams.page, conversationId: resp.data[0].id});
                $scope.transitioned      = true;
              }
            })
          };
          $scope.getlist();

  	}])
    .controller('DetailComment', ['$scope', '$state', '$stateParams', '$restful',function ($scope, $state, $stateParams, $restful){
          $scope.postbycomment = function() {
            $scope.conversationId = $stateParams.conversationId;
            $restful.post('comments/postbycomment',{pageId:$stateParams.page,conversationId:$scope.conversationId}, function (err, resp){
                $scope.postbycomment = resp.data;
                $scope.page          =  resp.page;
            });
          }
          $scope.postbycomment();
    }])
