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
						callback(null,content,page);
					});
				}
	    	},
	    	function (content ,page ,callback) {
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
		var pagename        = req.body.pageId,
		 	user            = req.user,
		    Object_json 	= {
		    					'error' 		:  false,
								'error_message' : 'success',
								'data'			:  '',
								'page'          :  ''
							 };
		messageId = req.body.conversationId;
		async.waterfall([
			function (callback) {
				MessageService.getIdConver(messageId,function(err,item) {
					callback(null,item);
				});
			},
			function (item ,callback) {
				if(item) {
					if(item.conversation_id) {
						CommentService.getPostByComment(item.conversation_id,function (err,content){
							callback(err,content,item);
						}); 
					} else {
						Object_json.error = true;
						Object_json.error_message = 'conversationId has empty !';
						res.json(Object_json);
					}
				} else {
					Object_json.error = true;
					Object_json.error_message = 'conversationId has empty !';
					res.json(Object_json);
				}
			},
			function (content,item,callback) {
				CommentService.getPageByStatus(pagename, user.id,function (err,page) {
					CommentService.getCheckMessageById(item.parent_id,function (err,resp) {
						callback(err,content,item,resp,page);
					});	
				});
			}
		],function (error ,content ,item ,resp,page) {
			if(resp) {
				var respon            = {};
				respon.content        = content;
				respon.message        = item;
				respon.message_parent = resp;
				Object_json.data      = respon;
				Object_json.page      = page;
				res.json(Object_json);
			} else {
				var respon            = {};
				respon.content        = content;
				respon.message_parent = item;
				Object_json.data      = respon;
				Object_json.page      = page;
				res.json(Object_json);
			}
		});
	}//end function
};

