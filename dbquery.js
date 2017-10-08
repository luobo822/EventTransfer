module.exports = function() {
	var mysql = require('mysql');
	var inspect = require('util').inspect;
	//DataBase

	var DB_HOSTNAME = '127.0.0.1';
	var DB_PORT = '3306';
	var DB_DATABASE = 'nodejs';
	var DB_USER = 'admin7eeyDzy';
	var DB_PASSWORD = 'N73DmRjzta1b';


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