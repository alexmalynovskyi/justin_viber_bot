"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _message = require("./message.builder");

const KEYBOARD = {
  "Type": "keyboard"
};

const BTN_COMMON_PROPERTIES = {
  "TextHAlign": "left",
  "TextVAlign": "middle",
  "ActionType": "reply",
  "TextSize": "small"
};

const BTN_IMAGES_SRC = {
  DELETE: 'https://i.postimg.cc/85H9KYFp/remove-medium-icon.png',
  UPDATE: 'https://i.postimg.cc/ydRGHnkh/update-medium-icon.png'
};

class KeyboardMessageBuilder {
  constructor(packages) {
    this.packages = packages;
    this.keyboard = JSON.parse(JSON.stringify(KEYBOARD));
  }

  _buildBtn({ textOpacity = 100, text, rows, columns, imgSrc, actionBody }) {
    return _extends({
      'Columns': columns,
      'Rows': rows,
      'ActionBody': text,
      'Text': text,
      'Image': imgSrc,
      'TextOpacity': textOpacity
    }, BTN_COMMON_PROPERTIES);
  }

  _buildKeyboardRow(pck) {
    const infoButton = this._buildBtn({
      columns: 4,
      rows: 2,
      text: (0, _message.messageBuilder)(pck)
    });
    const deleteButton = this._buildBtn({
      columns: 2,
      rows: 1,
      textOpacity: 0,
      text: `delete ${pck.ttn}`,
      imgSrc: BTN_IMAGES_SRC.DELETE
    });
    const checkButton = this._buildBtn({
      columns: 2,
      rows: 1,
      textOpacity: 0,
      text: pck.ttn,
      imgSrc: BTN_IMAGES_SRC.UPDATE
    });

    return [infoButton, deleteButton, checkButton];
  }

  buildButtons() {
    const bnts = [];

    this.packages.forEach(pck => {
      bnts.push(...this._buildKeyboardRow(pck));
    });

    return bnts;
  }

  buildKeyboard() {
    this.keyboard['Buttons'] = this.buildButtons();

    return this.keyboard;
  }
}

module.exports = KeyboardMessageBuilder;