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
  	unread_message_count : {},
  	unread_notif_count:{},
  	unseen_message_count:{},
  	access_token:{},
  	picture:{},
  	username: {},
  	perms: {},
  	about:{},
  	emails:{},
  	phone:{},
    stt:{type:"int",required: true}
  }
};

