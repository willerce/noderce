var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 定义Post Archive实体对象模型
var postArchiveSchema = new Schema({
	archiveName:String,
	describe:String,
	logoSrc:String
});

// 定义Post Details实体对象模型
var postDetailSchema = new Schema({
	title:String,
	slug:String,
	content:String,
	content_html:String,
	created:{type:Date, default:Date.now},
	tags:String,
	refArchive:{type:Schema.Types.ObjectId, ref:'archiveName'}
});
mongoose.model('postArchive', postDetailSchema);
mongoose.model('post', postDetailSchema);