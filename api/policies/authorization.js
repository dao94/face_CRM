/**
 * User authorization policy
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 *
 */
module.exports = function(req, res, next) {
  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  var token = req.headers.authorization;
  if(token){
	UserService.decodeToken(token, function (err, user){
		if(err){
			return res.status(403).json({
				error 		: true,
				message 	: "You are not permitted to perform this action."
			});
		}else {
			req.user = user;
			next();
		}
	})
  }else {
  	return res.status(403).json({
		error 		: true,
		message 	: "You are not permitted to perform this action."
	});
  }

  if (req.session.authenticated) {
    return next();
  }

};
