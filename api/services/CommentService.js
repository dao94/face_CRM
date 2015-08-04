"use strict";

var fb    = require('fb');
var async = require('async');

var service = {
	getPageByStatus : function(pagename, user_id, callback){
		var data = {
			user_id: user_id,
			'$or': [
					{'page_id': pagename},
					{'username': pagename}
			]
		};
		Pages.findOne(data, function (error, page){
			callback(error, page);
		});
	},

	showMessage : function(conversationId, page_id, callback) {
		Messages.find({where: {conversation_id:conversationId,profile_id: {'!': page_id }},sort:{'created_time':-1},limit:20},function (err,data) {
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
							service.createMessage(item.comments.data,doc.id,page,function (error,resp) {
								FacebookService.getCommentReply(page,resp.message_id,function (data_rep) {
									if(data_rep.data) {
										data_rep.data.forEach(function(item) {
											service.createMessNew(item,resp.message_id,doc.id,function (error,content) {
												console.log(error);
											});
										});
									}
								});
							});
						}
						if(!err)
							callback_next();
					});
				} else {
					//neu comment co du lieu
					if(item.comments) {
						async.eachSeries(item.comments.data, function (val,callback_mess){
							service.getCheckMessagePost(val.id,data.id,function (error,resp) {
								async.waterfall([
									function (callback_walter) {
										if(!resp) {
											service.createMessNew(val,'',data.id,function (err,resp) {
												FacebookService.getCommentReply(page,resp.id,function (data_rep) {
													callback_walter('',data_rep,resp,data);
												});
											});
										}else {
											FacebookService.getCommentReply(page,resp.message_id,function (data_rep) {
												callback_walter('',data_rep,resp,data);
											});
										}	
									},
									function (data_rep,resp,data,callback_walter) {
										if(data_rep.data) {
											data_rep.data.forEach(function(item) {
												service.getCheckMessagePost(item.id,data.id,function(error,res) {
													if(!res) {
														service.createMessNew(item,resp.id,data.id,function (error,content) {
															console.log(error);
														});
													}
												});
											});
										}
									}
								]);
							});
							callback_mess();
						});
					}
					callback_next();
				}
			});
		},function() {
			callback();
		}); 
	},

	//add create message
	createMessage : function(content,conversation_id,page,callback) {
		if(content) {
			content.forEach(function(item) {
				var mess             = {};
				mess.message         = item.message;
				mess.created_time    = item.created_time;
				mess.profile_id      = item.from.id;
				mess.name            = item.from.name;
				mess.message_id      = item.id;
				mess.conversation_id = conversation_id
				Messages.create(mess, function (err,doc) {
					console.log(err);
					callback(err,doc);
				});
			});
		}
	},

	createMessNew : function(content,parent_id,conversation_id,callback) {
		if(content) {
			var mess             = {};
			mess.created_time    = content.created_time;
			mess.parent_id       = parent_id;
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
	},

	getCheckMessageById : function (id_message,callback) {
		Messages.findOne({id:id_message,parent_id:''},function (err,data) {
			callback(err,data);
		});
	},

	getMessageByid : function (id_message, callback) {
		Messages.findOne({id:id_message},function (err,data) {
			callback(err,data);
		});
	},

	getMessageByParentId : function (id_parent, callback) {
		Messages.find({parent_id:id_parent},function (err,data) {
			callback(err,data);
		});
	},

	getPostByComment : function(id_conversation,callback) {
		Conversations.findOne({id :id_conversation},function (err ,data) {
			callback(err,data);
		}); 
	},

};
module.exports = service;