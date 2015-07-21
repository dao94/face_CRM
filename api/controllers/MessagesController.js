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

		if(!pageUserName){
			return res.json({error: true, message :"Dữ liệu gửi lên không đúng, vui lòng thử lại !"});
		}

		MessageService.getPageByUsername(pageUserName, user.id,  function (error, resp){
			if(!error && resp){

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
			conversation_id  = req.query.conversation,
			paging  		 = req.query.paging || 1,
			item_page        = req.query.item_page || 20;

		if(!conversation_id){
			return res.json({error: true, message :"Dữ liệu gửi lên không đúng, vui lòng thử lại !"});
		}

		MessageService.getMessage(conversation_id, {limit: item_page, page: paging},  function (err, message){
			return res.json({error: false, message: 'Thành công', data: message || []});
		})
	},
	postMessage: function (req, res, next){
		var user 		 	 = req.user,
			conversation_id  = req.body.conversation,
			pageId  		 = req.body.page,
			message   		 = req.body.message;

		if(!conversation_id || !pageId || !message){
			return res.json({error: true, message :"Dữ liệu gửi lên không đúng, vui lòng thử lại !"});
		}

		MessageService.getPageByUsername(pageId, user.id,  function (error, resp){
			if(!error && resp){
				
				MessageService.postMessage(resp.access_token, 't_mid.1437034086728:a87e5a9d2e2234ea66', message, function (data){
					res.json(data);
				});
			}else {
				return res.json({error: true, message :"Lỗi, trang không tồn tại"});
			}
		})

	}

};
