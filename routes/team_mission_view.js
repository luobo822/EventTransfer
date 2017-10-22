module.exports = function(world) {
	var query = world.query;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		
		var queryStr = "SELECT `BifMissionGroup`.`MissionGroupID`," +
					"    `BifMissionGroup`.`MissionGroupName`," +
					"    `BifMissionGroup`.`MissionGroupType`," +
					"     (SELECT `BifUser`.`UserNickName`" +
					"     FROM `BifUser`" +
					"     WHERE `BifUser`.`UserID` = `BifMissionGroup`.`UserID`) AS Editor," +
					"    `BifMissionGroup`.`Version`," +
					"    `BifMissionGroup`.`UpdateTime`," +
					"    `BifMissionGroup`.`CreateTime`" +
					"FROM `BifMissionGroup`" +
					"WHERE `BifMissionGroup`.`EventID` = '" + r_eventid + "' " + 
					"AND `BifMissionGroup`.`TeamID` = '" + r_teamid + "' " +
					"ORDER BY `BifMissionGroup`.`MissionGroupName`;" ;
		//console.log(queryStr);
		
		query.get(queryStr, function(result) {
			res.send(result);
		});
	}
	return routerhandle;
}