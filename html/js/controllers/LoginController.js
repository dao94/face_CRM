angular.module('fCRM')
	.controller('LoginCtrl', ['$scope', '$state', '$stateParams', '$restful', function ($scope, $state, $stateParams, $restful){
		$scope.login = function (){
			window.location = "http://www.facebook.com/dialog/oauth/?scope=" + fb_sdk.permission + "&client_id="+ fb_sdk.appId +"&redirect_uri=http://face.local.com/html&response_type=code";
		}
		
		$restful.post('users/test','',function (err,resp) {
                      console.log(resp);
        });
	}])