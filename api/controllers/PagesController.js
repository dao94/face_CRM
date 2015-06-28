/**
 * PagesController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var async = require('async');
var FB    = require('fb');
module.exports = {
	list: function(rep, res, next) {
		var accessToken = rep.user.accessToken;
		var _Object = {
			'status' : 'success',
			'data ' : "" ,
		};
		var user_id = rep.user.id;
		if(!user_id) {
			_Object['status'] = 'error';
		} else {
			PageService.checkPageId(user_id,function (err,content) {
				if(!content) {
					FB.setAccessToken(accessToken);
					FB.api('/me/accounts',{fields: 'name,likes'}, function (content) {
						content.data.user_id = user_id;
						PageService.createPage(content, function (err,rep) {
							console.log(err);
						});
					});
				}
			});
		}
		res.json(_Object);
	}
};

