"use strict";
var fb_sdk = {
	appId		: "1578258869101648",
	permission	: "email, public_profile, manage_pages, read_page_mailboxes, read_mailbox, publish_pages"
};
var ApiPath = "http://sc.vn:1337/api/v1/";
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
            .otherwise('/dashboard');

        $stateProvider
            .state('app', {
                abstract: true,
                url: '/',
                templateUrl: 'views/app.html'
            })
            .state('login', {
                abstract: false,
                url: '/login?step=',
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })

            .state('accessing', {
                abstract: false,
                url: '/accessing?step=',
                templateUrl: 'views/accessing.html',
                controller: 'AccessingController'
            })

            .state('app.dashboard', {
                url: 'dashboard',
                templateUrl: 'views/dashboard.html'
            })
}])
.run([function (){

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