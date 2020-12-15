'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserService = undefined;

var _index = require('../sequelize/models/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UserService {
  static getUserById(externalId, userProfile) {
    const { id, name, country, language } = userProfile;
    return _index2.default.user.findOrCreate({
      where: {
        externalId
      },
      defaults: {
        externalId: id,
        name,
        country,
        language
      }
    });
  }

  static getUserWithExtendedData() {
    return _index2.default.user.findOne({
      include: [{
        model: _index2.default.package,
        as: 'packages',
        required: false,
        attributes: ['description', 'status', 'title', 'ttn', 'text', 'date']
      }]
    });
  }

  static getAllUserWithExtendedData() {
    return _index2.default.user.findAll({
      include: [{
        model: _index2.default.package,
        as: 'packages',
        required: false,
        attributes: ['description', 'status', 'title', 'ttn', 'text', 'date']
      }]
    });
  }
}
exports.UserService = UserService;