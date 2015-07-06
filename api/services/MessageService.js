"use strict";

var fb      = require('fb');
var request = require('request');
var async   = require('async');

var Message = {
	getPageByUsername: function(pageName, user_id, callback){
		Pages.findOne({username : pageName, user_id: user_id}, function (error, page){
			callback(error, page);
		});
	},

	getMessage : function(page, callback){
		if(!page){
			return false;
		}
		fb.api('/' + page.page_id + '/conversations' ,{limit: 10}, function (resp) {
			Message.parseMessageData(resp, function (){

			});
			callback(resp);
		});
	},
	parseMessageData : function (messages, callback){
		if(!messages.data){
			// Không có message
		}
		async.eachSeries(message.data, function loop(item, callback){
			console.log(item)
		})
	}
}

module.exports =  Message;

