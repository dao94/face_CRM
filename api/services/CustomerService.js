"use strict";

var fb      = require('fb');
var request = require('request');
var async   = require('async');

var CustomerService = {
	hasCustomer: function(page_id, profile_id, callback){
		Customers.findOne({page : page_id, profile_id: profile_id}, function (error, doc){
			if(error){
				return callback(error);
			}
			return callback(doc ? doc : false);
			
		});
	},
}

CustomerService.createCustomer = function (data, callback){
	var dataCreate = {
		'profile_id': data.profile_id,
		'fullname'	: data.fullname
	};

	Customers.create(dataCreate, function (err, resp){
		callback(err || false, resp);	
	})
}

module.exports =  CustomerService;

