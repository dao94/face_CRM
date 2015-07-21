/**
* Messages.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	attributes: {
		conversation_id 	: {}, // Id của conversation || id của post page
		type			: {type: 'string', enum: ['comments', 'message']},
		// type			: {type: 'string'},
		can_reply 		: {}, // boolean 
		link 			: {}, // Link đến facebook
		unread_count 	: {}, // Số tin chưa đọc
		customer 		: {model: 'Customers'}, // Thông tin người dùng
		last_message	: {}, // Tin nhắn cuối cùng được tìm thấy 
		user_id 		: {model: 'Users'},
		page_id   		: {model: 'Pages'},
		fb_page_id        : {},
		fb_time_update        : {type: 'date'},
		messages        : {},
	}
};

