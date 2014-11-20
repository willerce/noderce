var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 定义Comment实体对象模型
var commentSchema = new Schema({
	post_id:{type:Schema.Types.ObjectId,ref:'post'},
	post_slug:String,
	author:String,
	email:String,
	url:{type:String, default:''},
	content:String,
	created:{type:Date, default:Date.now},
	avatar:String
});

mongoose.model('comment', commentSchema);
module.exports.Schema = function(modelName){
	return {
		model:mongoose.model(modelName)
	};
}