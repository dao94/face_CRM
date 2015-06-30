angular.module('fCRM')
	.controller('InboxsController', ['$scope', '$state', '$stateParams', '$restful', function ($scope, $state, $stateParams, $restful){
		
		$restful.post('messages/getMessage',{username: 'idsweb.vn'},function (err,resp) {
                      console.log(resp);
        });
	}])