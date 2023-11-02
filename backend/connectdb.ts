import dbConfig from './dbConfig';
import mysql, { RowDataPacket, ResultSetHeader, OkPacket } from 'mysql2';
// Application Setup
export default mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    port: dbConfig.PORT, // added port specification for security reasons
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
  });

