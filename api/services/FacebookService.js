"use strict";

var fb      = require('fb');
var request = require('request');
var async   = require('async');
var _       = require('underscore');

var FacebookService = {
	
	postMessage: function (pageToken, conversation, message, callback){
		fb.setAccessToken(pageToken);
		fb.api('/' + conversation.conversation_id + '/messages', 'post', {message: message}, function (resp) {
			callback(resp);
		});
	},
	getOneMessage: function (pageToken, messageId, callback){
		fb.setAccessToken(pageToken);
		fb.api('/'+ messageId, 'get', function (resp) {
			callback(resp);
		});
	},
	getFBMessageOfConversation: function (pageToken, conversation, callback){
		fb.setAccessToken(pageToken);
		fb.api('/v2.4/' + conversation + '/messages?fields=message,subject,from,to,id,created_time,attachments,shares,tags', 'GET', {limit: 100},  function (resp) {
			if(resp){
				callback(resp['data'] && resp['data'].length > 0 ? null : true, resp);
			}else {
				callback(true);
			}
		});
	},
	//begin-comment
	getPost : function(page, callback){
		fb.setAccessToken(page.access_token);
		fb.api('/' + page.page_id + '/posts' ,{limit: 100}, function (resp) {
			callback(resp);
		});
	},

	getCommentReply : function(page,comment_id, callback){
		fb.setAccessToken(page.access_token);
		fb.api('/' + comment_id + '/comments' ,{limit: 300}, function (resp) {
			callback(resp);
		});
	},

	pushRepliesComent : function (pageToken, message_id, message, callback) {
		fb.setAccessToken(pageToken);
		fb.api('/'+ message_id +'/comments', 'post', {message: message}, function (resp) {
			callback(resp);
		});
	},
	likeComment : function (pageToken, comment_id , callback) {
		fb.setAccessToken(pageToken);
		fb.api('/' + comment_id + '/likes','post',function(res) {
			callback(res);
		});
	},
	delComment : function (pageToken, comment_id , callback) {
		fb.setAccessToken(pageToken);
		fb.api('/' + comment_id,'post',{method:'delete'},function(res) {
			callback(res);
		});	
	},
	unlikeComment : function (pageToken, comment_id , callback) {
		fb.setAccessToken(pageToken);
		fb.api('/' + comment_id + '/likes','post',{method:'delete'},function(res) {
			callback(res);
		});	
	}
	//end-comment
	

}

module.exports =  FacebookService;

