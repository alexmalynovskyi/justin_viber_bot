import schedule from 'node-schedule';
import { UserService } from '../service/user.service';
import { JustinService } from '../service/justin.service';
import { PackageService } from '../service/package.service';
import { messageBuilder } from './message.builder';
const TextMessage = require('viber-bot').Message.Text;

const CRON_EXPRESSION = {
  REPEAT_EACH_HOUR: '0 * * * *',
  REPEAT_EACH_5_MINUTES: '*/1 * * * *'
};

module.exports = (bot) => {
  const cron = schedule.scheduleJob(CRON_EXPRESSION.REPEAT_EACH_HOUR, async () => {
    const users = await UserService.getAllUserWithExtendedData();

    if (users && users.length > 0) {
      users.forEach(user => {
        const { packages, externalId, name } = user;
        const userProfile = {
          id: externalId,
          name
        };

        if (packages && packages.length > 0) {
          packages.forEach( async pck => {
            const { ttn } = pck.dataValues;

            try {
              const justinPackageInfo = await JustinService.getPackageInfo(+ttn);
              const updatedPackage = await PackageService.upsertPackage(
                {
                  ...justinPackageInfo,
                  userId: user.id,
                  ttn
                }
              );

              bot.sendMessage(userProfile, new TextMessage(messageBuilder(updatedPackage[0].dataValues)));
            } catch(error) {
              console.log(error);
            }
          });
        }
      });
    }
  });

  return cron;
}