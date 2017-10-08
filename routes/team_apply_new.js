module.exports = function(dquery) {
	var query = dquery;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		var r_eventid = req.body.eventid ;
		var r_teamid = req.body.teamid ;
		var r_userid = req.user.userid ;
		
		var queryStr = " INSERT INTO `BifTeamApply` " + 
						" (`EventID`, " + 
						" `TeamID`, " + 
						" `UserID`, " + 
						" `ApproverID`, " + 
						" `Status`, " + 
						" `Version`, " + 
						" `UpdateTime`, " + 
						" `CreateTime`) " + 
						" SELECT * FROM ( " + 
						" SELECT '" + r_eventid + "' AS `EventID`, " + 
						" 	'" + r_teamid + "' AS `TeamID`, " + 
						" 	'" + r_userid + "' AS `UserID`, " + 
						" 	NULL AS `ApproverID`, " + 
						" 	'WA' AS `Status`, " + 
						" 	0 AS `Version`, " + 
						" 	now() AS `UpdateTime`, " + 
						" 	now() AS `CreateTime` ) AS TMP " + 
						" WHERE EXISTS ( " + 
						"  SELECT * " + 
						"  FROM `BifTeam` " + 
						"  WHERE `BifTeam`.`EventID` = '" + r_eventid + "' " + 
						"  AND `BifTeam`.`TeamID` = '" + r_teamid + "' " + 
						" ) " + 
						" AND NOT EXISTS ( " + 
						"  SELECT * " + 
						"  FROM `BifMember` " + 
						"  WHERE `BifMember`.`EventID` = '" + r_eventid + "' " + 
						"  AND `BifMember`.`TeamID` = '" + r_teamid + "' " + 
						"  AND `BifMember`.`UserID` = '" + r_userid + "' " + 
						" ) " + 
						" AND NOT EXISTS ( " + 
						"  SELECT * " + 
						"  FROM `BifTeamApply` " + 
						"  WHERE `BifTeamApply`.`EventID` = '" + r_eventid + "' " + 
						"  AND `BifTeamApply`.`TeamID` = '" + r_teamid + "' " + 
						"  AND `BifTeamApply`.`UserID` = '" + r_userid + "' " + 
						" ); " ;
		//console.log(queryStr);
		
		query.put(queryStr, function(result) {
			res.send("END");
		});
	}
	return routerhandle;
}