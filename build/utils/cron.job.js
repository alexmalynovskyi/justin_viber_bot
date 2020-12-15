'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _nodeSchedule = require('node-schedule');

var _nodeSchedule2 = _interopRequireDefault(_nodeSchedule);

var _user = require('../service/user.service');

var _justin = require('../service/justin.service');

var _package = require('../service/package.service');

var _message = require('./message.builder');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TextMessage = require('viber-bot').Message.Text;

const CRON_EXPRESSION = {
  REPEAT_EACH_HOUR: '0 * * * *',
  REPEAT_EACH_1_MINUTES: '* * * * *'
};

module.exports = bot => {
  const cron = _nodeSchedule2.default.scheduleJob(CRON_EXPRESSION.REPEAT_EACH_HOUR, async () => {
    const users = await _user.UserService.getAllUserWithExtendedData();

    if (users && users.length > 0) {
      users.forEach(user => {
        const { packages, externalId, name } = user;
        const userProfile = {
          id: externalId,
          name
        };

        if (packages && packages.length > 0) {
          packages.forEach(async pck => {
            const {
              ttn,
              status: prevStatus,
              date: prevDate,
              description: prevDescription,
              title: prevTitle
            } = pck.dataValues;

            try {
              const justinPackageInfo = await _justin.JustinService.getPackageInfo(+ttn);
              const updatedPackage = await _package.PackageService.upsertPackage(_extends({}, justinPackageInfo, {
                userId: user.id,
                ttn
              }));
              const { description, date, status, text, title } = updatedPackage[0].dataValues;

              if (prevDescription !== description || prevDate !== date || status !== prevStatus || prevTitle !== title) {
                bot.sendMessage(userProfile, new TextMessage((0, _message.messageBuilder)({
                  description,
                  ttn,
                  date,
                  status,
                  text,
                  title
                })));
              }
            } catch (error) {
              console.log(error);
            }
          });
        }
      });
    }
  });

  return cron;
};