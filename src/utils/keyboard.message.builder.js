import { messageBuilder } from './message.builder';

const KEYBOARD = {
  "Type": "keyboard"
};

const BTN_COMMON_PROPERTIES = {
  "TextHAlign": "center",
  "TextVAlign": "middle",
  "BgColor": "#f7bb3f",
  "ActionType": "reply",
  "TextSize": "small"
};

const BTN_IMAGES_SRC = {
  DELETE: '',
  UPDATE: ''
}

class KeyboardMessageBuilder {
  constructor(packages) {
    this.packages = packages;
    this.keyboard = JSON.parse(JSON.stringify(KEYBOARD));
  }

  _buildBtn({ text, rows, columns }) {
    return {
      'Columns': columns,
      'Rows': rows,
      'ActionBody': text,
      'Text': text,
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
      text: `delete ${pck.ttn}`
    });
    const checkButton = this._buildBtn({
      columns: 2,
      rows: 1,
      text: pck.ttn
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