"use strict";

var fb    = require('fb');
var async = require('async');

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

	CreateConversation :  function (content,user_id,page,callback) {
		async.eachSeries(content.data , function (item , callback_next) {
			var conversation             = {};
			conversation.conversation_id = item.id;
			conversation.type            = 'comments';
			conversation.link            = item.actions.link;
			conversation.messages        = item.message;
			conversation.customer        = item.from;
			conversation.page_id         = page.page_id;
			conversation.user_id         = user_id;
			Conversations.create(conversation, function (err, doc){
				if(!err)
					callback_next();
				callback((err) ? true: false, doc);
			});
		}); 
	}
};