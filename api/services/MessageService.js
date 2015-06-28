"use strict";

var fb = require('fb');

var Message = {
	getPageByUsername: function(pageName, user_id, callback){
		Page.findOne({username : pageName, user_id: user_id}, function (error, page){
			callback(error, page);
		});
	},

	 getMessage : function(page){
		fb.setAccessToken(page.accessToken);
		FB.api('/' + page.page_id + '/conversations' ,{}, function (content) {
			
		});
	}	
}








module.export = {

}

