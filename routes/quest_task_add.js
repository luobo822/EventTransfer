module.exports = function(dquery) {
	var query = dquery;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_userposition = req.session.userconfig.eventselected.userposition ;
		var r_userid = req.user.userid ;
		var r_circleid = req.body.circleid ;
		var r_targetid = "";
		
		if ( req.body.targetid ) {
			if (r_userposition == 'Owner' )
			{
				r_targetid = req.body.targetid ;
				r_userid = r_targetid;
			} else {
				res.send("userposition ERROR!");
			}
		} else{
			r_targetid = r_userid;
		}
		
		var queryCheckStr = "	SELECT count(*) AS Num " + 
							"	FROM `BifQuestCircle` " + 
							"	WHERE `BifQuestCircle`.`EventID` = '" + r_eventid + "' " + 
							"	AND `BifQuestCircle`.`TeamID` = '" + r_teamid + "' " + 
							"	AND `BifQuestCircle`.`CircleID` = '" + r_circleid + "'; " ;
		queryCheckStr = queryCheckStr +"SELECT count(*) AS Num " + 
									"	FROM `BifQuestTask` " + 
									"	WHERE `BifQuestTask`.`EventID` = '" + r_eventid + "' " + 
									"	AND `BifQuestTask`.`TeamID` = '" + r_teamid + "' " + 
									"	AND `BifQuestTask`.`UserID` = '" + r_userid + "' " + 
									"	AND `BifQuestTask`.`CircleID` = '" + r_circleid + "'; " ;
		queryCheckStr = queryCheckStr +"SELECT count(*) AS Num " + 
									"	FROM `BifMember` " + 
									"	WHERE `BifMember`.`EventID` = '" + r_eventid + "' " + 
									"	AND `BifMember`.`TeamID` = '" + r_teamid + "' " +
									"	AND `BifMember`.`UserID` = '" + r_targetid + "'; " ;
		//console.log(queryCheckStr);
		
		var queryStr = " INSERT INTO `BifQuestTask` " + 
						" (`EventID`, " + 
						" 	`TeamID`, " + 
						" 	`UserID`, " + 
						" 	`CircleID`, " + 
						" 	`Level`, " + 
						" 	`Version`, " + 
						" 	`UpdateTime`, " + 
						" 	`CreateTime`) " + 
						" 	VALUES " + 
						" ('" + r_eventid + "', " + 
						" 	'" + r_teamid + "', " + 
						" 	'" + r_userid + "', " + 
						" 	'" + r_circleid + "', " + 
						" 	9, " + 
						" 	0, " + 
						" 	now(), " + 
						" 	now() ); " ;

		//console.log(queryStr);
		
		query.get(queryCheckStr, function(result) {
			if ( result[0][0].Num == 1 &&
					result[1][0].Num == 0 &&
					result[2][0].Num == 1 ) {
				// insert
				query.put(queryStr, function(result) {
					res.send("OK!");
				});
			} else {
 				res.send("ERROR!");
 			}
 		});
	}
	return routerhandle;
}