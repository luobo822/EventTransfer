module.exports = function(dquery) {
	var query = dquery;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_userposition = req.session.userconfig.eventselected.userposition ;
		var r_userid = req.user.userid ;
		
		var r_targetid = req.body.targetid ;
		var r_circleid = req.body.circleid ;
		var r_level = req.body.level ;
		
		if ( ( r_targetid != r_userid && r_userposition != 'Owner' ) ||
				r_level.match(/^[1-9]$/) == null ) {
			res.send("ERROR!");
		} else {
			var queryCheckStr = "SELECT count(*) AS Num " + 
							"	FROM `BifMember` " + 
							"	WHERE `BifMember`.`EventID` = '" + r_eventid + "' " + 
							"	AND `BifMember`.`TeamID` = '" + r_teamid + "' " +
							"	AND `BifMember`.`UserID` = '" + r_targetid + "'; " ;
			var queryStr = " UPDATE `BifQuestTask` " + 
							" SET `BifQuestTask`.`Level` = '" + r_level + "' " + 
							" WHERE `BifQuestTask`.`EventID` = '" + r_eventid + "' " + 
							" AND `BifQuestTask`.`TeamID` = '" + r_teamid + "' " + 
							" AND `BifQuestTask`.`UserID` = '" + r_targetid + "' " + 
							" AND `BifQuestTask`.`CircleID` = '" + r_circleid + "'; " ;
			//console.log(queryStr);
			
			query.get(queryCheckStr, function(result) {
				if ( result[0].Num == 1 ) {
					// do
					query.put(queryStr, function(result) {
						res.send(result);
					});
				} else {
 					res.send("ERROR!");
 				}
 			});
 			
		}
	}
	return routerhandle;
}