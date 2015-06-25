angular.module('fCRM')
	.controller('AccessingController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$restful', '$facebook',
	function ($scope, $rootScope, $state, $stateParams,  $http, $restful, $facebook){	
		$scope.checkUser = function (data){

			$restful.post('users/checkinFB', data, function (err, resp){
				console.log(err, resp);
			})
			
		}

		$rootScope.$on('fb.auth.authResponseChange', function (evt, resp){
        // Kiểm tra session login 
            if(resp.status == 'connected'){
            	console.log('connected', resp);
            	$facebook.api('/me').then(function (resp){
            		$scope.checkUser(resp);
            	})
                // Gủi request lên server lấy thông tin user 
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