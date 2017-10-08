module.exports = function(world) {
	var query = world.query;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_userid = req.user.userid ;
		var r_targetid = req.body.targetid ;
		
		var queryStr = " SELECT `FifQuestCircle`.`CircleID`," +
					" `FifQuestCircle`.`CircleLocation`, " +
					" `FifQuestCircle`.`CircleName` " +
					" FROM `FifQuestCircle` " +
					" WHERE `FifQuestCircle`.`EventID` = '" + r_eventid + "' " +
					" AND `FifQuestCircle`.`TeamID`= '" + r_teamid + "' " +
					" AND `FifQuestCircle`.`CircleStatus` IN ('ST','ON')" +
					" AND `FifQuestCircle`.`CircleLocation` LIKE" +
					" 	(SELECT" +
					" 		concat(left(`FifTransferLog`.`CircleLocation`,2) ,'%')" +
					" 	FROM `FifTransferLog` " +
					" 	WHERE `FifTransferLog`.`EventID` = '" + r_eventid + "' " +
					" 	AND `FifTransferLog`.`TeamID`= '" + r_teamid + "' " +
					" 	AND `FifTransferLog`.`UserID`= '" + r_userid + "' " +
					" 	AND `FifTransferLog`.`DeleteFlag` = 'N' " +
					" 	AND `FifTransferLog`.`Status` in ('WA','FI','FR')  " +
					" 	GROUP BY `FifTransferLog`.`CircleID`" +
					" 	ORDER BY `FifTransferLog`.`MessageNo` DESC" +
					" 	LIMIT 1)" +
					" LIMIT 5;" ;
		//console.log(queryStr);
		
		query.get(queryStr, function(result) {
			res.send(result);
		});
	}
	return routerhandle;
}