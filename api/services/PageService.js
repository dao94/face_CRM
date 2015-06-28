var bcrypt 	= require('bcrypt'),
	jwt 	= require('jsonwebtoken');
module.exports = {

	checkPageId : function (userId, callback){
		Pages.findOne({user_id: userId}, function (err, doc){
			callback((err) ? true: false, doc);
		});
	},
	/*Create page*/ 
	createPage: function (content, callback){
		var page    = {};
		var dataVal = content.data;
		for(property in dataVal) {
			var item                  = dataVal[property];
			page.page_id              = item.id;
			page.name                 = item.name;
			page.likes                = item.likes;
			page.user_id              = dataVal.user_id;
			page.unread_message_count = item.unread_message_count;
			page.unread_notif_count   = item.unread_notif_count;
			page.unseen_message_count = item.unseen_message_count;
			page.access_token         = item.access_token;
			page.picture              = (item.picture)? item.picture.data.url : '';
			page.username             = item.username;
			page.perms                = item.perms;
			Pages.create(page, function (err, doc){
				callback((err) ? true: false, doc);
			});
		}
		
	}
};

