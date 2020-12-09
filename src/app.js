const ViberBot = require('viber-bot').Bot,
  BotEvents = require('viber-bot').Events,
  TextMessage = require('viber-bot').Message.Text,
  KeyboardMesasge = require('viber-bot').Message.Keyboard,
  express = require('express');
import { UserService } from './service/user.service';
import { JustinService } from './service/justin.service';
import { PackageService } from './service/package.service';
import KeyboardMessageBuilder from './utils/keyboard.message.builder';

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
console.log(BotEvents.SUBSCRIBED);
bot.on(BotEvents.SUBSCRIBED, response => {
  response.send(new TextMessage(`Hi there ${response.userProfile.name}. I am ${bot.name}! Feel free to ask me anything.`));
});

bot.onTextMessage(/all/im, async (message, response) => {
  const { id } = response.userProfile;
  const user = await UserService.getUserWithExtendedData(id);
  const usrPacakges = user.dataValues.packages;
  console.log('executed in row handler');

  if (usrPacakges && usrPacakges.length > 0) {
    const updatedPackages = [];

    for(let index = 0; index < usrPacakges.length; index++) {
      const pck = await JustinService.getPackageInfo(usrPacakges[index].ttn);

      if (pck) {
        const {
          title,
          date,
          text,
          status
        } = pck;

        const updatedPck = await PackageService.upsertPackage({
          title,
          date,
          text,
          status,
          ttn: usrPacakges[index].ttn,
          userId: user.id
        });

        if (updatedPck[0] && updatedPck[0].dataValues) {
          updatedPackages.push(updatedPck[0].dataValues);
        }
      }
    }

    const keyboardMessageBuilder = new KeyboardMessageBuilder(updatedPackages);
    const keyboard = keyboardMessageBuilder.buildKeyboard();

    response.send(new KeyboardMesasge(keyboard)).catch(error => {
      console.log(error);
    })
  }
});

bot.onTextMessage(/^[1-9]+$/im, async (message, response) => {
  try {
    const user = await UserService.getUserById(response.userProfile.id, response.userProfile);
    const pck = await JustinService.getPackageInfo(message.text);

    if (pck) {
      const {
        title,
        date,
        text,
        status,
      } = pck;

      await PackageService.upsertPackage({
        title,
        date,
        text,
        status,
        ttn: message.text,
        userId: user[0].id
      });

      response.send([
        new TextMessage(`
        Information about you delivery.
        title:  ${title}
        date: ${date}
        status: ${status}
        text: ${text}
        `)
      ]);
    }
  } catch(e) {
    console.log(e);
    // response.send(new RichMediaMessage(SAMPLE_RICH_MEDIA));
  }

});


const PORT = process.env.PORT || 3000;
app.use("/viber/webhook", bot.middleware());

app.init = async () => {
  return new Promise((resolve, reject) => {
    app.listen(PORT, () => {
      console.log(`Application running on port: ${PORT}`);
      bot.setWebhook(`${process.env.EXPOSE_URL}/viber/webhook`)
        .catch(error => {
        console.log('Can not set webhook on following server. Is it running?');
        console.error(error);
        reject(error);
        })
        .then(() => resolve(bot));
    });
  });
}

app.use((err, req, res, next) => {
  console.log(err);
})

module.exports = app;