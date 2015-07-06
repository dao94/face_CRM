"use strict";

var fb      = require('fb');
var request = require('request');
var async   = require('async');

var Message = {
	hasCustomer: function(page_id, profile_id, callback){
		Customer.findOne({page : page_id, profile_id: profile_id}, function (error, doc){
			if(error){
				return callback(error);
			}
			return callback(doc ? true : false);
			
		});
	},
}

module.exports =  Message;

