var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 定义Comment实体对象模型
var userSchema = new Schema({
	name:String,
	password:String
});

mongoose.model('user', userSchema);
module.exports.Schema = function(modelName){
	return {
		model:mongoose.model(modelName)
	};
}