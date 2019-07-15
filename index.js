const mysql = require("mysql");
/**
 * TODO(developer): specify SQL connection details
 */
const dbUser = "btc-user-reader";
const dbPassword = "btc-user-reader";
const dbName = process.env.SQL_NAME || "bitcoin-data";

const mysqlConfig = {
  connectionLimit: 1,
  user: dbUser,
  host: "35.204.149.26",
  password: dbPassword,
  database: dbName
};

// Connection pools reuse connections between invocations,
// and handle dropped or expired connections automatically.
let mysqlPool;

exports.mysqlFetchData = (req, res) => {
  console.log("hello");
  // Initialize the pool lazily, in case SQL access isn't needed for this
  // GCF instanc e. Doing so minimizes the number of active SQL connections,
  // which helps keep your GCF instances under SQL connection limits.
  if (!mysqlPool) {
    console.log("If");
    mysqlPool = mysql.createPool(mysqlConfig);
  }

  username = req.query.username || req.body.username || "USERNAME";
  password = req.query.passwordHash || req.body.passwordHash || "PASSWORD_HASH";

  let allResults = {};
  let numberResolved = 0;

  const queries = [
    "SELECT * from `bitcoin-data`.`daily-btc-value`;",
    "SELECT * from `bitcoin-data`.`daily-trend-bitcoin`;"
  ];

  const targetNumber = queries.length;

  sendTrigger = () => {
    console.log("sendTrigger numberResolved", numberResolved);
    console.log(allResults);
    if (numberResolved === targetNumber) {
      console.log("Sending DEFINITELY");
      res.send(allResults);
    }
  };

  for (let i = 0; i < targetNumber; i++) {
    const local_query = queries[i];
    mysqlPool.query(local_query, (err, results) => {
      err && console.log(err);
      allResults["query" + i] = { query: local_query, results: results };
      numberResolved += 1;
      sendTrigger();
    });
  }
};
