module.exports = function(dquery) {
	var query = dquery;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_userposition = req.session.userconfig.eventselected.userposition ;
		
		var queryStr = " DELETE `BifTeam`, " + 
						" 	`BifGroup`, " + 
						" 	`BifMember` " + 
						" FROM `BifTeam` LEFT JOIN `BifGroup` " + 
						" ON( " + 
						" 	`BifTeam`.`EventID` = `BifGroup`.`EventID` " + 
						" 	AND `BifTeam`.`TeamID` = `BifGroup`.`TeamID` " + 
						" ) " + 
						" LEFT JOIN `BifMember` " + 
						" ON( " + 
						" 	`BifTeam`.`EventID` = `BifMember`.`EventID` " + 
						" 	AND `BifTeam`.`TeamID` = `BifMember`.`TeamID` " + 
						" ) " + 
						" WHERE `BifTeam`.`EventID` = '" + r_eventid + "' " + 
						" AND `BifTeam`.`TeamID` = '" + r_teamid + "'; " ;
		//console.log(queryStr);
		
		if(r_userposition == 'Owner'){
			query.get(queryStr, function(result) {
				req.session.userconfig.eventselected = {
					eventid  : null ,
					teamid   : null ,
					groupid  : null ,
					userposition  : null
				};
				res.send("OK");
			});
		}else{
			res.send("ERROR!");
		}
	}
	return routerhandle;
}