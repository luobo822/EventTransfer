module.exports = function(world) {
	var query = world.query;
	var sqltls = world.sqltls;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_userid = req.user.userid ;
		var r_missiongroupname = req.body.missiongroupname;
		var r_missiongrouptype = req.body.missiongrouptype;
		
		if(!sqltls.isStr(r_missiongroupname) || !sqltls.isStr(r_missiongrouptype)){
			res.send("ERROR!CHECK YOU INPUT");
		}
		
		var queryStr = " INSERT INTO `BifMissionGroup` " + 
						" (`EventID`, " + 
						" `TeamID`, " + 
						" `MissionGroupID`, " + 
						" `MissionGroupName`, " + 
						" `MissionGroupType`, " + 
						" `UserID`, " + 
						" `Version`, " + 
						" `UpdateTime`, " + 
						" `CreateTime`) " + 
						" VALUES " + 
						" ('" + r_eventid + "', " + 
						" '" + r_teamid + "', " + 
						" (SELECT MissionGroupID FROM " + 
						" (SELECT " + 
						" IFNULL(max(`BifMissionGroup`.`MissionGroupID`) + 1,'100') AS MissionGroupID" + 
						" FROM `BifMissionGroup`" + 
						" WHERE `BifMissionGroup`.`EventID` = '" + r_eventid + "' " + 
						" AND `BifMissionGroup`.`TeamID` = '" + r_teamid + "') AS TMP)," + 
						" '" + r_missiongroupname + "', " + 
						" '" + r_missiongrouptype + "', " + 
						" '" + r_userid + "', " + 
						" 0, " + 
						" now(), " + 
						" now() ); " ;
		//console.log(queryStr);
		query.put(queryStr, function(result) {
			res.send("OK!");
		});
	}
	return routerhandle;
}