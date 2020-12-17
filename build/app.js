'use strict';

var _user = require('./service/user.service');

var _justin = require('./service/justin.service');

var _package = require('./service/package.service');

var _viberBot = require('./service/viber.bot.service');

var _message = require('./utils/message.builder');

var _constants = require('./utils/constants');

const ViberBot = require('viber-bot').Bot,
      BotEvents = require('viber-bot').Events,
      TextMessage = require('viber-bot').Message.Text,
      KeyboardMesasge = require('viber-bot').Message.Keyboard,
      express = require('express');


const sendMessage = (res, textMessageArguments, keyboard) => {
  if (!keyboard || keyboard.Buttons.length === 0) {
    return res.send(new TextMessage(textMessageArguments));
  } else {
    return res.send(new TextMessage(textMessageArguments, keyboard));
  }
};

const app = express();

if (!process.env.BOT_ACCOUNT_TOKEN) {
  console.log('Could not find bot account token key.');
}
if (!process.env.EXPOSE_URL) {
  console.log('Could not find exposing url');
}

const bot = new ViberBot({
  authToken: process.env.BOT_ACCOUNT_TOKEN,
  name: "justin bot",
  avatar: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Katze_weiss.png"
});

bot.onSubscribe(response => {
  response.send(new TextMessage(_constants.USER_MESSAGE.USER_GUID));
});

bot.on(BotEvents.SUBSCRIBED, response => {
  console.log(`Subscribed: ${response.userProfile.name}`);
  response.send(new TextMessage(_constants.USER_MESSAGE.USER_GUID));
});

bot.onConversationStarted((userProfile, isSubscribed, context, onFinish) => onFinish(new TextMessage(_constants.USER_MESSAGE.USER_GUID)));

bot.onTextMessage(_constants.BOT_MESSAGE_PATTERNS.INFO, async (message, response) => {
  response.send(new TextMessage(_constants.USER_MESSAGE.USER_GUID));
});

bot.onTextMessage(_constants.BOT_MESSAGE_PATTERNS.DELETE_PACKAGE, async (message, response) => {
  const ttn = message.text.split(' ').pop();
  const { id } = response.userProfile;

  try {
    await _package.PackageService.deletePackageByTtn({
      ttn
    });
  } catch (e) {
    console.log('Error :', e);
  }

  const keyboard = await _viberBot.ViberBotService.buildUserKeyboardData(id);
  sendMessage(response, 'package has been  successfully deleted', keyboard).catch(error => {
    console.log(error);
  });
});

bot.onTextMessage(_constants.BOT_MESSAGE_PATTERNS.GET_ALL_USER_PACKAGES, async (message, response) => {
  const { id } = response.userProfile;
  const keyboard = await _viberBot.ViberBotService.buildUserKeyboardData(id);
  response.send(new KeyboardMesasge(keyboard)).catch(error => {
    console.log(error);
  });
});

bot.onTextMessage(_constants.BOT_MESSAGE_PATTERNS.PACKAGE_TTN, async (message, response) => {
  try {
    const { id } = response.userProfile;
    const user = await _user.UserService.getUserById(id, response.userProfile);
    const pck = await _justin.JustinService.getPackageInfo(message.text);
    const keyboard = await _viberBot.ViberBotService.buildUserKeyboardData(id);

    if (pck) {
      const {
        title,
        date,
        text,
        status
      } = pck;

      await _package.PackageService.upsertPackage({
        title,
        date,
        text,
        status,
        ttn: message.text,
        userId: user[0].id
      });

      sendMessage(response, (0, _message.messageBuilder)({
        title,
        date,
        text,
        status,
        ttn: message.text
      }), keyboard).catch(error => {
        console.log(error);
      });
    }
  } catch (e) {
    console.log(e);
  }
});

app.use("/viber/webhook", bot.middleware());

app.init = async port => {
  return new Promise((resolve, reject) => {
    app.listen(port, () => {
      bot.setWebhook(`${process.env.EXPOSE_URL}/viber/webhook`).catch(error => {
        reject(error);
      }).then(() => resolve(bot));
    });
  });
};

module.exports = app;