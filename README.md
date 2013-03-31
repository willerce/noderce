noderce
=======

Noderce 是一个使用 nodejs 编写的博客程序，使用了 [express](http://expressjs.com/) , [mongoskin](https://github.com/kissjs/node-mongoskin) 等第三方框架、模块。使用 [mongodb](http://www.mongodb.org/) 做存储。

Noderce 的功能很简单。去除了自己用不到的标签、分类、友情链接功能，仅有文章、页面、评论功能。

目前还在完善中，演示地址： [http://willerce.com](http://willerce.com)

Noderce AppFog 部署指南：[http://willerce.com/post/noderce-deploy-to-appfog](http://willerce.com/post/noderce-deploy-to-appfog)

##安装

克隆项目到本地

    git clone git@github.com:willerce/noderce.git

复制一份config.default.js，保存为 config.js，根据注释，修改参数。  

运行 npm install

运行  node app.js

访问  yourname.com 后，会自动跳转到  yourname.com/admin/install

设定一个用户名密码，程序初始化后，即可使用

##主题切换

从 views/one 复制一件出来进行修改。放在 views 中，如： views/two

修改 config.js 中的 theme 的值为你的主题目录名称："two" 即可

##Akismet功能

akismet 可以帮助你拒绝绝大部分的 spam 评论，建议开启。你需要到 http://akismet.com/ 申请一个 api key。然后修改 config.js 中的 akismet_key 变量。如果不想开启此功能，请留空。默认为空


##License

(The MIT License)

Copyright (c) 2012 willerce <willerce@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

