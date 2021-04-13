module.exports = {
    local: {
      username: process.env.PG_USER,
      password: process.env.PG_PASS,
      database: process.env.PG_DBNAME,
      host: process.env.PG_URL || '127.0.0.1',
      dialect: 'postgres',
      logging: console.log,
    },
    /* 
    dev: {
      username: process.env.PG_USER,
      password: process.env.PG_PASS,
      database: process.env.PG_DBNAME,
      host: process.env.PG_URL || '127.0.0.1',
      dialect: 'postgres',
    },
    stage: {
      username: process.env.PG_USER,
      password: process.env.PG_PASS,
      database: process.env.PG_DBNAME,
      host: process.env.PG_URL || '127.0.0.1',
      dialect: 'postgres',
    }, */
    prod: {
      username: process.env.PG_USER,
      password: process.env.PG_PASS,
      database: process.env.PG_DBNAME,
      host: process.env.PG_URL || '127.0.0.1',
      dialect: 'postgres',
    },
  };