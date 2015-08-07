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
					FacebookService.getPost(page,function (content){
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
							callback(err,push_content,page);
						});
						
					});
				});
	    	},	
	    	function (data, page, callback) {
	    		CommentService.showMessage(data, page.page_id, function (err,content) {
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
					if(!item.parent_id) {
						CommentService.getMessageByParentId(item.id,function (error,content) {
							callback(err, item, content, page,content);
						});
					} else {
						CommentService.getMessageByid(item.parent_id,function (err,data) {
							CommentService.getMessageByParentId(item.parent_id,function (error,item) {
								callback(err, data, content, page,item);
							});
						});
					}
				});
			}
		],function (error , item, content, page,message_child) {
			var respon            = {};
			respon.content        = content;
			respon.message        = message_child;
			respon.message_parent = item;
			Object_json.data      = respon;
			Object_json.page      = page;
			res.json(Object_json);
		});
	},//end function

	pushComment : function (req, res, next) {
		var access_token = req.user.accessToken,
			comment    	 = req.body.comment,
			message_id   = req.body.comment_id,
			pagename     = req.body.pagename;
		async.waterfall([
			function (callback) {
				CommentService.getPageByStatus(pagename,req.user.id,function (err,page) {
					callback(err,page);
				});	
			},
			function (data,callback) {
				FacebookService.pushRepliesComent(data.access_token,message_id,comment,function (res) {
					callback(res,data);
				});
			}
		],function (item,page,callback) {
			var data = {
				message: comment,
				message_id: item.id,
				name: page.name,
				profile_id:page.page_id
			}
			return res.json({
				'error' 		: false,
				'error_message' : 'Thành công',
				'data'			: data
			});
		});	
	},
	likecomment : function (req, res, next) {
		var comment_id   = req.body.comment_id,
			access_token = req.user.accessToken;
		FacebookService.likeComment(access_token, comment_id, function(respon) {
			if(respon.success == true) {
				return res.json({
					'error' 		: false,
					'error_message' : 'Thành công',
				});
			}
		})
	},
	delComment : function (req, res, next) {
		var comment_id   = req.body.comment_id,
			user 		 = req.user,
			page 		 = req.body.pagename;
		if(page) {
			async.waterfall([
				function (callback) {
					CommentService.getPageByStatus(page,user.id,function (err,page) {
						callback(err,page);
					});
				},
				function (page,callback) {
					FacebookService.delComment(page.access_token, comment_id, function(respon) {
						callback(respon);
					});
					CommentService.removeComment(comment_id,function(err,res) {
						console.log(err);
					})
				}
			],function(respon) {
				if(respon.success == true) {
					return res.json({
						'error' 		: false,
						'error_message' : 'Thành công',
					});
				}
			});	
		} else {
			return res.json({
				'error' 		: true,
				'error_message' : 'error,page not exits',
			});
		}
	}


};

