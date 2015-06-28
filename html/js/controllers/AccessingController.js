angular.module('fCRM')
	.controller('AccessingController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$restful', '$facebook', '$auth',
	function ($scope, $rootScope, $state, $stateParams,  $http, $restful, $facebook, $auth){	

        $scope.users    = {};
        $scope.infoPage = {};
        $scope.func_click =  function(name) {
            $('.box-tab').css('display','none');
            $(".box-tab[data-rel='"+name+"']").css('display','block');
        }
        $scope.checkUser = function (data){
    		$restful.post('users/checkinFB', data, function (err, resp){
                hideLoader();

        	    if(err){

                }else {
                  $auth.setUser(resp.data);
                  $scope.users    = resp.data;
                  $scope.infoPage = resp.pageinfo;
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


        /*
            Animation 
        */

        var pageWrap = document.getElementById( 'pagewrap' ),
        pages = [].slice.call( pageWrap.querySelectorAll( 'div.container' ) ),
        currentPage = 0,
        triggerLoading = [].slice.call( pageWrap.querySelectorAll( 'a.pageload-link' ) ),
        loader = new SVGLoader( document.getElementById( 'loader' ), { speedIn : 300, easingIn : mina.easeinout } );

        function init() {
            loader.show();   
        }
        function hideLoader(){
            loader.hide();
            classie.removeClass( pages[ currentPage ], 'show' );
            // update..
            currentPage = currentPage ? 0 : 1;
            classie.addClass( pages[ currentPage ], 'show' );
        }
        init();

	}])