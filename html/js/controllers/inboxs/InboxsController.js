angular.module('fCRM')
	.controller('InboxsController', ['$scope', '$state', '$stateParams', '$restful', function ($scope, $state, $stateParams, $restful){
		$scope.list_conversation   = [];
		$scope.conversationLoading = true;
		$scope.transitioned 	   = false;

		$scope.syncMessage = function (callback){
			$restful.post('messages/syncMessage',{username: $stateParams.page},function (err, resp) {
				return (callback && typeof callback == 'function ') ? callback() : false;
        	});
		}


        $scope.getConversation = function (){
        	$restful.get('conversations/show',{username: $stateParams.page},function (err, resp) {
				$scope.conversationLoading = false;
				$scope.list_conversation   = resp.data;

				if(!$scope.transitioned){
					$state.transitionTo('app.inboxs.detail', {page: $stateParams.page, conversationId: resp.data[0].id});
					$scope.transitioned 	   = true;
				}
        	});
        }

		$scope.syncMessage(function (){
			$scope.getConversation();	
		});
		$scope.getConversation();	
		

	}])
	.controller('InboxDetailCtrl', ['$scope', '$state', '$stateParams', '$restful', function ($scope, $state, $stateParams, $restful){
		$scope.list_message        = [];
		$scope.conversationLoading = true;
		$scope.conversationId      = $stateParams.conversationId;

		$scope.getMessage = function (){
			$scope.conversationLoading = true;
			$restful.get('messages/getMessage',{conversation: $scope.conversationId},function (err, resp) {
				$scope.conversationLoading = false;
				$scope.list_message        = resp.data;
        	});
		}


		if ($scope.conversationId) {
			$scope.getMessage();
		};
	}])