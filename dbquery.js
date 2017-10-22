module.exports = function() {
	var mysql = require('mysql');
	var inspect = require('util').inspect;
	//DataBase

	var DB_HOSTNAME = process.env.EVENTTRANSFER_MYSQL_HOSTNAME;
	var DB_PORT = process.env.EVENTTRANSFER_MYSQL_PORT;
	var DB_DATABASE = process.env.EVENTTRANSFER_MYSQL_DATABASE;
	var DB_USER = process.env.EVENTTRANSFER_MYSQL_USER;
	var DB_PASSWORD = process.env.EVENTTRANSFER_MYSQL_PASSWORD;

	// MySQL データベース名、ユーザー名、パスワード
	var pool = mysql.createPool({
		host: DB_HOSTNAME,
		port: DB_PORT,
		database: DB_DATABASE,
		user: DB_USER,
		password: DB_PASSWORD,
		multipleStatements: true
	});

	var _get = function(queryStr, callback) {
		pool.getConnection(function(err, connection) {
			if (err) {
				console.log(inspect(err));
				return callback(null);
			} else {
				connection.query(queryStr, function(err, rows, fields) {
					connection.release();
					return callback(rows);
				});
			}
		});
	}

	var _put = function(queryStr, queryReasult) {
		pool.getConnection(function(err, connection) {
			if (err) {
				console.log(inspect(err));
			} else {
				connection.query(queryStr, function(err, res) {
					connection.release();
					if (err) {
						console.log(inspect(err));
						return queryReasult(null);
					} else {
						return queryReasult(res);
					}
				});
			}
		});
	}

	module.exports.get = _get;
	module.exports.put = _put;
}