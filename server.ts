import connection from './connectdb';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import express, {Request , Response} from 'express';

const app = express();
const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get('/', (req: Request, res:Response) => 
{
  res.json({"stuff" : "here"});
})


app.get('/login/:user', (req: Request, res: Response) => {
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });
  let useremail = req.params.user;
  console.log("before query")
  connection.query(
    'SELECT * FROM ‘user’ where email = ?',[useremail]
  , function (error, results, fields) {
    // error will be an Error if one occurred during the query
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
    res.json(results)
  });
  console.log("before end")
})


/*
budget 
Add a budget:
  INSERT INTO budget VALUES( :user_id, :month_year, :income ) 
Get a budget for a user and month_year;
  SELECT user_id, income FROM budget WHERE user_id = :user_id AND month_year = :month_year;
Update a budget
  UPDATE budget SET income = :income WHERE user_id = :user_id AND month_year = :month_year;

*/
app.post("/budget/add", (req : Request, res: Response) => {

 // Map results = connection.query("INSERT INTO budget VALUES(?,?,?)", [req.body.user_id,req.body.month_year,req.body.income]);

})
app.get("/budget/:user/:month/:year", (req : Request, res: Response) =>{
  connection.connect();
  connection.query("SELECT user_id, income FROM budget WHERE user_id = ? AND month_year = ?",[req.params.user,req.params.month +"/"+req.params.year], 
    function (error, results, fields) {
      res.json(results);
    })
  connection.end();
})

app.put("/budget/edit/", (req: Request, res: Response) => {
  let new_income = req.body.new_income; 
  let user = req.body.user_id; 
  let month_year = req.body.month_year; 
  let sql = "UPDATE budget SET income = ? WHERE user_id = ? AND month_year = ?;"

  connection.connect();
  connection.query(sql, [new_income,user,month_year], 
    function (error, results, fields) {
      req.statusCode=200;
  })

})

/*
Transaction

Add a Transaction:
  INSERT INTO transaction VALUES( :user_id, :month_year, :time_stamp, :category, :amount);
Get all transactions for a specific category
  SELECT * FROM transaction WHERE user_id = :user_id AND category = :category
Get a transaction at a specific time
  SELECT * FROM transaction WHERE user_id = :user_id AND time_stamp = :time_stamp
Get all transactions for a user for a specific month_year 
  SELECT * FROM transaction WHERE user_id = :user_id AND month_year = :month_year;
Update a transaction:
  UPDATE transaction SET category = :category, amount = :amount WHERE user_id = :user_id AND month_year = :month_year AND time_stamp = :time_stamp;
Delete a transaction: 
  DELETE FROM transaction WHERE user_id = :user_id AND month_year = :month_year AND time_stamp = :time_stamp;

*/

// Endpoint to add a transaction
app.post("/transaction/add", (req, res) => {
  const { user_id, month_year, time_stamp, category, amount } = req.body;
  
  connection.query(
    "INSERT INTO transaction VALUES(?, ?, ?, ?, ?)",
    [user_id, month_year, time_stamp, category, amount],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(201).json({ message: "Transaction added successfully" });
      }
    }
  );
});

