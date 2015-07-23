/**
 * MessagesController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var fb      = require('fb');

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
	ReadRealtime : function (req, res, next){
		console.log('realtimeCallback');
		console.log(req.query);
		console.log('---------------------');
		console.log(req.body);
		return res.json({
			error: true
		})

	},
	InsertRealtimeCallback: function (){
		fb.setAccessToken("1578258869101648|338975d40d85862c3be231eb4b3110ac");
		//?object=page&callback_url=http://face.local.com:1337/api/v1/messages/ReadRealtime&fields=conversations&active=true
		fb.api('/1578258869101648/subscriptions', 'POST', {
			object: 'page', 
			callback_url: 'http://facecrm.vn:1337/api/v1/messages/ReadRealtime',
			fields: 'conversations',
			active: true,
			verify_token: "thinhvn"
		}, function (resp) {
			console.log('resp', resp);
		});

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
			return res.json({error: true, message : "Dữ liệu gửi lên không đúng, vui lòng thử lại !"});
		}

		MessageService.getPageByUsername(pageId, user.id,  function (error, page){
			if(!error && page){
				Conversations.findOne({id: conversation_id}, function (err, conversation){
					if(!error && conversation){
						MessageService.postMessage(page.access_token, conversation.conversation_id, message, function (data){
							res.json(data);
						});
					}else {
						return res.json({error: true, message :"Lỗi, không tìm thấy cuộc hội thoại !"});
					}
				})
				
			}else {
				return res.json({error: true, message :"Lỗi, trang không tồn tại"});
			}
		})

	}

};
