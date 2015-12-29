/**
* Info.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	attributes: {
		info_id    : {type: 'string', required: true},
	  	first_name : {type: 'string', required: true},
	  	last_name  : {type: 'string', required: true},
	    fullname   : {type: 'string', required: true},
	  	picture    : {},
	}
};

