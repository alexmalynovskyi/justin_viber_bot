'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PackageService = undefined;

var _models = require('../sequelize/models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PackageService {
  static async upsertPackage(pck) {
    return _models2.default.package.upsert(pck, {
      attributes: ['description', 'status', 'title', 'ttn', 'text', 'date'],
      returning: true
    });
  }

  static deletePackageByTtn({ ttn }) {
    return _models2.default.package.destroy({
      where: {
        ttn
      }
    });
  }
}
exports.PackageService = PackageService;