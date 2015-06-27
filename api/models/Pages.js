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
  	user_id : {type:"string",required:true}
  }
};

