import dbConfig from './dbConfig';
import mysql, { RowDataPacket, ResultSetHeader, OkPacket } from 'mysql2';
// Application Setup
export default mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
  });

