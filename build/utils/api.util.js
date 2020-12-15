'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const commonHeaders = {
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest'
};

const getOptions = exports.getOptions = {
  method: 'GET',
  uri: 'https://justin.ua/tracking',
  headers: commonHeaders,
  resolveWithFullResponse: true
};

const getPostOptions = exports.getPostOptions = (token, cookieCsrfToken, number) => ({
  method: 'POST',
  uri: 'https://justin.ua/tracking',
  headers: _extends({}, commonHeaders, {
    'Cookie': cookieCsrfToken
  }),
  body: {
    _token: token,
    number: `${number}`
  },
  json: true,
  resolveWithFullResponse: true
});