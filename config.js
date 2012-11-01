/**
 * User: willerce
 * Date: 7/24/12
 * Time: 9:13 PM
 */

var mongoskin = require('mongoskin');

exports.config = {
  name:'未志',
  version:'0.1',
  postNum: process.env.POST_NUM || '5',
  session_secret: process.env.SESSION_SECRET || 'a743894a0e',
  cookie_secret: process.env.COOKIE_SECRET ||'a743894a0e',
  auth_cookie_name: process.env.AUTH_COOKIE_NAME || 'nd_secret',
  port : process.env.PORT || 3000,
  theme : process.env.THEME || 'one',

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

//mongodb set
exports.db = mongoskin.db(process.env.MONGOLAB_URI || "mongodb://localhost/noderce");