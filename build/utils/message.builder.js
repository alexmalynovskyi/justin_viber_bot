'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messageBuilder = undefined;

var _localize = require('./localize.util');

const messageBuilder = exports.messageBuilder = pck => {
  let str = 'Інформація за вашу посилку.';
  for (const key in pck) {
    if (pck[key] && key) {
      const localValue = _localize.localize[key] || key;
      str += `\n${localValue}: ${pck[key]}`;
    }
  }

  return str;
};