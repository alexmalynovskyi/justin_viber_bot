"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const USER_MESSAGE = exports.USER_MESSAGE = {
  USER_GUID: `
  Для того, щоб почати працювати с ботом - потрібно ввести ttn номер, далі бот опрацює цей запит і якщо посилка існує, тоді :
  1. бот повідомить поточний статус;
  2. почне відстежувати дані посилки в фоновому режимі і якщо будуть сміни у статусі повідомить за це.

  Команди бота:
    all - команла для  відстеження всіх посилок, а також надання меню для керування посилкою.
  `
};

const BOT_MESSAGE_PATTERNS = exports.BOT_MESSAGE_PATTERNS = {
  GET_ALL_USER_PACKAGES: /all/im,
  DELETE_PACKAGE: /^delete [1-9]+$/im,
  INFO: /^hi|help|commands|команди|привіт$/im,
  PACKAGE_TTN: /^[1-9]+$/im
};