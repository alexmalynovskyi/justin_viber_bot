const ViberBot = require('viber-bot').Bot,
  BotEvents = require('viber-bot').Events,
  TextMessage = require('viber-bot').Message.Text,
  express = require('express');
import { UserService } from './service/user.service';
import { JustinService } from './service/justin.service';
import { PackageService } from './service/package.service';

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
bot.on(BotEvents.MESSAGE_RECEIVED, async (message, response) => {  
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

bot.onTextMessage(/./i, (response) => {
  console.log('on any text', response.userProfile);
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

module.exports = app;