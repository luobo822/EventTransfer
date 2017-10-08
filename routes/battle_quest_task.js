module.exports = function(dquery) {
	var query = dquery;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_userid = req.user.userid ;
		
		var queryStr = " SELECT `FifQuestTask`.`EventID`, " + 
							" 	`FifQuestTask`.`TeamID`, " + 
							" 	`FifQuestTask`.`UserID`, " + 
							" 	`FifQuestTask`.`CircleID`, " + 
							" 	`FifQuestCircle`.`CircleLocation`, " + 
							" 	`FifQuestCircle`.`CircleName`, " + 
							" 	`FifQuestTask`.`Level`, " + 
							" 	`FifQuestTask`.`Version`, " + 
							" 	`FifQuestTask`.`UpdateTime`, " + 
							" 	`FifQuestTask`.`CreateTime` " + 
							" FROM `FifQuestTask` " + 
							" INNER JOIN `FifQuestCircle` " + 
							" ON ( " + 
							" 	`FifQuestTask`.`EventID` = `FifQuestCircle`.`EventID` " + 
							" 	AND `FifQuestTask`.`TeamID` = `FifQuestCircle`.`TeamID` " + 
							" 	AND `FifQuestTask`.`CircleID` = `FifQuestCircle`.`CircleID` " + 
							" ) " + 
							" WHERE `FifQuestTask`.`EventID` = '" + r_eventid + "' " + 
							" AND `FifQuestTask`.`TeamID` = '" + r_teamid + "' " + 
							" AND `FifQuestTask`.`UserID` = '" + r_userid + "' " + 
							" AND `FifQuestCircle`.`CircleStatus` in ('ST','ON') " + 
							" ORDER BY `FifQuestTask`.`EventID`, " + 
							" 	`FifQuestTask`.`TeamID`, " + 
							" 	`FifQuestTask`.`UserID`, " + 
							" 	`FifQuestTask`.`Level`, " + 
							" 	`FifQuestTask`.`CircleID`; " ;
		//console.log(queryStr);
		
		query.get(queryStr, function(result) {
			res.send(result);
		});
	}
	return routerhandle;
}