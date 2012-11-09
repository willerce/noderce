/**
 * User: willerce
 * Date: 7/24/12
 * Time: 9:13 PM
 */

var mongoskin = require('mongoskin');

exports.config = {

  //site settings
  name:'未志',
  version:'0.0.3',
  postNum: process.env.POST_NUM || '5',//每页显示文章个数
  session_secret: process.env.SESSION_SECRET || 'a743894a0e',//session加密串
  cookie_secret: process.env.COOKIE_SECRET ||'a743894a0e',//session加密串
  auth_cookie_name: process.env.AUTH_COOKIE_NAME || 'nd_secret',//cookie 名字
  port : process.env.PORT || 3000,//端口号
  theme : process.env.THEME || 'one',//主题名称
  akismet_key : process.env.AKISMET_KEY || '', //akismet api key，不开启请设置为空

  // Feed Setting
  rss:{
    max_rss_items:"5",
    title:"未志",
    description:"willerce，写给未来的自己。",
    link: process.env.RSS_LINK || "http://willerce.com",
    language:"zh-cn",
    managingEditor:"willerce@gmail.com (willerce)",
    webMaster:"willerce@gmail.com (willerce)",
    generator:"noderce",
    author:{
      name:"willerce",
      uri:"http://willerce.com"
    }
  }
};

//mongodb settings
exports.db = mongoskin.db(process.env.MONGOLAB_URI || "mongodb://localhost/noderce");//数据库连接串