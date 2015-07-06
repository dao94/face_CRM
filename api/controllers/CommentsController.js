/**
 * CommentsController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	getComment : function (req, res, next){
		var user 		 = req.user;
		var ret = {
					'error' 	: true,
					'message' 	: 'Lỗi kết nối máy chủ, vui lòng thử lại sau',
					'data' 		: ''
				  }
		CommentService.getPageByStatus(req.user.id,function (err,page) {
			if(!err && page) {
				CommentService.getPost(page,function (content){
					MessageService.createMessage(content,function (err,resp) {
						console.log(err);
					});
					CommentService.CreateConversation (content,req.user.id,page,function (err,resp) {
						console.log(err);
					});
					ret.error   = false;
					ret.data    = content.data;
					ret.message = "ok";
					res.json(ret);
				});
			} else {
				res.json(ret);
			}
		});
	}
};

