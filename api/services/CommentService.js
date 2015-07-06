"use strict";

var fb = require('fb');

module.exports = {

	getPageByStatus : function(user_id, callback){
		Pages.findOne({stt : '1', user_id: user_id}, function (error, page){
			callback(error, page);
		});
	},

	 getPost : function(page, callback){
		fb.setAccessToken(page.access_token);
		fb.api('/' + page.page_id + '/posts' ,{limit: 10}, function (resp) {
			callback(resp);
		});
	},

	CreateConversation : function(content,user_id,page,callback) {
		var conversation = {};
		var val          = content.data;
		for(property in val) {
			var item                     = val[property];
			conversation.conversation_id = item.id;
			conversation.type            = 'comment';
			conversation.link            = item.actions.link;
			conversation.messages        = item.message;
			conversation.page_id         = page.page_id;
			conversation.user_id         = user_id;
			
			Conversations.create(conversation, function (err, doc){
				callback((err) ? true: false, doc);
			});
		}
	}
};