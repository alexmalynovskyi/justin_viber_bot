'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DomParser = undefined;

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DomParser {
  constructor(htmlBody) {
    this.htmlBody = htmlBody;
    this.dom = _cheerio2.default.load(this.htmlBody);
  }

  getAttr(pattern, attrName) {
    return this.dom(pattern).attr(attrName);
  }

  getHTMLBySelector(pattern) {
    const text = this.dom(pattern).text();
    if (text && typeof text === 'string') {
      return text.trim();
    } else {
      return text;
    }
  }

  getClassName(pattern) {
    return this.dom(pattern);
  }
}
exports.DomParser = DomParser;