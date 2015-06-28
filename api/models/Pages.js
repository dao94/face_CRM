/**
* Pages.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	page_id : {type: 'string', required: true},
  	name : {type:'string',required:true},
  	likes : {type:'int',required:true},
  	user_id : {type:"string",required:true},
  	unread_message_count : {type:"int",required:true},
  	unread_notif_count:{type:'int',required:true},
  	unseen_message_count:{type:'int',required:true},
  	access_token:{type:'string',required:true},
  	picture:{},
  	username: {type:"string",required:true},
  	perms: {type:"string"},
  	about:{type:'string'},
  	emails:{},
  	phone:{},
  }
};

