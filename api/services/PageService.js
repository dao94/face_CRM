var bcrypt 	= require('bcrypt'),
	jwt 	= require('jsonwebtoken'),
	FB = require('fb'),
	async   = require('async');
module.exports = {

	checkPageId : function (userId, callback){
		Pages.findOne({user_id: userId}, function (err, doc){
			callback((err) ? true: false, doc);
		});
	},
	listPage : function (userId, callback){
		Pages.find({user_id: userId},{access_token:false}, function (err, doc){	
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
	createPage : function (content, user_id, callback) {
		async.eachSeries(content.data,function (item ,callback_next) {
			var page                  = {};
			page.page_id              = item.id;
			page.name                 = item.name;
			page.likes                = item.likes;
			page.user_id              = user_id;
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
				if(!err)
					callback_next();
				callback((err) ? true: false, doc);
			});	
		})
	},
	/*Update access_token*/ 
	updatePage: function(content,userId,callback) {
		var page     = {};
		var dataPage = content.data;
		for(property in dataPage) {
			var item          = dataPage[property];
			page.access_token = item.access_token;
			page.stt          = '0';
			Pages.update({page_id:item.id,user_id:userId},page,function (err, doc) {
				callback((err) ? true: false,doc);
			});
		}
	},
	// update status page_id
	updatePageStatus: function(content,callback) {
		var page = {};
		
		page.stt = content.stt;
		Pages.update({'page_id' : content.page.page_id, 'user_id': content.page.user_id},page,function (err ,doc) {
			callback((err) ? true: false, doc);
		});	
	}
};

