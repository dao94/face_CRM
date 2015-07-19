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
	showMessage : function(conversationId, callback) {
		Messages.find({where: {conversation_id:conversationId},sort:{'createdAt':-1}},function (err,data) {
			callback(err,data);
		});
	},
	ShowPostBypage : function(userId, page, callback) {
		Conversations.find({user_id:userId,page_id:page.id},function (err,data) {
			callback(err,data);
		});
	},
	// add conversation
	CreateConversation : function (content,user_id,page,callback) {
		async.eachSeries(content.data , function (item , callback_next) {
			service.getCheckDataPost(item.id,function(err,data) {
				// check data isset in database
				if(!data) {
					var conversation             = {};
					conversation.conversation_id = item.id;
					conversation.type            = 'comments';
					conversation.link            = item.actions[0].link;
					conversation.messages        = item.message;
					conversation.customer        = item.from;
					conversation.page_id         = page.id;
					conversation.user_id         = user_id;
					Conversations.create(conversation, function (err, doc){
						//neu co comment trong bai viet
						if(item.comments) {
							service.createMessage(item.comments.data,doc.id);
						}
						if(!err)
							callback_next();
						callback((err) ? true: false, doc);
					});
				} else {
<<<<<<< HEAD
					//neu comment co du lieu
					if(item.comments) {
						async.eachSeries(item.comments.data, function (val,callback_mess){
							service.getCheckMessagePost(val.id,data.id,function (error,resp) {
								if(!resp) {
									service.createMessNew(val,data.id,function (err,resp) {
										console.log(err);
									});
								}
							});
							callback_mess();
						});
					}
=======
					service.getCheckMessagePost();
					
>>>>>>> 559f9872cfef87b75eb08f55bd2e2dad36a50c49
					callback_next();
				}
			});
		}); 
	},
	//add create message
	createMessage : function(content,conversation_id) {
		if(content) {
<<<<<<< HEAD
			async.eachSeries(content, function (item , callback) {
=======
			async.eachSeries(content.data, function (item , callback) {
>>>>>>> 559f9872cfef87b75eb08f55bd2e2dad36a50c49
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
	createMessNew : function(content,conversation_id,callback) {
		if(content) {
			var mess             = {};
			mess.message         = content.message;
			mess.profile_id      = content.from.id;
			mess.name            = content.from.name;
			mess.message_id      = content.id;
			mess.conversation_id = conversation_id
			Messages.create(mess, function (err,doc) {
				callback((err)? true : false,doc);
			});
		}
	},
	//get all data check post isset
	getCheckDataPost : function(id_post,callback) {
		Conversations.findOne({conversation_id :id_post},function (err ,data) {
			callback(err,data);
		}); 
	},
	getCheckMessagePost : function (id_message, id_conversation,callback) {
		Messages.findOne({message_id:id_message,conversation_id : id_conversation},function (err,data) {
			callback(err,data);
		});
	}
};
module.exports = service;