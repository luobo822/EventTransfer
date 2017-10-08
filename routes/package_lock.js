module.exports = function(world) {
	var query = world.query;
	var sqltls = world.sqltls;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_userid = req.user.userid ;
		var r_circleid = req.body.CircleID ;
		
		if(!sqltls.CircleID(r_circleid)){
			res.send("CircleID is error.");
		}
		var queryStr = " UPDATE `FifQuestCircle` SET `LockerID`= '" + r_userid + "' " +
						" WHERE `EventID` = '" + r_eventid + "' " +
						" AND`TeamID` = '" + r_teamid + "' "  +
						" AND `CircleID` = '" + r_circleid + "' " +
						" AND `LockerID` IS NULL; " ;

		//console.log(queryStr);
		query.get(queryStr, function(result) {
			res.send("Lock requested.");
		});
	}
	return routerhandle;
}