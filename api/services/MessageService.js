"use strict";

var fb      = require('fb');
var request = require('request');
var async   = require('async');
var _       = require('underscore');

var Message = {
	getPageByUsername: function(pageName, user_id, callback){
		var data = {
			user_id: user_id,
			'$or': [
				{'page_id': pageName},
				{'username': pageName}
			]
		};

		Pages.findOne(data, function (error, page){
			
			callback(error, page);
		});
		return;
	},
	hasMessage: function (messageId, callback){

		Messages.findOne({message_id: messageId}, function (error, message){
			if(error){
				return callback(true);
			}
			return callback(message);
		});

	},

	getMessage: function (conversation_id, filter,  callback){
		var itemPage = (filter && filter.limit) || 20,
			page     = (filter && filter.page)  || 1,
			offset   = (page - 1) * itemPage;

		Messages.find({where: {conversation_id: conversation_id},    limit: 10, skip: 0, sort: {create_at: 0}}, function (error, message){
			if(error){
				throw new Error(error);
			}
			callback(null, message);
		});
	},
	postMessage: function (pageToken, conversation, message, callback){
		fb.setAccessToken(pageToken);
		fb.api('/' + conversation + '/messages', 'get', {message: message}, function (resp) {
			console.log('postMessage', resp);
			callback(resp);
		});
	},

	getFBMessageOfConversation: function (pageToken, conversation, callback){
		fb.setAccessToken(pageToken);
		fb.api('/v2.4/' + conversation + '/messages?fields=message,subject,from,to,id,created_time,attachments,shares,tags', 'GET', {limit: 100},  function (resp) {
			if(resp){
				callback((resp['data'].length > 0 ? null : true), resp);
			}else {
				callback(true);
			}
			

		});
	},
	
	/*
	* @conversation : Conversation object
	* @message : array message 
	*/
	createMessages: function (conversation, messages, callback){
		var task = [];
		messages.forEach(function (item){
			task.push(function (next){
				Message.hasMessage(item.id, function (result){
					if(!result){

						var data = {
							conversation_id: conversation.id,
							fb_conversation_id: conversation.conversation_id,
						    message_id : item.id,
						  	sender: {
						  		profile_id	: item.from.id,
						  		fullname 	: item.from.name,
						  	},
							own: (conversation.fb_page_id && (item.from.id == conversation.fb_page_id)) ? true : false,
							messsage: item.message,
							create_at: item.created_time,
						};

						Messages.create(data, function (err, resp){
							next();
						})
					}else {
						next();
					}
				})
				
			});
		});

		async.parallel(task, function (){
			callback();
		})
	},

	getFBMessage : function(page, callback){
		if(!page && !page.access_token){
			return false;
		}
		
		fb.setAccessToken(page.access_token);
		fb.api('/' + page.page_id + '/conversations' ,{limit: 20}, function (resp) {
			Message.parseMessageData(page, resp, function (){
				callback(resp);
			});
			
		});
	},
	parseMessageData : function (page, messages, callback){

		if(!messages.data){
			callback();
			return;
		}
		var tasks = [];
		messages.data.forEach(function (item){

			tasks.push(function (next){
				async.waterfall([
					function (cb){
						var cus_sender = {};

						for(var i = 0; i < item.senders.data.length; i++ ){
							if(item.senders.data[i].id !== page.page_id){
								cus_sender = item.senders.data[i];
							}
						}

						CustomerService.hasCustomer(page.page_id, cus_sender.id, function (customer){
							if(customer){
								cb(null, customer);
							}else{
								CustomerService.createCustomer({
									profile_id: cus_sender['id'],
									fullname: cus_sender['name'],
								}, function (err, resp){
									if(!err){return cb(null, resp)}
									return cb(true);
								})
							}
						});
					},
					function (customer,cb){
						var conversation_id = item.id;
						ConversationService.hasConversation(item.id, function (conversation){
							if(conversation == null){
								ConversationService.create('message', {
									"can_reply"			: item.can_reply,
									"link" 				: item.link,
									"unread_count"		: item.unread_count,
									"customer"			: customer.id,
									"user_id"			: customer.id,
									"page_id"			: page.id,
									"fb_page_id"		: page.page_id,
									"fb_time_update"    : item.updated_time,
									'conversation_id' 	: conversation_id,
									'last_message'		: item.snippet
								}, function (error, resp){
									cb(null, resp);
								})
							}else {
								cb(null, conversation);
							}
						})
					}, function (conversation, cb){

/*						if(item.messages && item.messages.paging){
							Message.getMessagePaging(item.messages, function (messages){
								Message.createMessages(conversation, messages, function (){
									cb(null);
								})
							})
						}else {
							Message.createMessages(conversation, item.messages.data, function (){
								cb(null);
							})
						}
*/						
						Message.getFBMessageOfConversation(page.access_token, conversation.conversation_id, function (hasData, data){
							Message.createMessages(conversation, data['data'], function (){
								cb(null);
							})
						})
					}
				], function (){
					next();
				})
			});
		})
		

		async.parallel(tasks, function (){
			callback();
		})
	},
	getMessagePaging : function (messages, callback, temp){
		temp = temp || [];
		messages = typeof messages == 'object' ? messages : JSON.parse(messages);
		if (messages.data) {
			messages.data.forEach(function (item){
				temp.push(item);
			})
		};

		if(messages && messages.paging){
			var next_url = messages.paging.next;
			request(next_url, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					Message.getMessagePaging(body, callback, temp);
				}
			})
		}else {
			callback(temp);
			return;
		}
	}

}

module.exports =  Message;

