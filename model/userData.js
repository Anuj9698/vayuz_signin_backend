var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	_id:mongoose.Schema.Types.ObjectId,
	name: String,
	password: String,
	email: String,
	location: String,
	otp: String,
	token:String,
	interest:Array
});

module.exports=mongoose.model('UserData', userSchema);