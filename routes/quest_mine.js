module.exports = function(dquery) {
	var query = dquery;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_userid = req.user.userid ;
		var r_circleid = req.body.circleid ;
		
		var queryMoneyStr = " SELECT " + 
							" sum((`BifQuest_View`.`GoodsPrice`)*(`BifQuest_View`.`RequestNum`)) " + 
							"   AS TotalMoney " + 
							" FROM `BifQuest_View` " + 
							" WHERE `BifQuest_View`.`EventID` = '" + r_eventid + "' " + 
							" AND `BifQuest_View`.`TeamID` = '" + r_teamid + "' " + 
							" AND `BifQuest_View`.`RequesterID` = '" + r_userid + "' " + 
							" GROUP BY `BifQuest_View`.`RequesterID`; " ;
		//console.log(queryStr);
		var queryGoodsStr = " SELECT `BifQuest_View`.`EventID`, " + 
						"     `BifQuest_View`.`TeamID`, " + 
						"     `BifQuest_View`.`CircleID`, " + 
						"     `BifQuest_View`.`CircleLocation`, " + 
						"     `BifQuest_View`.`CircleName`, " + 
						"     `BifQuest_View`.`CircleWeb`, " + 
						"     `BifQuest_View`.`GoodsID`, " + 
						"     `BifQuest_View`.`GoodsName`, " + 
						"     `BifQuest_View`.`GoodsPrice`, " + 
						"     `BifQuest_View`.`RequesterID`, " + 
						"     `BifQuest_View`.`RequestNum` " + 
						" FROM `BifQuest_View` " + 
						" WHERE `BifQuest_View`.`EventID` = '" + r_eventid + "' " + 
						" AND `BifQuest_View`.`TeamID` = '" + r_teamid + "' " + 
						" AND `BifQuest_View`.`RequesterID` = '" + r_userid + "'; " ;
		//console.log(queryStr);
		var queryStr = queryMoneyStr + queryGoodsStr;
		
		query.get(queryStr, function(result) {
			res.send(result);
		});
	}
	return routerhandle;
}