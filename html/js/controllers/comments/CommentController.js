angular.module('fCRM')
  	.controller('CommentController', ['$scope','$state', '$stateParams', '$restful','$interval','growl',function ($scope, $state, $stateParams, $restful,$interval,growl){
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
          // $interval($scope.getlist,8000);

  	}])
    .controller('DetailComment', ['$scope', '$state', '$stateParams', '$restful','$interval','growl',function ($scope, $state, $stateParams, $restful,$interval,growl){
          $scope.listbycomment = function() {
            $scope.conversationId = $stateParams.conversationId;
            $restful.post('comments/postbycomment',{pageId:$stateParams.page,conversationId:$scope.conversationId}, function (err, resp){
                $scope.postbycomment  = resp.data.content;
                $scope.page           = resp.page;
                $scope.message        = resp.data.message || [];
                $scope.message_parent = resp.data.message_parent;
            });
          };
          $scope.listbycomment();
          // $interval($scope.postbycomment,8000);
          $scope.push_comment = function (commentId,message) {
            $restful.post('comments/pushComment',{comment:message,comment_id:commentId,pagename:$stateParams.page}, function (err, resp){
                $scope.comment_reply = '';
                $scope.message.push(resp.data);
                growl.addSuccessMessage("Create a comment the success !",{ttl: 4000});
            });
          };
          $scope.checkIfEnterKeyWasPressed = function($event,commentId,message) {
            var keyCode = $event.which || $event.keyCode;
            if (keyCode === 13) {
              $scope.push_comment(commentId,message);
            }
          };
          $scope.likecomment = function (comment_id) {
            $restful.post('comments/likecomment',{comment_id:comment_id,pagename:$stateParams.page},function (err,res) {
                console.log(res);
            });
          };
          $scope.delComment =  function (comment_id)  {
            $restful.post('comments/delComment',{comment_id:comment_id,pagename:$stateParams.page},function (err,res) {
                if(res.error == false) {
                  $scope.listbycomment();
                  location.reload();
                  // growl.addSuccessMessage("Delete a comment the success !",{ttl: 4000});
                }
            });
          }
    }])
