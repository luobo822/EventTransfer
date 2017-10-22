module.exports = function(world) {
	var query = world.query;
	var sqltls = world.sqltls;
	var insertMsg = world.insertMsg;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_userposition = req.session.userconfig.eventselected.userposition ;
		var r_userid = req.user.userid ;
		var r_usernickname = req.user.usernickname ;
		var r_circleid = req.body.CircleID ;
		
		if(!sqltls.CircleID(r_circleid)){
			res.send("CircleID is error.");
		}
		
		var levelstr = ";";
		if ( r_userposition != 'Owner' ) {
			levelstr = " AND `LockerID` IS ' + r_userid + '; " ;
		}
		var selectStr = " SELECT `FifQuestCircle`.`CircleLocation`, " +
						" `FifQuestCircle`.`CircleName` " +
						" FROM `nodejs`.`FifQuestCircle` " +
						" WHERE `EventID` = '" + r_eventid + "' " +
						" AND`TeamID` = '" + r_teamid + "' "  +
						" AND `CircleID` = '" + r_circleid + "'; " ;
		var queryStr = " UPDATE `FifQuestCircle` SET `LockerID`= NULL " +
						" WHERE `EventID` = '" + r_eventid + "' " +
						" AND`TeamID` = '" + r_teamid + "' "  +
						" AND `CircleID` = '" + r_circleid + "' " + levelstr;
		//console.log(queryStr);
		query.get(selectStr + queryStr, function(result) {
			var msg = r_usernickname +
			"解锁了[" + result[0][0].CircleLocation + " " + result[0][0].CircleName +
			"]的锁定状态";
			insertMsg(r_eventid, r_teamid, msg);
			res.send("Unock requested.");
		});
	}
	return routerhandle;
}