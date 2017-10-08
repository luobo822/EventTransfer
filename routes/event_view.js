module.exports = function(dquery) {
	var query = dquery;
	var routerhandle = function(req, res) {
		var queryStr = "SELECT `BifEvent`.`EventID`," + 
						"    `BifEvent`.`EventName`," + 
						"    `BifEvent`.`EventOpenTime`," + 
						"    `BifEvent`.`EventCloseTime`," + 
						"    `BifEvent`.`EventLocation`," + 
						"    `BifEvent`.`EventIsAlive`" + 
						"FROM `BifEvent`" + 
						"WHERE `BifEvent`.`EventIsAlive` = 'Y';";

		//console.log("SQL:" + queryStr);
		res.setHeader('Content-Type', 'application/json');
		var queryCallBack = function(result) {
			//console.log("SQL result:" + result);
			res.send(result);
		}
		query.get(queryStr, queryCallBack);
	}
	return routerhandle;
}