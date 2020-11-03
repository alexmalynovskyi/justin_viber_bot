import cheerio from 'cheerio';

export class DomParser {
  constructor(htmlBody) {
    this.htmlBody = htmlBody;
    this.dom = cheerio.load(this.htmlBody);
  }

  getAttr(pattern, attrName) {
    return this.dom(pattern).attr(attrName)
  }

  getHTMLBySelector(pattern) {
    const text = this.dom(pattern).text();
    if (text && typeof text === 'string') {
      return text.trim()
    } else {
      return text;
    }
  }

  getClassName(pattern) {
    return this.dom(pattern);
  }
}
