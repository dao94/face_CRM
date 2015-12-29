/**
* Comments.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
	comment_id      : {type: 'string', required: true},
	conversation_id : {},
  	from 		    : {},
  	message  	    : {type: 'string', required: true},
    created_time    : {},
  	like_count      : {},
  	user_likes      : {},
  }
};

