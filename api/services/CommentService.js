"use strict";

var fb    = require('fb');
var async = require('async');

var service = {
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
	// add conversation
	CreateConversation : function (content,user_id,page,callback) {
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
				service.createMessage(item.comments,doc.id);
				if(!err)
					callback_next();
				callback((err) ? true: false, doc);
			});
		}); 
	},
	//add create message
	createMessage : function(content,conversation_id) {
		if(content) {
			async.eachSeries(content.data, function (item , callback) {
				var mess       = {};
				mess.message    = item.message;
				mess.profile_id = item.from.id;
				mess.name       = item.from.name;
				Messages.create(mess, function (err,doc) {
					console.log(doc);
					if(!err)
						callback();
				});
			});
		}
	}

};
module.exports = service;