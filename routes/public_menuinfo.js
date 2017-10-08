module.exports = function(world) {
	var query = world.query;
	var sqltls = world.sqltls;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'application/json; charset=utf-8');
		
		var r_eventid;
		if(!sqltls.isEventID(req.params.target)){
			res.send("ERROR");return;
		}else{
			r_eventid = req.params.target;
		}
		
		var queryStr = "SELECT `BifQuestCircle`.`EventID`, " + 
			"	`BifEvent`.`EventName`, " + 
			"    `BifQuestCircle`.`CircleLocation`, " + 
			"    `BifQuestCircle`.`CircleName`, " + 
			"    `BifQuestCircle`.`CircleWeb`, " + 
			"    `BifQuestCircle`.`UpdateTime`, " + 
			"    `BifQuestCircle`.`CreateTime` " + 
			"FROM `BifQuestCircle` " + 
			"INNER JOIN `BifEvent` " + 
			"ON  `BifQuestCircle`.`EventID` = `BifEvent`.`EventID` " + 
			"WHERE `BifQuestCircle`.`EventID` = '" + r_eventid + "'" + 
			"GROUP BY  " + 
			"    `BifQuestCircle`.`CircleLocation`, " + 
			"    `BifQuestCircle`.`CircleName`, " + 
			"    `BifQuestCircle`.`CircleWeb` " + 
			"ORDER BY  " + 
			"	`BifQuestCircle`.`EventID`, " + 
			"    `BifQuestCircle`.`CircleLocation`, " + 
			"    `BifQuestCircle`.`CircleName`, " + 
				"    `BifQuestCircle`.`CircleWeb`; ";

		//console.log("SQL:" + queryStr);
		var queryCallBack = function(result) {
			//console.log("SQL result:" + result);
			res.send(result);
		}
		query.get(queryStr, queryCallBack);
	}
	return routerhandle;
}