/**
* Messages.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	conversation_id: {model: 'conversations'},
    message_id : {},
  	sender: {
  	},
  	parent_id : {},
	own: {type: 'boolean'},
	messsage: {type: 'string'},
	create_at: {type: 'date'},
  }
};
