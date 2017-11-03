module.exports = function(world) {
	var query = world.query;
	var sqltls = world.sqltls;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_circleidlist = req.body.circleidlist;
		
		console.log(JSON.stringify(r_circleidlist));
		var valueStr = " INSERT INTO `BifMissionGroupDetail` " + 
				" (`EventID`, " + 
				" `TeamID`, " + 
				" `MissionGroupID`, " + 
				" `DetailID`, " + 
				" `CircleID`, " + 
				" `Level`, " + 
				" `Version`, " + 
				" `UpdateTime`, " + 
				" `CreateTime`) " + 
				" VALUES "
		if(r_circleidlist.length>0){
			for (var i = 0; i < r_circleidlist.length; i++) {
				if(!sqltls.isStr(r_circleidlist[i].missiongroupid)){
					res.send("ERROR!CHECK YOU INPUT");
				}
				if(!sqltls.isCircleID(r_circleidlist[i].circleid)){
					res.send("ERROR!CHECK YOU INPUT");
				}
				valueStr = valueStr + 
						" ('" + r_eventid + "', " + 
						" '" + r_teamid + "', " + 
						" '" + r_circleidlist[i].missiongroupid + "', " + 
						" (SELECT DetailID FROM " + 
						" (SELECT " + 
						" IFNULL(max(`BifMissionGroupDetail`.`DetailID`) + 1,'100') AS DetailID" + 
						" FROM `BifMissionGroupDetail`" + 
						" WHERE `BifMissionGroupDetail`.`EventID` = '" + r_eventid + "' " + 
						" AND `BifMissionGroupDetail`.`TeamID` = '" + r_teamid + "') AS TMP)," + 
						" '" + r_circleidlist[i].circleid + "', " + 
						" '99', " + 
						" 0, " + 
						" now(), " + 
						" now() ),";
			}
			valueStr = valueStr.replace(/.$/, ";");
			
			console.log(valueStr);
			query.put(valueStr, function(result) {
				res.send("OK!");
			});
		}
		
	}
	return routerhandle;
}