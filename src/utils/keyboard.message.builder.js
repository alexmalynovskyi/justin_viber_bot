import { messageBuilder } from './message.builder';

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
}

class KeyboardMessageBuilder {
  constructor(packages) {
    this.packages = packages;
    this.keyboard = JSON.parse(JSON.stringify(KEYBOARD));
  }

  _buildBtn({ textOpacity = 100, text, rows, columns, imgSrc, actionBody }) {
    return {
      'Columns': columns,
      'Rows': rows,
      'ActionBody': text,
      'Text': text,
      'Image': imgSrc,
      'TextOpacity': textOpacity,
      ...BTN_COMMON_PROPERTIES
    }
  }

  _buildKeyboardRow(pck) {
    const infoButton = this._buildBtn({
      columns: 4,
      rows: 2,
      text: messageBuilder(pck)
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

    return [infoButton, deleteButton, checkButton]
  }

  buildButtons() {
    const bnts = [];

    this.packages.forEach(pck => {
      bnts.push(...this._buildKeyboardRow(pck));
    });

    return bnts;
  }

  buildKeyboard() {
    this.keyboard['Buttons'] = this.buildButtons()

    return this.keyboard;
  }
}

module.exports = KeyboardMessageBuilder;