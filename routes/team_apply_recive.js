module.exports = function(dquery) {
	var query = dquery;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_userid = req.user.userid ;
		
		var queryStr = " SELECT `BifTeamApply`.`EventID`, " + 
						"     `BifTeamApply`.`TeamID`, " + 
						"     `BifTeamApply`.`ApproverID`, " + 
						"     approver.`UserNickName` AS ApproverNickName, " + 
						"     `BifTeamApply`.`UserID`, " + 
						"     user.`UserNickName`, " + 
						"     `BifTeamApply`.`Status`, " + 
						"     `BifTeamApply`.`Version`, " + 
						"     `BifTeamApply`.`UpdateTime`, " + 
						"     `BifTeamApply`.`CreateTime` " + 
						" FROM `BifTeamApply` " + 
						" LEFT JOIN `BifUser` approver " + 
						" ON `BifTeamApply`.`ApproverID` = approver.`UserID` " + 
						" INNER JOIN `BifUser` user " + 
						" ON `BifTeamApply`.`UserID` = user.`UserID` " + 
						" WHERE `BifTeamApply`.`EventID` = '" + r_eventid + "' " + 
						" AND `BifTeamApply`.`TeamID` = '" + r_teamid + "' " + 
						" AND `BifTeamApply`.`Status` = 'WA'; " ;
		//console.log(queryStr);
		
		query.get(queryStr, function(result) {
			res.send(result);
		});
	}
	return routerhandle;
}