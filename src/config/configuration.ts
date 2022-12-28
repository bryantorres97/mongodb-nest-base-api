export default () => ({
  port: parseInt(process.env.SERVER_PORT, 10) || 3000,
  database: {
    uri: process.env.DB_URL || '',
  },

  //   database: {
  //     host: process.env.DATABASE_HOST,
  //     // port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  //   },
});
