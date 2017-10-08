module.exports = function(dquery) {
	var query = dquery;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_userid = req.user.userid ;
		
		var queryStr =" SELECT `BifMember_View`.`EventID`, " + 
						" 	`BifMember_View`.`EventName`, " + 
						" 	`BifMember_View`.`TeamID`, " + 
						" 	`BifMember_View`.`TeamName`, " + 
						" 	`BifMember_View`.`GroupID`, " + 
						" 	`BifMember_View`.`GroupName`, " + 
						" 	`BifMember_View`.`UserID`, " + 
						" 	`BifMember_View`.`UserNickName` " + 
						" FROM `BifMember_View` " + 
						" WHERE `BifMember_View`.EventID = '" + r_eventid + "' " + 
						" AND `BifMember_View`.TeamID = '" + r_teamid + "' " + 
						" AND CONCAT(`BifMember_View`.EventID,`BifMember_View`.TeamID) IN ( " + 
						" 	SELECT CONCAT(`BifMember`.EventID,`BifMember`.TeamID) FROM `BifMember` " + 
						"     WHERE `BifMember`.UserID = '" + req.user.userid + "' " + 
						" ) " + 
						" AND `BifMember_View`.EventIsAlive = 'Y';";
		//console.log(queryStr);
		
		query.get(queryStr, function(result) {
			res.send(result);
		});
	}
	return routerhandle;
}