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
			service.getCheckDataPost(item.id,function(err,data) {
				if(!data) {
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
				} else {
					service.getCheckMessagePost();
					console.log(data.conversation_id);
					callback_next();
				}
			});
		}); 
	},
	//add create message
	createMessage : function(content,conversation_id) {
		if(content) {
			async.eachSeries(content.data, function (item , callback) {
				console.log(item);
				var mess             = {};
				mess.message         = item.message;
				mess.profile_id      = item.from.id;
				mess.name            = item.from.name;
				mess.message_id      = item.id;
				mess.conversation_id = conversation_id
				Messages.create(mess, function (err,doc) {
					if(!err)
						callback();
				});
			});
		}
	},
	//get all data check post isset
	getCheckDataPost : function(id_post,callback) {
		Conversations.findOne({conversation_id :id_post},function (err ,data) {
			callback(err,data);
		}); 
	},
	getCheckMessagePost : function (id_message ,callback) {
		Messages.findOne({message_id:id_message},function (err,data) {
			callback(err,data);
		});
	}
};
module.exports = service;