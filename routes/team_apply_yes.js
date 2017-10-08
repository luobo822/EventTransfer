module.exports = function(dquery) {
	var query = dquery;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_userposition = req.session.userconfig.eventselected.userposition ;
		
		var r_target_userid = req.body.target_userid ;
		
		var insertQueryStr = " INSERT INTO `BifMember` " + 
								" SELECT `BifTeamApply`.`EventID`, " + 
								"     `BifTeamApply`.`TeamID`, " + 
								"     '11' AS `GroupID`, " + 
								"     `BifTeamApply`.`UserID`, " + 
								"     'Member' AS `UserPosition` " + 
								" FROM `BifTeamApply` " + 
								" WHERE `BifTeamApply`.`UserID` = '" + r_target_userid + "' " + 
								" AND `BifTeamApply`.`EventID` = '" + r_eventid + "' " + 
								" AND `BifTeamApply`.`TeamID` = '" + r_teamid + "'; " ;
		var deleteQueryStr = " DELETE FROM `BifTeamApply` " + 
								" WHERE `BifTeamApply`.`UserID` = '" + r_target_userid + "' " + 
								" AND `BifTeamApply`.`EventID` = '" + r_eventid + "' " + 
								" AND `BifTeamApply`.`TeamID` = '" + r_teamid + "'; " ;
								
		var queryStr = insertQueryStr + deleteQueryStr;
		
		//console.log(queryStr);
		
		if(r_userposition == 'Owner'){
			query.put(queryStr, function(result) {
				res.send("OK");
			});
		}else{
			res.send("ERROR!");
		}
	}
	return routerhandle;
}