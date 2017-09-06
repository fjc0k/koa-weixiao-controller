const getRawBody = require('raw-body');
const xml2js = require('xml2js').parseString;
const qs = require('qs');
const _ = require('lodash');

const $xml2js = async text => {
  return new Promise((resolve, reject) => {
    xml2js(text, { trim: true }, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

module.exports = class Body {
  constructor(ctx) {
    this.ctx = ctx;
    this.rawBody = null;
  }
  async getRawBody() {
    if (this.rawBody === null) {
      this.rawBody = String(await getRawBody(this.ctx.req || this.ctx));
    }
    return this.rawBody;
  }
  async parseJSON() {
    const rawBody = await this.getRawBody();
    return rawBody ? JSON.parse(rawBody) : {};
  }
  async parseXML() {
    const rawBody = await this.getRawBody();
    return rawBody ? await $xml2js(rawBody) : {};
  }
  async parseWechatXML() {
    const obj = (await this.parseXML()).xml;
    const message = _.mapValues(obj, val => {
      return Array.isArray(val) ? (val[0] || '') : val;
    });
    return message;
  }
  async parseForm() {
    const rawBody = await this.getRawBody();
    return qs.parse(rawBody);
  }
};
