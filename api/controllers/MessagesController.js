/**
 * MessagesController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	getMessage : function (req, res, next){
		var user 		 = req.user,
			pageUserName = req.body.username;

		MessageService.getPageByUsername(pageUserName, user.id,  function (error, resp){
			
			if(!error || resp){
				MessageService.getMessage(resp, function (data){
					res.json(data);
				});
			}else {
				return res.json({error: true, message :"Lỗi, trang không tồn tại"});
			}
		})


	}
};
