/**
 * CommentsController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var async = require('async');
module.exports = {

	getComment : function (req, res, next){
		var user 		 = req.user;
	    async.waterfall([
	    	function (callback) {
	    		CommentService.getPageByStatus(user.id,function (err,page) {
					callback(err,page);
				});
	    	},//end callback
	    	function (page,callback) {
	    		if(page) {
					CommentService.getPost(page,function (content){
						CommentService.CreateConversation(content,user.id,page,function (err,resp) {
							console.log(err);
						});
					});
				}
				CommentService.ShowPostBypage(user.id, page, function (err,data) {
					callback(err, data);
				});
	    	},
	    	function(data,callback) {
	    		var push_content = [];
	    		async.eachSeries (data ,function (item, callback_next) {
	    			CommentService.showMessage(item.id,function (err,content) {
	    				push_content.push(content);
	    				callback_next();
	    			});

	    		},function(err) {
    				callback(err,push_content);
	    		});
	    	}],
	    	function(err,data) {
				return res.json({
					'error' 		: err || false,
					'error_message' : 'success',
					'data'			: data
				});
	    	});

	}
};

