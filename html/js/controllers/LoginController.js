angular.module('fCRM')
	.controller('LoginCtrl', ['$scope', '$state', '$stateParams',  function ($scope, $stateParams){
		$scope.login = function (){
			window.location = "http://www.facebook.com/dialog/oauth/?scope=" + fb_sdk.permission + "&client_id="+ fb_sdk.appId +"&redirect_uri=http://sc.vn:8000&response_type=code";
		}
	}])