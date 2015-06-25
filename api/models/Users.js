/**
* Users.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	profile_id : {type: 'string', required: true},
  	first_name : {type: 'string', required: true},
  	last_name : {type: 'string', required: true},
    fullname : {type: 'string', required: true},
  	email : {type: 'email', required: true},
    accessToken : {type: 'email', required: true},
    expiresIn : {type: 'email', required: true},
  	pages: [
  		{model: 'pages'}
  	],
  	defaultPage: {model: 'pages'}
  }
};

