var bcrypt 	= require('bcrypt'),
	jwt 	= require('jsonwebtoken');
module.exports = {
	comparePassword: function (password, hash, cb){
		bcrypt.compare(password, hash, function(err, isMatch) {
	        if (err) return cb(err);
	        cb(null, isMatch);
    	});
	},
	generationToken: function (userInfo){
		var secret 		= sails.config.globals.tokenSecret;
		return token 	= jwt.sign(userInfo, secret, { expiresInMinutes: 10080}); 
	},
	decodeToken: function (token, callback){
		var secret 		= sails.config.globals.tokenSecret;
		jwt.verify(token, secret,  function(err, decoded) {
		  callback(err, decoded);
		});
	},
	hasUsername: function (username, callback){
		Users.findOne({username: username}, function (err, doc){
			callback((doc) ? true: false, doc);
		});
	},
	checkProfileId : function (profileId, callback){
		Users.findOne({profile_id: profileId}, function (err, doc){
			callback((err) ? true: false, doc);
		});
	},
	createUser: function (data, callback){
		var user = {}
		user.profile_id  = data.id;
		user.first_name  = data.first_name;
		user.last_name 	 = data.last_name;
		user.email 		 = data.email;
		user.fullname 	 = data.name;
		user.accessToken = data.accessToken;
		user.expiresIn 	 = data.expiresIn;

		Users.create(user, function (err, doc){
			callback((err) ? true: false, doc);
		})
	}
};

