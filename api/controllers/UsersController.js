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
		async.waterfall([
			function (callback){ // check user exist
				UserService.checkProfileId(body.id, function (err, doc){
					callback(null,  doc);
				})
			}, function (user, callback){
				if(!user){ // Create new user if not exist
					UserService.createUser(body, function (err, resp){
						callback(null, true,  resp);
					})
				}else {
					Users.findOne({profile_id: body.id} , function (err, resp){
						callback(null, false, resp);
					});
					
				}
			}, function (is_new, user, callback){ 
				console.log(is_new);
				
				// Send request to graph api to get facebook token if exist user 
				// Generate server token to client 

			}
		])
		
		
	}
};

