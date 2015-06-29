angular.module('fCRM')
	.controller('AccessingController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$restful', '$facebook', '$auth',
	function ($scope, $rootScope, $state, $stateParams,  $http, $restful, $facebook, $auth){	

        $scope.users    = {};
        $scope.infoPage = {};
        $scope.selectedPage = {};

<<<<<<< HEAD
         $scope.$on('$viewContentLoaded', function(event, viewConfig){
             console.log(viewConfig);
          });
=======

>>>>>>> e46e48ca9f6f106f41736fd4529bd502a488b87e
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
<<<<<<< HEAD
        $scope.loadPage = function() {
          $restful.post('pages/list','',function (err,resp) {
              console.log(resp);
          });
        };
=======

        $scope.selectPage = function (page){
            $scope.selectedPage = page;
        }   

        $scope.enterPage = function (){
            
            $state.go('app.inboxs', {page: $scope.selectedPage.username});
        }


        
>>>>>>> e46e48ca9f6f106f41736fd4529bd502a488b87e
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