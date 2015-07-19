"use strict";

var service = {};

/*
* @params type: {string} Loại conversation là comment hay messages
* @params data: {object} 
* @params callback: {function} 
*/
service.create = function (type, data, callback){
	var data = {
		"type"				: type,
		"can_reply"			: data.can_reply,
		"link" 				: data.link,
		"unread_count"		: data.unread_count,
		"customer"			: data.customer,
		"user_id"			: data.user_id,
		"page_id"			: data.page_id,
		'conversation_id' 	: data.conversation_id,
		'last_message'		: data.last_message
	};
	Conversations.create(data, function (err, resp){
		callback(err || false, resp);
	})

}
service.hasConversation = function (conversation_id, callback){
	Conversations.findOne({conversation_id: conversation_id}, function (error, conversation){
		if(error){
			callback(false);
			return;
		}
		callback(conversation || null);
		
	});
}

service.getListConversation =  function (page, type,  callback){
	
	Conversations.find({page_id: page.page_id, type: type})
	.populate("customer")
	.exec(
		function (error, conversation){
			callback(error, conversation);
		}
	)
}

service.createCustomer = function (data, callback){
	var dataCreate = {
		'profile_id': data.profile_id,
		'fullname'	: data.fullname
	};

	Customers.create(dataCreate, function (err, resp){
		callback(err || false, resp);	
	})
}


module.exports = service;