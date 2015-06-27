angular.module('fCRM')
	.controller('AccessingController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$restful', '$facebook',
	function ($scope, $rootScope, $state, $stateParams,  $http, $restful, $facebook){	
		$scope.checkUser = function (data){
			$restful.post('users/checkinFB', data, function (err, resp){
				if(err){

                }
			})
		};
    $scope.loadPage = function() {
      $restful.post('pages/list','',function (err,resp) {
          console.log(resp);
      });
    }

		$rootScope.$on('fb.auth.authResponseChange', function (evt, resp){
        // Kiểm tra session login 
            if(resp.status == 'connected'){
            	$facebook.api('/me').then(function (info){
                    info.accessToken = resp.authResponse.accessToken;
                    info.expiresIn   = resp.authResponse.expiresIn;
            		$scope.checkUser(info);
            	});
                // Gủi request lên server lấy thông tin user
                $scope.loadPage();
                //$scope.checklogin(resp);
            }else {
                // Nếu chưa có session thì tiến hành login;
              $facebook.login().then(function (resp){
              	console.log('login', resp);
                    //$scope.checklogin(resp);
              }, function (errr){
              	console.log('errr', errr);
                    //$scope.authError = "Đăng nhập facebook không thành công";
              })
            }
        })



	}])