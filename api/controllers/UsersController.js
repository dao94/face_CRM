/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var async = require('async');
var FB = require('fb');

module.exports = {
	index: function (req, res, next){
		console.log('token fb', req.user);
		return res.json({
			'res': 'Hello world'
		})
	},
	checkinFB: function (req, res, next){
		var body = req.body;
		async.waterfall([

			function (callback){ // Kiểm tra user đã tồn tại chưa
				UserService.checkProfileId(body.id, function (err, doc){
					callback(null, doc);
				})
			}, function (user, callback){
					if(!user){ // Tạo tài khoản mới 

						UserService.createUser(body, function (err, resp){
							callback(null, true,  resp);
						})
					}else { // cập nhật app access token

						Users.findOne({profile_id: body.id} , function (err, resp){
							var updateData = {};

							updateData.accessToken = body.accessToken;
							updateData.expiresIn   = body.expiresIn;

							Users.update({id: resp.id} , updateData, function (err, resp){
								callback(null, false, resp);
							});
							
						});
					}
			}, function (is_new, user, callback){  // Tạo token
				var uInfo        = {};
				var user         = user[0];
				uInfo.id         = user.id;
				uInfo.email      = user.email;
				uInfo.first_name = user.first_name;
				uInfo.last_name  = user.last_name;
				uInfo.fullname   = user.fullname;
				uInfo.isNew      = is_new;
				uInfo.createdAt  = user.createdAt;
				uInfo.token      = UserService.generationToken(
					{id: user.id, email: user.email, accessToken: user.accessToken, expiresIn: user.expiresIn, profile_id: user.profile_id}
				);
				callback(null, uInfo,user.accessToken);
			}
		], function (error, resp, accessToken){
			var user_id  = resp.id;
			function page (callback) { // create page
				if(user_id) {
					PageService.checkPageId(user_id,function (err,content) {
						if(!content) {
							FB.setAccessToken(accessToken);
							var field = 'likes,name,unread_message_count,unread_notif_count,unseen_message_count,access_token,perms,picture,username';
							FB.api('/me/accounts',{fields: field}, function (content) {
								content.data.user_id = user_id;
								callback(null,content.data);
								PageService.createPage(content, function (err,rep) {
									console.log(err);
								});
							});
						} else {
							callback(null,content);
						}
					});
				}
			}
			page(function (err, info) {
				var ret = {
					'error' 	: true,
					'message' 	: 'Lỗi kết nối máy chủ, vui lòng thử lại sau',
					'data' 		: ''
				}
				if(err){
					return res.json(ret);
				}
				ret.error 	 = false;
				ret.data  	 = resp;
				ret.pageinfo = info;
				ret.message  = "Thành công";
				return res.json(ret);
			});
			
		})
		
		
	},
	test:function(req,res,next) {
		console.log('Access token fb', req.user);
		res.json({
			'Status':"Sucesss"
		}); 
	},
};

