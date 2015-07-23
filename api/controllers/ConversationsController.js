/**
 * CustomersController
 *
 * @description :: Server-side logic for managing customers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	show: function (req, res, next){
		var user 		 = req.user,
			pageUserName = req.query.username;
		MessageService.getPageByUsername(pageUserName, user.id,  function (error, resp){
			
			if(!error){
				ConversationService.getListConversation(resp, 'message' , function (err, data){
					res.json({
						'error': error || false,
						'error_message': '',
						'data': data
					});
				});
			}else {
				return res.json({error: true, message :"Lỗi, trang không tồn tại"});
			}
		})
	},
	
	
};

