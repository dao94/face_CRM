angular.module('fCRM')
	.controller('AccessingController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$restful', '$facebook', '$auth',
	function ($scope, $rootScope, $state, $stateParams,  $http, $restful, $facebook, $auth){	

        $scope.users    = {};
        $scope.infoPage = {};
        $scope.selectedPage = {};
        $scope.checkUser = function (data){
    		$restful.post('users/checkinFB', data, function (err, resp){
                hideLoader();
        	    if(err){
                }else {
                  $auth.setUser(resp.data);
                  $scope.users    = resp.data;
                  $scope.infoPage = resp.pageinfo;
                  $scope.selectedPage = $scope.infoPage[0];
                }
    		})
    	};

        $scope.selectPage = function (page){
            $scope.selectedPage = page;
        }   

        $scope.enterPage = function (){
            $state.go('app.inboxs', {page: $scope.selectedPage.username ? $scope.selectedPage.username : $scope.selectedPage.page_id});
        }

		$rootScope.$on('fb.auth.authResponseChange', function (evt, resp){
            // Kiểm tra session login 
            if(resp.status == 'connected'){
            	$facebook.api('/me').then(function (info){
                    info.accessToken = resp.authResponse.accessToken;
                    info.expiresIn   = resp.authResponse.expiresIn;
            		$scope.checkUser(info);
            	});
            }else {
                window.location = "http://www.facebook.com/dialog/oauth/?scope=" + fb_sdk.permission + "&client_id="+ fb_sdk.appId +"&redirect_uri=http://face.local.com/html&response_type=code";
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