/**
 * MessagesController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	syncMessage : function (req, res, next){
		var user 		 = req.user,
			pageUserName = req.body.username;

		MessageService.getPageByUsername(pageUserName, user.id,  function (error, resp){
			
			if(!error || resp){
				MessageService.getFBMessage(resp, function (data){
					res.json(data);
				});
			}else {
				return res.json({error: true, message :"Lỗi, trang không tồn tại"});
			}
		})
	},
	getMessage: function (req, res, next){
		var user 		 	 = req.user,
			conversation_id  = req.query.conversation;

		MessageService.getMessage(conversation_id, function (err, message){
			return res.json({error: false, message: 'Thành công', data: message || []});
		})
	}
};
