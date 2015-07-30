angular.module('fCRM')
  	.controller('CommentController', ['$scope', '$state', '$stateParams', '$restful','$interval',function ($scope, $state, $stateParams, $restful,$interval){
          $scope.transitioned = false;
          $scope.getlist = function (){
          	// $scope.conversationLoading = true;
            $restful.post('comments/getcomment',{username: $stateParams.page}, function (err, resp){
              // $scope.conversationLoading = false;
              $scope.listcomment         = resp.data;
              if(!$scope.transitioned){
                $state.go('app.comments.detail', {page: $stateParams.page, conversationId: resp.data[0].id});
                $scope.transitioned      = true;
              }
            })
          };
          $scope.getlist();
          var a;
          a = $interval($scope.getlist,5000);

  	}])
    .controller('DetailComment', ['$scope', '$state', '$stateParams', '$restful','$interval',function ($scope, $state, $stateParams, $restful,$interval){
          $scope.postbycomment = function() {
            $scope.conversationId = $stateParams.conversationId;
            $restful.post('comments/postbycomment',{pageId:$stateParams.page,conversationId:$scope.conversationId}, function (err, resp){
                $scope.postbycomment  = resp.data.respon;
                $scope.page           =  resp.page;
                $scope.message        = resp.data.message;
                $scope.message_parent = resp.data.message_parent;
            });
          }
          $scope.postbycomment();
          var a;
          a = $interval($scope.postbycomment,5000);
    }])
