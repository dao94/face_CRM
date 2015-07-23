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
	

}

module.exports =  FacebookService;

