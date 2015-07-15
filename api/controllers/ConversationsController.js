/**
 * CustomersController
 *
 * @description :: Server-side logic for managing customers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	show: function (req, res, next){
		var user 		 = req.user,
			pageUserName = req.body.username;
		MessageService.getPageByUsername(pageUserName, user.id,  function (error, resp){
			if(!error){
				ConversationService.getConversation(resp, function (err, data){
					res.json(data);
				});
			}else {
				return res.json({error: true, message :"Lỗi, trang không tồn tại"});
			}
		})

		
	}	
};

