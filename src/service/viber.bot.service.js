import { PackageService } from './package.service';
import { UserService } from './user.service';
import { JustinService } from './justin.service';
import KeyboardMessageBuilder from '../utils/keyboard.message.builder';
import { pick } from 'lodash';

export class ViberBotService {
  static async buildUserKeyboardData(id) {
    const user = await UserService.getUserWithExtendedData(id);
    const usrPacakges = user.dataValues.packages;
    const updatedPackages = [];

    if (usrPacakges && usrPacakges.length > 0) {

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
            const pckData = pick(updatedPck[0].dataValues, ['ttn', 'date', 'text', 'status']);
            updatedPackages.push(pckData);
          }
        }
      }
    }

    const keyboardMessageBuilder = new KeyboardMessageBuilder(updatedPackages);
    return keyboardMessageBuilder.buildKeyboard();
  }
}