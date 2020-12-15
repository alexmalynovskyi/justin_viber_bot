'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViberBotService = undefined;

var _package = require('./package.service');

var _user = require('./user.service');

var _justin = require('./justin.service');

var _keyboardMessage = require('../utils/keyboard.message.builder');

var _keyboardMessage2 = _interopRequireDefault(_keyboardMessage);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ViberBotService {
  static async buildUserKeyboardData(id) {
    const user = await _user.UserService.getUserWithExtendedData(id);
    const usrPacakges = user.dataValues.packages;
    const updatedPackages = [];

    if (usrPacakges && usrPacakges.length > 0) {

      for (let index = 0; index < usrPacakges.length; index++) {
        const pck = await _justin.JustinService.getPackageInfo(usrPacakges[index].ttn);

        if (pck) {
          const {
            title,
            date,
            text,
            status
          } = pck;

          const updatedPck = await _package.PackageService.upsertPackage({
            title,
            date,
            text,
            status,
            ttn: usrPacakges[index].ttn,
            userId: user.id
          });

          if (updatedPck[0] && updatedPck[0].dataValues) {
            const pckData = (0, _lodash.pick)(updatedPck[0].dataValues, ['ttn', 'date', 'text', 'status']);
            updatedPackages.push(pckData);
          }
        }
      }
    }

    const keyboardMessageBuilder = new _keyboardMessage2.default(updatedPackages);
    return keyboardMessageBuilder.buildKeyboard();
  }
}
exports.ViberBotService = ViberBotService;