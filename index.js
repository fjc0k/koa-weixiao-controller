const Weixiao = require('weixiao.js');
const Body = require('./Body');

const controllers = {};

let wx, $hooks;

controllers.entry = async ctx => {
  const { type } = ctx.query;
  const action = controllers[type];
  if (!type || !action) {
    ctx.body = Weixiao.generateResponse({ msg: 'type err' }, 5006);
  } else {
    ctx.request.body = await new Body(ctx)[
      type === 'trigger' ? 'parseWechatXML' : 'parseJSON'
    ]();
    const checks = {
      open: 'body',
      close: 'body',
      trigger: 'query',
      keyword: 'body',
      config: 'query'
    };
    if (checks[type]) {
      const checkContent = ctx.request[checks[type]];
      if (Weixiao.checkInterval(checkContent) && wx.checkSign(checkContent)) {
        await action(ctx, checkContent.media_id);
      } else {
        ctx.body = Weixiao.generateResponse({ msg: 'check failed' }, 5006);
      }
    } else {
      await action(ctx);
    }
  }
};

['open', 'close', 'trigger', 'keyword', 'config', 'monitor'].forEach(type => {
  controllers[type] = async (ctx, mediaId) => {
    switch(type) {
      case 'monitor':
        ctx.body = ctx.query.echostr;
        break;
      case 'close':
      case 'keyword':
        ctx.body = Weixiao.generateResponse({});
        break;
      default:
        break;
    }
    if (typeof $hooks[type] === 'function') {
      await $hooks[type](ctx, {
        body: ctx.request.body,
        mediaId,
        Weixiao,
        weixiao: wx
      });
    }
  };
});

module.exports = ({ api = {}, hooks = {} } = {}) => {
  if (typeof api !== 'object') {
    throw new TypeError('api must be an object');
  }
  if (!api.key || !api.secret) {
    throw new Error('api must have key and secret');
  }
  wx = new Weixiao(api);
  $hooks = hooks;
  return controllers.entry;
};
