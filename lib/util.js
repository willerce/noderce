var crypto = require('crypto');
var log4js = require('log4js');
var morgan = require('morgan');
var fs = require('fs');

/**
 * Created with IntelliJ IDEA.
 * User: willerce
 * Date: 8/4/12
 * Time: 3:48 PM
 * To change this template use File | Settings | File Templates.
 */

/**
 * for tdate
 * @param date date type
 * @param friendly is Friendly data format
 * @return {String} date to string
 */
exports.format_date = function(date, friendly) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  if (friendly) {
    var now = new Date();
    var mseconds = -(date.getTime() - now.getTime());
    var time_std = [ 1000, 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000 ];
    if (mseconds < time_std[3]) {
      if (mseconds > 0 && mseconds < time_std[1]) {
        return Math.floor(mseconds / time_std[0]).toString() + ' 秒前';
      }
      if (mseconds > time_std[1] && mseconds < time_std[2]) {
        return Math.floor(mseconds / time_std[1]).toString() + ' 分钟前';
      }
      if (mseconds > time_std[2]) {
        return Math.floor(mseconds / time_std[2]).toString() + ' 小时前';
      }
    }
  }

  hour = ((hour < 10) ? '0' : '') + hour;
  minute = ((minute < 10) ? '0' : '') + minute;
  second = ((second < 10) ? '0' : '') + second;

  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
};

/**
 * md5 hash
 *
 * @param str
 * @returns md5 str
 */
exports.md5 = function md5(str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
};


/**
 * 加密函数
 * @param str 源串
 * @param secret  因子
 * @returns str
 */
exports.encrypt = function encrypt(str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
};

/**
 * 解密
 * @param str
 * @param secret
 * @returns str
 */
exports.decrypt = function decrypt(str, secret) {
  var decipher = crypto.createDecipher('aes192', secret);
  var dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};


/**
 * log4js调试
 */

/**
 * 新建日志目录
 */
try {
  require('fs').mkdirSync(__dirname+'/../logs');
} catch (e) {
  if (e.code != 'EEXIST') {
    console.error("不能创建log目录，错误: ", e);
    process.exit(1);
  }
}

// 定义三种logLevelFilter日志类型
var logConfig = {
  appenders: [
    {type: 'console'},
    {
        type: 'logLevelFilter',
        level: 'ERROR',
        category: 'error',
        appender: 
        {
            type: 'file',
            filename: __dirname + '/../logs/error.log'
        }
    },
    {
        type: 'logLevelFilter',
        level: 'INFO',
        category: 'info',
        appender: 
        {
            type: 'file',
            filename: __dirname + '/../logs/info.log'
        }
    },
    {
        type: 'logLevelFilter',
        level: 'DEBUG',
        category: 'debug',
        appender: 
        {
            type: 'file',
            filename: __dirname + '/../logs/debug.log'
        }
    }
  ]
};

log4js.configure(logConfig);
/**
 * info等级的调试函数，调试信息输出到console同时保存到相应文件中
 * @returns 返回log4js对象
 */
exports.infologger = log4js.getLogger('info');
/**
 * error等级的调试函数，调试信息输出到console同时保存到相应文件中
 * @returns 返回log4js对象
 */
exports.errorlogger = log4js.getLogger('error');
/**
 * debug等级的调试函数，调试信息输出到console同时保存到相应文件中
 * @returns 返回log4js对象
 */
exports.debuglogger = log4js.getLogger('debug');


// 创建一个附加模式的写入流
var accessLogStream = fs.createWriteStream(__dirname + '/../logs/access.log', {flags: 'a'});
/**
 * http请求记录器，写入到access.log文件中，只记录错误和跳转响应
 */
exports.httplogger = morgan('short', {
  stream: accessLogStream,
  skip: function(req, res){ // 只记录错误和跳转响应
    return res.statusCode < 300 || res.statusCode == 304;
  }
});