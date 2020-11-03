import request from 'request-promise';
import { DomParser } from '../utils/dom.util';
import { getOptions, getPostOptions } from '../utils/api.util'

export class JustinService {
  static async getPackageInfoByTtn(ttn) {
    const data = await request(getOptions);
    const cookieCsrfToken = data.headers['set-cookie'][0].split(' ')[0];
    const sessionCookie = data.headers['set-cookie'][1].split(' ')[0];
    const domParserInstance = new DomParser(data.body);
  
    const csrfToken = domParserInstance.getAttr('meta[name=csrf-token]', 'content');
    const deliveryData = await request(
      getPostOptions(
        csrfToken, 
        `${cookieCsrfToken} ${sessionCookie.substring(0, sessionCookie.length - 1)}`,
        ttn
      )
    );

    return deliveryData;
  }

  static async getPackageInfo(ttn) {
    const data = await JustinService.getPackageInfoByTtn(ttn);
    const domParser = new DomParser(data.body.html);
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