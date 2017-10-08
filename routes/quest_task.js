module.exports = function(dquery) {
	var query = dquery;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_userid = req.user.userid ;
		var r_targetid = req.body.targetid ;
		
		var queryStr = " SELECT `BifQuestTask`.`EventID`, " + 
							" 	`BifQuestTask`.`TeamID`, " + 
							" 	`BifQuestTask`.`UserID`, " + 
							" 	`BifQuestTask`.`CircleID`, " + 
							" 	`BifQuestCircle`.`CircleLocation`, " + 
							" 	`BifQuestCircle`.`CircleName`, " + 
							" 	`BifQuestTask`.`Level`, " + 
							" 	`BifQuestTask`.`Version`, " + 
							" 	`BifQuestTask`.`UpdateTime`, " + 
							" 	`BifQuestTask`.`CreateTime` " + 
							" FROM `BifQuestTask` " + 
							" INNER JOIN `BifQuestCircle` " + 
							" ON ( " + 
							" 	`BifQuestTask`.`EventID` = `BifQuestCircle`.`EventID` " + 
							" 	AND `BifQuestTask`.`TeamID` = `BifQuestCircle`.`TeamID` " + 
							" 	AND `BifQuestTask`.`CircleID` = `BifQuestCircle`.`CircleID` " + 
							" ) " + 
							" WHERE `BifQuestTask`.`EventID` = '" + r_eventid + "' " + 
							" AND `BifQuestTask`.`TeamID` = '" + r_teamid + "' " + 
							" AND '" + r_targetid + "' in ( " + 
							" 	SELECT `BifMember`.`UserID` " + 
							" 	FROM `BifMember` " + 
							" 	WHERE `BifMember`.`EventID` = '" + r_eventid + "' " + 
							" 	AND `BifMember`.`TeamID` = '" + r_teamid + "' " + 
							" ) " + 
							" AND `BifQuestTask`.`UserID` = '" + r_targetid + "' " + 
							" ORDER BY `BifQuestTask`.`EventID`, " + 
							" 	`BifQuestTask`.`TeamID`, " + 
							" 	`BifQuestTask`.`UserID`, " + 
							" 	`BifQuestTask`.`Level`, " + 
							" 	`BifQuestTask`.`CircleID`; " ;
		//console.log(queryStr);
		
		query.get(queryStr, function(result) {
			res.send(result);
		});
	}
	return routerhandle;
}