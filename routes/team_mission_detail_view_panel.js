module.exports = function(world) {
	var query = world.query;
	var sqltls = world.sqltls;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_missiongroupid = req.body.missiongroupid ;
		
		if(!sqltls.isPInt(r_missiongroupid)){
			res.send("err!");
		}
		
		var queryStr = "SELECT " +
						"	`BifQuestCircle`.`CircleID`, " +
						"	`BifQuestCircle`.`CircleLocation`, " +
						"	`BifQuestCircle`.`CircleName` " +
						"FROM `BifQuestCircle` " +
						"WHERE `BifQuestCircle`.`EventID` = '" + r_eventid + "'" +
						"AND `BifQuestCircle`.`TeamID` = '" + r_teamid + "'" +
						"AND NOT EXISTS " +
						"(SELECT * FROM `BifMissionGroupDetail` " +
						"WHERE `BifQuestCircle`.`EventID` = `BifMissionGroupDetail`.`EventID` " +
						"AND `BifQuestCircle`.`TeamID` = `BifMissionGroupDetail`.`TeamID` " +
						"AND `BifQuestCircle`.`CircleID` = `BifMissionGroupDetail`.`CircleID` " +
						"AND `BifMissionGroupDetail`.`DetailID` = '" + r_missiongroupid + "' " + 
						") " +
						"ORDER BY `BifQuestCircle`.`CircleLocation`,`BifQuestCircle`.`CircleName`;" ;
		//console.log(queryStr);
		
		query.get(queryStr, function(result) {
			res.send(result);
		});
	}
	return routerhandle;
}