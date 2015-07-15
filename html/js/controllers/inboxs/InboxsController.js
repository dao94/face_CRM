angular.module('fCRM')
	.controller('InboxsController', ['$scope', '$state', '$stateParams', '$restful', function ($scope, $state, $stateParams, $restful){
		$scope.list_conversation = [];
		$restful.post('messages/getMessage',{username: $stateParams.page},function (err,resp) {
			console.log(resp);
        });


        $scope.getConversation = function (){
        	$restful.get('conversations/show',{username: $stateParams.page},function (err,resp) {
				$scope.list_conversation = resp.data;
        	});
        }

        $scope.getConversation();
	}])