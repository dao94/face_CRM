angular.module('fCRM')
	.controller('InboxsController', ['$scope', '$state', '$stateParams', '$restful', function ($scope, $state, $stateParams, $restful){
		$scope.list_conversation   = [];
		$scope.conversationLoading = true;
		console.log('hello world');

		
		

		$scope.syncMessage = function (callback){
			$restful.post('messages/getMessage',{username: $stateParams.page},function (err,resp) {
				return (callback && typeof callback == 'function ') ? callback() : false;
        	});
		}


        $scope.getConversation = function (){
        	$restful.get('conversations/show',{username: $stateParams.page},function (err,resp) {
				$scope.conversationLoading = false;
				$scope.list_conversation   = resp.data;
				$state.transitionTo('app.inboxs', {page: $stateParams.page, conversationId: resp.data[0].id})
        	});
        }

        
        if(!$stateParams.conversationId){
			$scope.syncMessage();
			$scope.getConversation();
		}else {
			if($scope.list_conversation.length == 0){
				$scope.syncMessage();
				$scope.getConversation();
			}
		}
	}])