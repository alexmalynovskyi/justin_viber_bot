'use strict';

require('dotenv').config();
const app = require('./app');
const db = require('./sequelize/models');
const cronJob = require('./utils/cron.job');
const PORT = process.env.PORT || 3000;

const bootstrap = async () => {
  await db.init().catch(err => console.error(`Failed to connect to DB with error ${err.message}`));
  const bot = await app.init(PORT).catch(error => {
    console.error(error);
    process.exit(0);
  });
  // cronJob(bot);

  console.log('Server and DB successfully started');
};

bootstrap();

process.on('uncaughtException', (err, origin) => {
  console.log(`Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

process.on('exit', error => {
  console.log(error);
});