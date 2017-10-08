module.exports = function(world) {
	var query = world.query;
	var routerhandle = function(req, res) {
		var queryStr = "SELECT `BifEvent`.`EventID`," + 
						"    `BifEvent`.`EventName`," + 
						"    `BifEvent`.`EventOpenTime`," + 
						"    `BifEvent`.`EventCloseTime`," + 
						"    `BifEvent`.`EventLocation`" + 
						"FROM `BifEvent`" + 
						"WHERE `BifEvent`.`EventID` != '9999999999' " + 
						"ORDER BY `BifEvent`.`EventID` DESC;";

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