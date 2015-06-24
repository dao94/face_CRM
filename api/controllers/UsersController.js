/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function (req, res, next){
		return res.json({
			'res': 123
		})
	},
	checkinFB: function (req, res, next){
		var body = req.body;
		UserService.checkProfileId(body.id, function (err, doc){
			if(!doc){
				return res.json({'data'})
			}
		})
		return res.json(req.body);
	}
};

