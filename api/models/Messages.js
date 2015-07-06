/**
* Messages.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	conversation_id: {model: 'conversation'},
  	sender: {
  		profile_id	: {},
  		fullname 	: {},
  	},
	own: {type: 'boolean'},
	messsage: {type: 'string'},
	create_at: {type: 'date'},
  }
};
