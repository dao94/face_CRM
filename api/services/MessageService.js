"use strict";

var fb      = require('fb');
var request = require('request');
var async   = require('async');

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
		console.time('done');
		fb.setAccessToken(page.access_token);
		fb.api('/' + page.page_id + '/conversations' ,{limit: 10}, function (resp) {
			console.log(resp)
			Message.parseMessageData(page.page_id, resp, function (){
				callback(resp);
			});
			
		});
	},
	parseMessageData : function (page, messages, callback){
		if(!messages.data){
			// Không có message
		}

		
		async.eachSeries(messages.data, function loop(item, next){
			async.waterfall([
				function (cb){
					var cus_sender = {};

					for(var i = 0; i < item.senders.data.length; i++ ){
						if(item.senders.data[i].id !== page){
							cus_sender = item.senders.data[i];
						}
					}

					CustomerService.hasCustomer(page, cus_sender.id, function (customer){
						console.log('hasCustomer()');
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
							console.log(conversation_id);
							ConversationService.create('message', {
								"can_reply"			: item.can_reply,
								"link" 				: item.link,
								"unread_count"		: item.unread_count,
								"customer"			: customer.id,
								"user_id"			: customer.id,
								"page_id"			: item.page,
								'conversation_id' 	: conversation_id,
							}, function (error, resp){
								cb(null, resp);
							})
						}else {
							cb(null, conversation);
						}
					})
				}, function (item, cb){
					cb(null);
				}
			], function (){
				next();
			})
			
		}, function (){
			callback();
			console.timeEnd('done');
		})
	},
	/*parseMessageData : function (message){
		var ret = {};

	},*/

}

module.exports =  Message;

