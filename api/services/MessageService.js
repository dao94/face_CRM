"use strict";

var fb = require('fb');

var Message = {
	getPageByUsername: function(pageName, user_id, callback){
		Pages.findOne({username : pageName, user_id: user_id}, function (error, page){
			callback(error, page);
		});
	},

	getMessage : function(page, callback){
		if(!page){
			return false;
		}
		fb.setAccessToken(page.access_token);
		fb.api('/' + page.page_id + '/conversations' ,{limit: 10}, function (resp) {
			callback(resp)
		});
	},
	parseMessageData : function (message){
		var ret = {};

	},
	createMessage : function (content,callback) {
		// var message = {};
		// var val          = content.data;
		// for(var property in val) {
		// 	var item                     = val[property];
		// 	message.conversation_id = item.id;
		// 	message.type            = 'comments';
		// 	message.link            = item.actions.link;
		// 	message.messages        = item.message;
		// 	message.customer        =  item.from;
		// 	message.page_id         = page.page_id;
		// 	message.user_id         = user_id;
			
		// 	Conversations.create(message, function (err, doc){
		// 		callback((err) ? true: false, doc);
		// 	});
		// }
	}//end createMessage

}

module.exports =  Message;

