/**
 * PagesController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var async = require('async');
var FB    = require('fb');
module.exports = {
	list: function(rep, res, next) {
		console.log('access_tokent',rep.user);
	}
};

