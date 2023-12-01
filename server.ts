import connection from './connectdb';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import express, {Request , Response} from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get('/', (req: Request, res:Response) => 
{
  res.json({"stuff" : "here"});
})


app.get('/login', (req: Request, res: Response) => {
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
})



