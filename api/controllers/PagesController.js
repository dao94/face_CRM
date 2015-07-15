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
		var user = rep.user;
		var body = rep.body;
		var accessToken = rep.user.accessToken;
		var _Object = {
			'status' : 'success',
			'data ' : "" ,
		};
		var user_id   = rep.user.id;
		function getlist(callback) {
			PageService.listPage(user_id,function (error, content) {
				callback(null,content);
			});
		}
		getlist(function (error,cont) {
			_Object.data = cont;
			res.json(_Object);
		})
	},
	update: function(rep,res,next) {
		var body = rep.body;
		PageService.updatePageStatus(body,function (err,resp) {
			return res.json({
				'error' 		: error || false,
				'error_message' : 'Thành công',
				'data'			: resp
			});
		});
	},
	updatePage: function(rep,res,next) {
		var body = rep.body;
		PageService.update(body,function (err,resp) {
			return res.json({
				'error' 		: error || false,
				'error_message' : 'Thành công',
				'data'			: resp
			});
		});
	}
};

