
module.exports = {
  development: {
    databaseUrl: process.env.DATABASE_URL,
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOSTNAME,
    port: process.env.DEV_DB_PORT,
    dialect: 'postgres',
  },
  test: {
    databaseUrl: process.env.DATABASE_URL,
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    port: 5432,
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    databaseUrl: process.env.DATABASE_URL,
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    port: process.env.PROD_DB_PORT,
    dialect: 'postgres',
  },
};