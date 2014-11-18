var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 定义Page实体对象模型
var pageSchema = new Schema({
	title:String,
	slug:String,
	content:String,
	content_html:String,
	created:{type:Date, default:Date.now},
});

mongoose.model('page', pageSchema);
module.exports.Schema = function(modelName){
	return {
		model:mongoose.model(modelName)
	};
}