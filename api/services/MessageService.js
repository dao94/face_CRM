"use strict";

var fb      = require('fb');
var request = require('request');
var async   = require('async');

var Message = {
	getPageByUsername: function(pageName, user_id, callback){
		Pages.findOne({username : pageName, user_id: user_id}, function (error, page){
			callback(error, page);
		});
		return;
	},
	hasMessage: function (messageId, callback){
		Messages.findOne({message_id: messageId}, function (error, page){
			if(error){
				return callback(true);
			}
			return callback(page);
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
						    message_id : item.id,
						  	sender: {
						  		profile_id	: item.from.id,
						  		fullname 	: item.from.name,
						  	},
							own: (item.from.id == conversation.page_id) ? true : false,
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

		
		
		/*async.eachSeries(messages, function (item, next){
			var data = {
				conversation_id: conversation.id,
			    message_id : item.id,
			  	sender: {
			  		profile_id	: item.from.id,
			  		fullname 	: item.from.name,
			  	},
				own: (item.from.id == conversation.page_id) ? true : false,
				messsage: item.message,
				create_at: item.create_at,
			};

			Messages.create(data, function (err, resp){
				next()
			})
		})*/
	},

	getMessage : function(page, callback){
		if(!page){
			return false;
		}
		
		fb.setAccessToken(page.access_token);
		console.log('page access_token', page.access_token);
		fb.api('/' + page.page_id + '/conversations' ,{limit: 10}, function (resp) {
			console.log('getConversation', resp);
			Message.parseMessageData(page.page_id, resp, function (){
				callback(resp);
			});
			
		});
	},
	parseMessageData : function (page, messages, callback){
		if(!messages.data || page.perms.indexOf('ADMINISTER') == -1){
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
							if(item.senders.data[i].id !== page){
								cus_sender = item.senders.data[i];
							}
						}

						CustomerService.hasCustomer(page, cus_sender.id, function (customer){
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
									"page_id"			: page,
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

						if(item.messages && item.messages.paging){
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
						
					}
				], function (){
					next();
				})
			});
		})
		

		async.parallel(tasks, function (){
			console.log('DONE');
			callback();
		})
	},
	getMessagePaging : function (messages, callback, temp){
		temp = temp || [];
		messages = typeof messages == 'object' ? messages : JSON.parse(Messages);
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

