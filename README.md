# koa-weixiao-controller

koa: 腾讯微校第三方应用快速开发路由。

本路由将请求签名验证、时间戳验证、微校json数据解析、微信xml数据解析等操作进行了封装。

## 如何使用

### 安装

```shell
yarn add koa-weixiao-controller
```
或
```shell
npm install koa-weixiao-controller -S
```

### 注意事项
1. 你**必须**使用了 `koa-json` 插件。
2. 如果你同时使用了 `koa-bodyparser` 插件，请参照以下修改你的代码：
```javascript
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const weixiaoController = require('koa-weixiao-controller');

app.use(weixiaoController.compatibleWithBodyParser('/weixiao'/* 应用路径 */));
app.use(bodyParser());

// ........
```


### 使用

`weixiao.controller.js`：

```javascript
const weixiaoController = require('koa-weixiao-controller');
module.exports = weixiaoController({
  api: {
    key: 'your key',
    secret: 'your secret',
    token: 'your token' // 仅 `消息回复类` 应用需要
  },
  hooks: {
    async open(ctx, { mediaId, Weixiao }) {
      // 应用开启

      // 在这里执行一些应用开启相关操作

      ctx.body = Weixiao.generateResponse({
        token: 'hello',
        is_config: 1
      });
    },
    async trigger(ctx, { body, mediaId }) {
      // 应用触发

      // 如果是消息回复类应用
      ctx.body = `<xml><ToUserName><![CDATA[${body.FromUserName}]]></ToUserName>.............</xml>`;

      // 如果是网页应用
      ctx.redirect('http://baidu.com'/* 应用的网页地址 */);
    },
    async keyword(ctx, { body, mediaId }) {
      // 关键词更新

      // 一些操作, 如: db.table('apps').where({ mediaId }).update({ keywords: body.keyword });
    },
    async config(ctx, { mediaId }) {
      // 打开配置页面

      // 一些操作, 如: ctx.render('config', { mediaId });
    },
    async monitor(ctx, { mediaId }) {
      // 应用监控

      // 执行一些操作, 默认会执行操作: ctx.body = ctx.query.echostr;
    }
  }
});
```

`index.js`：

```javascript
// .....

const router = require('koa-router')();
const weixiaoController = require('./controllers/weixiao.controller.js');

router.all('/weixiao', weixiaoController);

// .....
```
