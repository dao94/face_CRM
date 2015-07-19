"use strict";
var fb_sdk = {
	appId		: "1578258869101648",
	permission	: "email, public_profile, manage_pages, read_page_mailboxes, read_mailbox, publish_pages"
};
var ApiPath = "http://localhost:1337/api/v1/";
angular.module('fCRM', 
	[
	'ui.router',
	'ngFacebook',
    'ngResource',
    'ngSanitize'
	]
)
.config(['$facebookProvider', function ($facebookProvider){
    $facebookProvider.setAppId(fb_sdk.appId);
    $facebookProvider.setPermissions(fb_sdk.permission);
}])

.config(['$stateProvider',   '$urlRouterProvider',   '$controllerProvider',   '$compileProvider',   '$filterProvider',   '$provide', 
	function ($stateProvider,   $urlRouterProvider,   $controllerProvider,   $compileProvider,   $filterProvider,   $provide){
		$urlRouterProvider
            .otherwise('page/binh-luan');

        $stateProvider
            .state('app', {
                abstract: true,
                url: '/',
                templateUrl: 'views/app.html',
                controller: 'AppController'
            })
            .state('login', {
                abstract: false,
                url: '/login?step=',
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })

            .state('accessing', {
                abstract    : false,
                url         : '/accessing?step=',
                templateUrl : 'views/accessing.html',
                controller  : 'AccessingController'
            })

            .state('app.dashboard', {
                url         : ':page/dashboard',
                templateUrl : 'views/dashboard.html'
            })
            .state('app.comments', {
                url: ':page/binh-luan',
                templateUrl: 'views/comments/index.html',
                controller: 'CommentController'
            })
            .state('app.inboxs', {
                url: ':page/tin-nhan',
                templateUrl: 'views/inbox/index.html',
                controller: 'InboxsController',
                views: {
                    
                }
            })
            .state('app.inboxs_detail', {
                url: ':page/tin-nhan/:conversationId',
                templateUrl: 'views/inbox/index.html',
                //controller: 'InboxDetailCtrl'
            })
            .state('app.orders', {
                url: ':page/don-hang',
                templateUrl: 'views/order/index.html',
            })
            .state('app.products', {
                url: ':page/san-pham',
                templateUrl: 'views/products/index.html',
            });
}])
.run(['$rootScope', '$auth', '$state', '$stateParams', '$templateCache', function ($rootScope, $auth, $state, $stateParams, $templateCache){
    
    $rootScope.USER = $auth.getUser() || false;

    $rootScope.$on('$stateChangeStart', function (evt,toState,toParams) {
        if(toState.name.indexOf('app') !== -1){
            
            if(!$auth.getUser()){
                console.log('$stateChangeStart', $auth.getUser());
                evt.preventDefault();
                $auth.clearUser();
                $state.go('login');
            }
        }
    });




    $auth.setToken();
	(function(){
         // If we've already installed the SDK, we're done
         if (document.getElementById('facebook-jssdk')) {return;}
         // Get the first script element, which we'll use to find the parent node
         var firstScriptElement = document.getElementsByTagName('script')[0];
         // Create a new script element and set its id
         var facebookJS = document.createElement('script'); 
         facebookJS.id = 'facebook-jssdk';
         // Set the new script's source to the source of the Facebook JS SDK
         facebookJS.src = '//connect.facebook.net/en_US/all.js';
         // Insert the Facebook JS SDK into the DOM
         firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
    }());

}])