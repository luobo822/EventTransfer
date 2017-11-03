module.exports = function(world) {
	var query = world.query;
	var sqltls = world.sqltls;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_missiongroupid = req.body.missiongroupid ;
		var r_detailid = req.body.detailid ;
		
		
		if(!sqltls.isPInt(r_missiongroupid)){
			res.send("err!");
		}
		
		if(!sqltls.isPInt(r_detailid)){
			res.send("err!");
		}
		
		var queryStr = " DELETE FROM `BifMissionGroupDetail` " + 
						" WHERE `BifMissionGroupDetail`.`EventID` = '" + r_eventid + "' " + 
						" AND `BifMissionGroupDetail`.`TeamID` = '" + r_teamid + "' " +
						" AND `BifMissionGroupDetail`.`MissionGroupID` = '" + r_missiongroupid + "' " +
						" AND `BifMissionGroupDetail`.`DetailID` = '" + r_detailid + "'; " ;
		//console.log(queryStr);
		
		query.put(queryStr, function(result) {
			res.send("END.");
		});
	}
	return routerhandle;
}