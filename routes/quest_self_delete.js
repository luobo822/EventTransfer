module.exports = function(world) {
	var query = world.query;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_userid = req.user.userid ;
		
		var queryStr = " DELETE FROM `BifQuestMember` " + 
						" WHERE `BifQuestMember`.`EventID` = '" + r_eventid + "' " + 
						" AND `BifQuestMember`.`TeamID` = '" + r_teamid + "' " + 
						" AND `BifQuestMember`.`RequesterID` = '" + r_userid + "'; " ;
		
		//console.log(queryStr);
		query.get(queryStr, function(result) {
			res.send("All has been deleted.");
		});
	}
	return routerhandle;
}