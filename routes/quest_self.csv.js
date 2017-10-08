module.exports = function(dquery) {
	var query = dquery;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'text/csv; charset=utf-8');
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_userid = req.user.userid ;
		var r_circleid = req.body.circleid ;
		
		var queryStr = " SELECT `BifQuest_View`.`EventID`, " + 
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
		
		query.get(queryStr, function(result) {
			var print = "CircleLocation,CircleName,CircleWeb,GoodsName,GoodsPrice,RequestNum\n";
			for (onerow in result) {
				print += result[onerow].CircleLocation;
				print += ",";
				print += result[onerow].CircleName;
				print += ",";
				print += result[onerow].CircleWeb;
				print += ",";
				print += result[onerow].GoodsName;
				print += ",";
				print += result[onerow].GoodsPrice;
				print += ",";
				print += result[onerow].RequestNum;
				print += "\n";
			}
			res.send(print);
		});
	}
	return routerhandle;
}