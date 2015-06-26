angular.module('fCRM')
	.service('$auth', ['$rootScope', '$http', '$resource', function ($rootScope, $http, $resource){
		var local = window.localStorage;
		var $auth = {
			var authKey = "__Authorization";
			var userKey = "__User";

			setToken: function (token){
				if(!token){
					token = $auth.getToken() ? $auth.getToken() : null;
				}
				local.setItem(authKey, token);
				$http.defaults.headers.common['Authorization'] = token;
			},
			getToken: function (){
				return local.getItem(authKey) || "";
			},
			clearToken: function (){
				local.removeItem(authKey);
				delete $http.defaults.headers.common['Authorization'];
			},
			setUser: function (user){
				$auth.setToken(user.token);
				local.setItem(__User, user);
			},
			getUser: function (){
				return local.getItem(__User);
			},
			clearUser: function (){
				$auth.clearToken();
				local.removeItem(__User);
			}

		};
	}])