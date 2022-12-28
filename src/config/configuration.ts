export default () => ({
  port: parseInt(process.env.SERVER_PORT, 10) || 3000,
  database: {
    uri: process.env.DB_URL || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },

  //   database: {
  //     host: process.env.DATABASE_HOST,
  //     // port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  //   },
});

export const PORT = 'port';
export const JWT_SECRET = 'jwt.secret';
export const JWT_EXPIRES_IN = 'jwt.expiresIn';
export const DATABASE_URI = 'database.uri';
