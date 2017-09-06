# koa-weixiao-controller

koa: 腾讯微校第三方应用快速开发路由。

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

app.use(async (ctx, next) => {
  // fuck: 微校提交的请求内容本身和其提供的 content-type 并不一致
  if (ctx.path === '/weixiao') {
    ctx.disableBodyParser = true;
  }
  await next();
});
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
    async open(ctx, { mediaId }) {
      // 在这里执行一些应用开启相关操作
      ctx.body =
    }
  }
});



import './assets/iconfont.js'; // Symbol 代码
import 'vue-iconfont/style/icon.css'; // 样式文件
import vueIconfont from 'vue-iconfont'; // icon 组件

Vue.use(vueIconfont);
// 或
Vue.use(vueIconfont, {
  label: 'icon' // label 默认是 icon
});
// 或
Vue.component('icon', vueIconfont);
```

`App.vue`：

```html
<!-- // 不指定 size，图标大小依父元素而定 -->
<icon name="star"></icon>

<!-- // 指定 size，图标大小自己做主，单位：px -->
<icon name="star" :size="20"></icon>
<!-- // 这等价于 -->
<icon name="star" :width="20" :height="20"></icon>
```
