module.exports = function(dquery) {
	var query = dquery;
	var routerhandle = function(req, res) {
		var r_eventid = req.body.eventid ;
		var r_teamid = req.body.teamid ;
		var r_userid = req.user.userid ;
		
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		
		var queryStr = 	" SELECT `BifMember_View`.`EventID`, " + 
						"     `BifMember_View`.`TeamID`, " + 
						"     `BifMember_View`.`GroupID`, " + 
						"     `BifMember_View`.`UserID`, " + 
						"     `BifMember_View`.`UserPosition` " + 
						" FROM `BifMember_View` " + 
						" WHERE `BifMember_View`.`EventID` = '" + r_eventid + "'" + 
						" AND `BifMember_View`.`TeamID` = '" + r_teamid + "'" + 
						" AND   `BifMember_View`.`UserID` = '" + r_userid + "' ;" ;
		var queryQuestLock = 	" SELECT `BifTeam`.`EventID`, " + 
							"     `BifTeam`.`QuestLock` " + 
							" FROM `BifTeam` " + 
							" WHERE `BifTeam`.`EventID` = '" + r_eventid + "'" + 
							" AND `BifTeam`.`TeamID` = '" + r_teamid + "' ;" ;
		//console.log(queryStr);

		var queryCallBack = function(resault) {
			if ( resault[0][0] ) {
				if ( resault[1][0].QuestLock == 'Y' &&
					resault[0][0].UserPosition != 'Owner'  )
				{
					res.send("Input is locked by admin.");
				} else {
					req.session.userconfig.eventselected.eventid = resault[0][0].EventID;
					req.session.userconfig.eventselected.teamid = resault[0][0].TeamID;
					req.session.userconfig.eventselected.groupid = resault[0][0].GroupID;
					req.session.userconfig.eventselected.userposition = resault[0][0].UserPosition;
					
					res.send("OK");
				} 
			} else {
				res.send("failed");
			}
		}
		query.get(queryStr + queryQuestLock, queryCallBack);
	}
	return routerhandle;
}