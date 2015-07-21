/**
 * CommentsController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var async = require('async');
module.exports = {

	getComment : function (req, res, next){
		var user 	= req.user;
		pagename 	= req.body.username;
		if(!pagename)
			return res.json({error: true, message :"Co loi xay ra, Vui long thu lai!"});
	    async.waterfall([
	    	function (callback) {
	    		CommentService.getPageByStatus(pagename,user.id,function (err,page) {
					callback(err,page);
				});
	    	},//end callback
	    	function (page,callback) {
	    		if(page) {
					CommentService.getPost(page,function (content){
						CommentService.CreateConversation(content,user.id,page,function (err,resp) {
							CommentService.ShowPostBypage(user.id, page, function (err,data) {
								var push_content = [];
								async.eachSeries (data ,function (item, callback_next) {
									push_content.push(item.id);
									callback_next();
								},function() {
									callback(err,push_content);
								});
								
							});
						});
					});
				}
	    	},
	    	function(data,callback) {
	    		CommentService.showMessage(data,function (err,content) {
    				callback(null,content);
    			});
	    	}],
	    	function(err,data) {
				return res.json({
					'error' 		: err || false,
					'error_message' : 'success',
					'data'			: data,
				});
	    	});

	},
	PostByComment : function(req, res, next) {
		var pagename        = req.body.username,
		 	user            = req.user,
		    Object_json 	= {
		    					'error' 		:  false,
								'error_message' : 'success',
								'data'			:  '',
								'page'          :  ''
							 };
		messageId = req.body.conversationId;
		MessageService.getIdConver(messageId,function(err,item) {
			var conversationId = item.conversation_id;
			if(conversationId) {
				CommentService.getPostByComment(conversationId,function (err,content){
					CommentService.getPageByStatus(pagename, user.id,function (err,page) {
						Object_json.data = content;
						Object_json.page = page;
						res.json(Object_json);	
					});
				}); 
			} else {
				Object_json.error = true;
				Object_json.error_message = 'conversationId has empty !';
				res.json(Object_json);
			}
		});
	}
};

