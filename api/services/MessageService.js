"use strict";

var fb = require('fb');

var Message = {
	getPageByUsername: function(pageName, user_id, callback){
		Pages.findOne({username : pageName, user_id: user_id}, function (error, page){
			callback(error, page);
		});
	},

	 getMessage : function(page, callback){
 		
		fb.setAccessToken(page.access_token);
		fb.api('/' + page.page_id + '/conversations' ,{limit: 10}, function (resp) {
			callback(resp)
		});
	},
	parseMessageData : function (message){
		var ret = {};

	}
}

module.exports =  Message;

