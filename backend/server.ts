import connection from './connectdb'
import { ResultSetHeader, RowDataPacket } from 'mysql2';

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });

  connection.query({
    sql: 'SELECT * FROM ‘user’',
    timeout: 40000, // 40s
  }, function (error, results, fields) {
    // error will be an Error if one occurred during the query
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
    console.log((results as RowDataPacket[])[0].email);
  });