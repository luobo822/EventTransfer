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
						"`BifMissionGroupDetail`.`MissionGroupID`, " +
						"`BifMissionGroupDetail`.`DetailID`, " +
						"`BifMissionGroupDetail`.`CircleID`, " +
						"`BifQuestCircle`.`CircleLocation`, " +
						"`BifQuestCircle`.`CircleName`, " +
						"`BifMissionGroupDetail`.`Level` " +
						"FROM `BifMissionGroupDetail`,`BifQuestCircle` " +
						"WHERE `BifMissionGroupDetail`.`EventID` = '" + r_eventid + "'" +
						"AND `BifMissionGroupDetail`.`TeamID` = '" + r_teamid + "'" +
						"AND `BifMissionGroupDetail`.`MissionGroupID` = '" + r_missiongroupid + "'" +
						"AND `BifMissionGroupDetail`.`EventID` = `BifQuestCircle`.`EventID` " +
						"AND `BifMissionGroupDetail`.`TeamID` = `BifQuestCircle`.`TeamID` " +
						"AND `BifMissionGroupDetail`.`TeamID` = `BifQuestCircle`.`TeamID` " +
						"AND `BifMissionGroupDetail`.`CircleID` = `BifQuestCircle`.`CircleID` " +
						"ORDER BY `BifMissionGroupDetail`.`Level`,`BifQuestCircle`.`CircleLocation`,`BifQuestCircle`.`CircleName`;" ;
		//console.log(queryStr);
		
		query.get(queryStr, function(result) {
			res.send(result);
		});
	}
	return routerhandle;
}