// Endpoint to get all transactions for a specific category
app.get("/transaction/category/:user/:category", (req, res) => {
  const { user, category } = req.params;

  connection.query(
    "SELECT * FROM transaction WHERE user_id = ? AND category = ?",
    [user, category],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// Endpoint to get a transaction at a specific time
app.get("/transaction/time/:user/:time_stamp", (req, res) => {
  const { user, time_stamp } = req.params;

  connection.query(
    "SELECT * FROM transaction WHERE user_id = ? AND time_stamp = ?",
    [user, time_stamp],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// Endpoint to get all transactions for a user for a specific month_year
app.get("/transaction/user/:user/:month_year", (req, res) => {
  const { user, month_year } = req.params;

  connection.query(
    "SELECT * FROM transaction WHERE user_id = ? AND month_year = ?",
    [user, month_year],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// Endpoint to update a transaction
app.put("/transaction/update/:user/:month_year/:time_stamp", (req, res) => {
  const { user, month_year, time_stamp } = req.params;
  const { category, amount } = req.body;

  connection.query(
    "UPDATE transaction SET category = ?, amount = ? WHERE user_id = ? AND month_year = ? AND time_stamp = ?",
    [category, amount, user, month_year, time_stamp],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Transaction updated successfully" });
      }
    }
  );
});

// Endpoint to delete a transaction
app.delete("/transaction/delete/:user/:month_year/:time_stamp", (req, res) => {
  const { user, month_year, time_stamp } = req.params;

  connection.query(
    "DELETE FROM transaction WHERE user_id = ? AND month_year = ? AND time_stamp = ?",
    [user, month_year, time_stamp],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Transaction deleted successfully" });
      }
    }
  );
});

/*
Allocation
Add an allocation:
  INSERT INTO allocation VALUES(:user_id, :month_year, :category, :amount);
Get all allocations:
  SELECT * FROM allocation WHERE user_id = :user_id;
Get all allocations for a specific month_year
  SELECT * FROM allocation WHERE user_id = :user_id AND month_year = :month_year;
Get all allocations for a specific category
  SELECT * FROM allocation WHERE user_id = :user_id AND category = :category;
Update an allocation:
  UPDATE allocation SET amount = :amount WHERE user_id = :user_id AND month_year = :month_year AND category = :category;

*/


// Endpoint to add an allocation
app.post("/allocation/add", (req, res) => {
  const { user_id, month_year, category, amount } = req.body;

  connection.query(
    "INSERT INTO allocation VALUES (?, ?, ?, ?)",
    [user_id, month_year, category, amount],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(201).json({ message: "Allocation added successfully" });
      }
    }
  );
});

// Endpoint to get all allocations
app.get("/allocation/:user", (req, res) => {
  const { user } = req.params;

  connection.query(
    "SELECT * FROM allocation WHERE user_id = ?",
    [user],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// Endpoint to get all allocations for a specific month_year
app.get("/allocation/:user/:month_year", (req, res) => {
  const { user, month_year } = req.params;

  connection.query(
    "SELECT * FROM allocation WHERE user_id = ? AND month_year = ?",
    [user, month_year],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// Endpoint to get all allocations for a specific category
app.get("/allocation/category/:user/:category", (req, res) => {
  const { user, category } = req.params;

  connection.query(
    "SELECT * FROM allocation WHERE user_id = ? AND category = ?",
    [user, category],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

/*
WatchedStocks
Add a watched stock
  INSERT INTO watched_stocks VALUES(:user_id, :ticker);
Get all watched stocks
  SELECT * FROM watched_stocks WHERE user_id = :user_id;
Remove a watched stock
  DELETE FROM watched_stocks WHERE user_id = :user_id AND ticker = :ticker;

*/
app.put("/allocation/update/:user/:month_year/:category", (req, res) => {
  const { user, month_year, category } = req.params;
  const { amount } = req.body;

  connection.query(
    "UPDATE allocation SET amount = ? WHERE user_id = ? AND month_year = ? AND category = ?",
    [amount, user, month_year, category],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Allocation updated successfully" });
      }
    }
  );
});



// Endpoint to add a watched stock
app.post("/watched-stocks/add", (req, res) => {
  const { user_id, ticker } = req.body;

  connection.query(
    "INSERT INTO watched_stocks VALUES (?, ?)",
    [user_id, ticker],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(201).json({ message: "Watched stock added successfully" });
      }
    }
  );
});

// Endpoint to get all watched stocks
app.get("/watched-stocks/:user", (req, res) => {
  const { user } = req.params;

  connection.query(
    "SELECT * FROM watched_stocks WHERE user_id = ?",
    [user],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// Endpoint to remove a watched stock
app.delete("/watched-stocks/remove/:user/:ticker", (req, res) => {
  const { user, ticker } = req.params;

  connection.query(
    "DELETE FROM watched_stocks WHERE user_id = ? AND ticker = ?",
    [user, ticker],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Watched stock removed successfully" });
      }
    }
  );
});

/*
Stock_price
Add a stock ticker and price
  INSERT INTO stock_price VALUES(:ticker, :time_stamp, :price);
Update the ticker and price
  UPDATE stock_price SET price = :price WHERE ticker = :ticker AND time_stamp = :time_stamp;
Get a stock ticker and its price
  SELECT ticker, price FROM stock_price WHERE ticker = :ticker;
Get all information from the table for a specific stock
  SELECT * FROM stock_price WHERE ticker = :ticker;

*/

// Endpoint to add a stock ticker and price
app.post("/stock-price/add", (req, res) => {
  const { ticker, time_stamp, price } = req.body;

  connection.query(
    "INSERT INTO stock_price VALUES (?, ?, ?)",
    [ticker, time_stamp, price],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(201).json({ message: "Stock price added successfully" });
      }
    }
  );
});

// Endpoint to update the ticker and price
app.put("/stock-price/update/:ticker/:time_stamp", (req, res) => {
  const { ticker, time_stamp } = req.params;
  const { price } = req.body;

  connection.query(
    "UPDATE stock_price SET price = ? WHERE ticker = ? AND time_stamp = ?",
    [price, ticker, time_stamp],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Stock price updated successfully" });
      }
    }
  );
});

// Endpoint to get a stock ticker and its price
app.get("/stock-price/ticker/:ticker", (req, res) => {
  const { ticker } = req.params;

  connection.query(
    "SELECT ticker, price FROM stock_price WHERE ticker = ?",
    [ticker],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// Endpoint to get all information from the table for a specific stock
app.get("/stock-price/all/:ticker", (req, res) => {
  const { ticker } = req.params;

  connection.query(
    "SELECT * FROM stock_price WHERE ticker = ?",
    [ticker],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

/*
OwnedStocks
Add an owned stock
INSERT INTO owned_stock VALUES(:user_id, :ticker, :purchase_time_stamp, :sell_time_stamp, :number_of_shares);
Delete an owned stock (it was sold)
DELETE FROM owned_stock WHERE user_id = :user_id AND ticker = :ticker;
Get all owned stocks for a specific user
SELECT user_id, ticker FROM owned_stock WHERE user_id = :user_id;
Get all owned stocks for a specific user with number of shares they own
SELECT user_id, ticker, number_of_shares FROM owned_stock WHERE user_id = :user_id;
Get all owned stocks for a specific user with the purchase_time_stamp included
SELECT user_id, ticker, purchase_time_stamp FROM owned_stock WHERE user_id = :user_id;
Get all information about an owned stock for a specific user
SELECT * FROM owned_stock WHERE user_id = :user_id;

*/

// Endpoint to add an owned stock
app.post("/owned-stocks/add", (req, res) => {
  const { user_id, ticker, purchase_time_stamp, sell_time_stamp, number_of_shares } = req.body;

  connection.query(
    "INSERT INTO owned_stock VALUES (?, ?, ?, ?, ?)",
    [user_id, ticker, purchase_time_stamp, sell_time_stamp, number_of_shares],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(201).json({ message: "Owned stock added successfully" });
      }
    }
  );
});

// Endpoint to delete an owned stock (it was sold)
app.delete("/owned-stocks/delete/:user/:ticker", (req, res) => {
  const { user, ticker } = req.params;

  connection.query(
    "DELETE FROM owned_stock WHERE user_id = ? AND ticker = ?",
    [user, ticker],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Owned stock deleted successfully" });
      }
    }
  );
});

// Endpoint to get all owned stocks for a specific user
app.get("/owned-stocks/:user", (req, res) => {
  const { user } = req.params;

  connection.query(
    "SELECT user_id, ticker FROM owned_stock WHERE user_id = ?",
    [user],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// Endpoint to get all owned stocks for a specific user with the number of shares they own
app.get("/owned-stocks/shares/:user", (req, res) => {
  const { user } = req.params;

  connection.query(
    "SELECT user_id, ticker, number_of_shares FROM owned_stock WHERE user_id = ?",
    [user],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// Endpoint to get all owned stocks for a specific user with the purchase_time_stamp included
app.get("/owned-stocks/purchase-timestamp/:user", (req, res) => {
  const { user } = req.params;

  connection.query(
    "SELECT user_id, ticker, purchase_time_stamp FROM owned_stock WHERE user_id = ?",
    [user],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// Endpoint to get all information about an owned stock for a specific user
app.get("/owned-stocks/all/:user", (req, res) => {
  const { user } = req.params;

  connection.query(
    "SELECT * FROM owned_stock WHERE user_id = ?",
    [user],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    }
  );
});


/*
Asset
Add an asset
INSERT INTO asset VALUES(:user_id, :name, :value, :type);
Update the value of an asset
UPDATE asset SET value = :value WHERE user_id = :user_id AND name = :name;
Delete an asset
DELETE FROM asset WHERE user_id = :user_id AND name = :name;
Get total amount of assets for specific user
SELECT user_id, SUM(value) AS total_assets FROM asset WHERE user_id = :user_id GROUP BY :user_id;
Get total value of assets by group for specific user
SELECT user_id, type, SUM(value) AS total_assets FROM asset WHERE user_id = :user_id GROUP BY :user_id, :type;

*/

// Endpoint to add an asset
app.post("/assets/add", (req, res) => {
  const { user_id, name, value, type } = req.body;

  connection.query(
    "INSERT INTO asset VALUES (?, ?, ?, ?)",
    [user_id, name, value, type],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(201).json({ message: "Asset added successfully" });
      }
    }
  );
});

// Endpoint to update the value of an asset
app.put("/assets/update/:user/:name", (req, res) => {
  const { user, name } = req.params;
  const { value } = req.body;

  connection.query(
    "UPDATE asset SET value = ? WHERE user_id = ? AND name = ?",
    [value, user, name],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Asset value updated successfully" });
      }
    }
  );
});

// Endpoint to delete an asset
app.delete("/assets/delete/:user/:name", (req, res) => {
  const { user, name } = req.params;

  connection.query(
    "DELETE FROM asset WHERE user_id = ? AND name = ?",
    [user, name],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Asset deleted successfully" });
      }
    }
  );
});

// Endpoint to get the total amount of assets for a specific user
app.get("/assets/total/:user", (req, res) => {
  const { user } = req.params;

  connection.query(
    "SELECT user_id, SUM(value) AS total_assets FROM asset WHERE user_id = ? GROUP BY user_id",
    [user],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// Endpoint to get the total value of assets by group for a specific user
app.get("/assets/total-by-group/:user/:type", (req, res) => {
  const { user, type } = req.params;

  connection.query(
    "SELECT user_id, type, SUM(value) AS total_assets FROM asset WHERE user_id = ? AND type = ? GROUP BY user_id, type",
    [user, type],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    }
  );
});


/*
Debt
Add debt to the db
INSERT INTO debt VALUES(:user_id, :name, :amount, :interest_rate, :servicer);
Update the amount of the debt
UPDATE debt SET amount = :amount WHERE user_id = :user_id AND name = :name;
Update the interest rate if they change
UPDATE deb SET interest_rate = :interest_rate WHERE user_id = :user_id AND name = :name;
Delete debt
DELETE FROM debt WHERE user_id = :user_id AND name = :name;
Get a sum of the total debt for a specific user
SELECT user_id, SUM(amount) AS total_debt FROM debt WHERE user_id = :user_id GROUP BY :user_id;
*/


// Endpoint to add debt to the database
app.post("/debt/add", (req, res) => {
  const { user_id, name, amount, interest_rate, servicer } = req.body;

  connection.query(
    "INSERT INTO debt VALUES (?, ?, ?, ?, ?)",
    [user_id, name, amount, interest_rate, servicer],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(201).json({ message: "Debt added successfully" });
      }
    }
  );
});

// Endpoint to update the amount of the debt
app.put("/debt/update-amount/:user/:name", (req, res) => {
  const { user, name } = req.params;
  const { amount } = req.body;

  connection.query(
    "UPDATE debt SET amount = ? WHERE user_id = ? AND name = ?",
    [amount, user, name],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Debt amount updated successfully" });
      }
    }
  );
});

// Endpoint to update the interest rate if it changes
app.put("/debt/update-interest-rate/:user/:name", (req, res) => {
  const { user, name } = req.params;
  const { interest_rate } = req.body;

  connection.query(
    "UPDATE debt SET interest_rate = ? WHERE user_id = ? AND name = ?",
    [interest_rate, user, name],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Debt interest rate updated successfully" });
      }
    }
  );
});

// Endpoint to delete debt
app.delete("/debt/delete/:user/:name", (req, res) => {
  const { user, name } = req.params;

  connection.query(
    "DELETE FROM debt WHERE user_id = ? AND name = ?",
    [user, name],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Debt deleted successfully" });
      }
    }
  );
});

// Endpoint to get the sum of the total debt for a specific user
app.get("/debt/total/:user", (req, res) => {
  const { user } = req.params;

  connection.query(
    "SELECT user_id, SUM(amount) AS total_debt FROM debt WHERE user_id = ? GROUP BY user_id",
    [user],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

