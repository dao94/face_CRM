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
		return res.json({
			'res': 'Hello world'
		})
	},
	checkinFB: function (req, res, next){
		var body = req.body;
		console.log('checkUser', req.body);
		async.waterfall([

			function (callback){ // check user exist
				UserService.checkProfileId(body.id, function (err, doc){
					callback(null, doc);
				})
			}, function (user, callback){
				if(!user){ // Create new user if not exist
					
					UserService.createUser(body, function (err, resp){
						callback(null, true,  resp);
					})
				}else { // update app access_token;
					Users.findOne({profile_id: body.id} , function (err, resp){
						
						var updateData = {};

						updateData.accessToken = body.accessToken;
						updateData.expiresIn   = body.expiresIn;

						Users.update({id: resp.id} , updateData, function (err, resp){
							callback(null, false, resp);
						});
						
					});
				}
			}, function (is_new, user, callback){  // Genneration token
				callback(null, user);
			}
		], function (error, resp){
			var ret = {
				'error' 	: true,
				'message' 	: 'Lỗi kết nối máy chủ, vui lòng thử lại sau',
				'data' 		: ''
			}
			if(error){
				return res.json(ret);
			}
			ret.error = false;
			ret.data  = resp;
			return res.json(ret);
		})
		
		
	},
	test:function(resp,res,next) {
		res.json({
			'Status':"Sucesss"
		}); 
	},
};

