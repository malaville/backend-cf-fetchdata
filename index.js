const mysql = require("mysql");
var passwordHash = require("password-hash");
/**
 * TODO(developer): specify SQL connection details
 */
const dbUser = "btc-user-reader";
const dbPassword = "btc-user-reader";
const dbName = process.env.SQL_NAME || "clement_le_bg";

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

exports.mysqlDemo = (req, res) => {
  console.log("hello");
  // Initialize the pool lazily, in case SQL access isn't needed for this
  // GCF instanc e. Doing so minimizes the number of active SQL connections,
  // which helps keep your GCF instances under SQL connection limits.
  if (!mysqlPool) {
    console.log("If");
    mysqlPool = mysql.createPool(mysqlConfig);
  }

  username = req.query.username || req.body.username || "World";
  password = req.query.passwordHash || req.body.passwordHash || "";
  console.log(password);

  mysqlPool.query(
    `SELECT 
    CASE
      WHEN COUNT(*) = 0 THEN 0
      WHEN COUNT(*) = 1 THEN 1
      WHEN COUNT(*) > 1 THEN -1
    END as logged
    FROM clement_le_bg.the_first_table WHERE name="${username}"
    `,
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.send(`{"logged":${results[0]["logged"]}}`);
      }
    }
  );

  // Close any SQL resources that were declared inside this function.
  // Keep any declared in global scope (e.g. mysqlPool) for later reuse.
};

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.helloHttp = (req, res) => {
  res.send(`Hello ${escapeHtml(req.query.name || req.body.name || "World")}!`);
};
