module.exports = function(dquery) {
	var query = dquery;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		var r_userid = req.user.userid ;
		
		var queryStr = " SELECT `BifTeamApply`.`EventID`, " + 
						"     `BifTeamApply`.`TeamID`, " + 
						"     `BifTeamApply`.`ApproverID`, " + 
						"     `BifTeamApply`.`UserID`, " + 
						"     `BifTeamApply`.`Status`, " + 
						"     `BifTeamApply`.`Version`, " + 
						"     `BifTeamApply`.`UpdateTime`, " + 
						"     `BifTeamApply`.`CreateTime` " + 
						" FROM `BifTeamApply` " + 
						" WHERE `BifTeamApply`.`UserID` = '" + r_userid + "' " + 
						" AND `BifTeamApply`.`Status` = 'WA'; " ;
		//console.log(queryStr);
		
		query.get(queryStr, function(result) {
			res.send(result);
		});
	}
	return routerhandle;
}