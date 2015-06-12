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
	}
};

