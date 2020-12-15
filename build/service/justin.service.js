'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JustinService = undefined;

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _dom = require('../utils/dom.util');

var _api = require('../utils/api.util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class JustinService {
  static async getPackageInfoByTtn(ttn) {
    const data = await (0, _requestPromise2.default)(_api.getOptions);
    const cookieCsrfToken = data.headers['set-cookie'][0].split(' ')[0];
    const sessionCookie = data.headers['set-cookie'][1].split(' ')[0];
    const domParserInstance = new _dom.DomParser(data.body);

    const csrfToken = domParserInstance.getAttr('meta[name=csrf-token]', 'content');
    const deliveryData = await (0, _requestPromise2.default)((0, _api.getPostOptions)(csrfToken, `${cookieCsrfToken} ${sessionCookie.substring(0, sessionCookie.length - 1)}`, ttn));

    return deliveryData;
  }

  static async getPackageInfo(ttn) {
    const data = await JustinService.getPackageInfoByTtn(ttn);
    const domParser = new _dom.DomParser(data.body.html);
    const title = domParser.getHTMLBySelector('.title');
    const date = domParser.getHTMLBySelector('.date');
    const text = domParser.getHTMLBySelector('.text');
    const status = domParser.getHTMLBySelector('.status');

    return {
      title,
      date,
      text,
      status
    };
  }
}
exports.JustinService = JustinService;