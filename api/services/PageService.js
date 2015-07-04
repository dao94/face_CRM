var bcrypt 	= require('bcrypt'),
	jwt 	= require('jsonwebtoken'),
	FB = require('fb');
module.exports = {

	checkPageId : function (userId, callback){
		Pages.findOne({user_id: userId}, function (err, doc){
			callback((err) ? true: false, doc);
		});
	},
	listPage : function (userId, callback){
		Pages.find({user_id: userId}, function (err, doc){	
			callback((err) ? true: false, doc);
		});
	},
	getListPage : function(token,callback) {
		FB.setAccessToken(token);
		var field = 'likes,name,unread_message_count,unread_notif_count,unseen_message_count,access_token,perms,picture,about,username,emails,phone';
		FB.api('/me/accounts',{fields: field}, function (res) {
			callback(res);
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
			page.picture              = item.picture;
			page.username             = item.username;
			page.perms                = item.perms;
			page.about                = item.about;
			page.phone                = item.phone;
			page.emails               = item.emails;
			page.stt                  = 0;//0 is none active,1 is active
			Pages.create(page, function (err, doc){
				callback((err) ? true: false, doc);
			});
		}
		
	},
	/*Update access_token*/ 
	updatePage: function(content,callback) {
		var page     = {};
		var dataPage = content.data;
		for(property in dataPage) {
			var item = dataPage[property];
			page.access_token = item.access_token;
			Pages.update({page_id:item.id},page,function (err, doc) {
				callback((err) ? true: false,doc);
			});
		}
	}
};

