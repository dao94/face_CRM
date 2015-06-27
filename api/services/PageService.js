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
		var page     = {};
		var data = content.data;
		for(property in data) {
			var item     = data[property];
			page.page_id = item.id;
			page.name    = item.name;
			page.user_id = data.user_id;
			Pages.create(page, function (err, doc){
				callback((err) ? true: false, doc);
			});
		}
		
	}
};

