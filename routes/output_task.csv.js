module.exports = function(dquery) {
	var query = dquery;
	var routerhandle = function(req, res) {
		res.setHeader("Content-Type", "text/csv; charset=utf-8");
		var s_eventid = req.session.userconfig.eventselected.eventid ;
		var s_teamid = req.session.userconfig.eventselected.teamid ;
		
		var queryStrTask = " SELECT `FifQuestTask_View`.`EventID`, " + 
							"     `FifQuestTask_View`.`TeamID`, " + 
							"     `FifQuestTask_View`.`UserID`, " + 
							"     `FifQuestTask_View`.`UserNickName` AS TaskOwner, " + 
							"     `FifQuestTask_View`.`Level`, " + 
							"     `FifQuestTask_View`.`CircleID`, " + 
							"     `FifQuestTask_View`.`CircleLocation`, " + 
							"     `FifQuestTask_View`.`CircleName`, " + 
							"     `FifQuestTask_View`.`CircleWeb`, " + 
							"     `FifQuestTask_View`.`GoodsID`, " + 
							"     `FifQuestTask_View`.`GoodsName`, " + 
							"     `FifQuestTask_View`.`GoodsPrice`, " + 
							"     `FifQuestTask_View`.`RequesterID`, " + 
							"     `FifQuestTask_View`.`RequesterName` AS `UserNickName`, " + 
							"     `FifQuestTask_View`.`RequestNum` " + 
							" FROM `FifQuestTask_View` " + 
							" WHERE `FifQuestTask_View`.`EventID` = '" + s_eventid + "' " + 
							" AND `FifQuestTask_View`.`TeamID`= '" + s_teamid + "'; " ;
							
		var queryStrTeam = " SELECT `FifQuestMember`.`CircleID`, " + 
							"     `FifQuestMember`.`CircleLocation`, " + 
							"     `FifQuestMember`.`CircleName`, " + 
							"     `FifQuestMember`.`CircleWeb`, " + 
							"     `FifQuestMember`.`GoodsID`, " + 
							"     `FifQuestMember`.`GoodsName`, " + 
							"     `FifQuestMember`.`GoodsPrice`, " + 
							"     `FifQuestMember`.`RequesterID`, " + 
							"     `BifUser`.`UserNickName`, " + 
							"     `FifQuestMember`.`RequestNum` " + 
							" FROM `FifQuestMember` " + 
							" INNER JOIN `BifUser` " + 
							" ON `FifQuestMember`.`RequesterID` = `BifUser`.`UserID` " + 
							" WHERE `FifQuestMember`.`EventID` = '" + s_eventid + "' " + 
							" AND `FifQuestMember`.`TeamID` = '" + s_teamid + "' " + 
							" AND `FifQuestMember`.`CircleID` NOT IN ( " + 
							"     SELECT `FifQuestTask`.`CircleID` " + 
							"     FROM `FifQuestTask` " + 
							"     WHERE `FifQuestTask`.`EventID` = '" + s_eventid + "' " + 
							" 	AND `FifQuestTask`.`TeamID` = '" + s_teamid + "' " + 
							" 	GROUP BY `FifQuestTask`.`CircleID` " + 
							" ) " + 
							" ORDER BY `FifQuestMember`.`CircleID`, " + 
							"          `FifQuestMember`.`GoodsID`, " + 
							"          `FifQuestMember`.`RequesterID` ; " ;
		//console.log(queryStr);
		
		var print = function(resault) {
			var t_UserID = "";
			var t_CircleID = "";
			var t_GoodsID = "";
			var print = "";
			for (onerow in resault) {
				if( resault[onerow].UserID &&
					resault[onerow].UserID != t_UserID ) {
					print += "\n";
					print += "####,";
					print += resault[onerow].TaskOwner;
					print += ",####";
					
					t_CircleID = "";
					t_GoodsID = "";
					t_UserID = resault[onerow].UserID;
				}
				if( resault[onerow].CircleID != t_CircleID ) {
					print += "\n";
					
					print += resault[onerow].CircleLocation;
					print += ",";
					print += resault[onerow].CircleName;
					print += ",";
					print += resault[onerow].CircleWeb;
					print += ",";
					
					print += resault[onerow].GoodsName;
					print += ",";
					print += resault[onerow].GoodsPrice;
					print += ",";
					//Google Sheet Fuction Calc
					print += ",";
					
					print += resault[onerow].UserNickName;
					for ( var num = 0; num < (resault[onerow].RequestNum - 1) ; num++ ){
						print += "、";
						print += resault[onerow].UserNickName;
					}
					
					t_CircleID = resault[onerow].CircleID;
					t_GoodsID = resault[onerow].GoodsID;
				} else {
					if ( resault[onerow].GoodsID != t_GoodsID ) {
						print += ",";
						print += resault[onerow].GoodsName;
						print += ",";
						print += resault[onerow].GoodsPrice;
						print += ",";//Google Sheet Fuction Calc
						print += ",";
						print += resault[onerow].UserNickName;
						for ( var num = 0; num < (resault[onerow].RequestNum - 1) ; num++ ){
							print += "、";
							print += resault[onerow].UserNickName;
						}
						
						t_GoodsID = resault[onerow].GoodsID;
					} else {
						for ( var num = 0; num < (resault[onerow].RequestNum) ; num++ ){
							print += "、";
							print += resault[onerow].UserNickName;
						}
					}
				}
			
			}
			return print;
		}
		
		var queryStr = queryStrTask + queryStrTeam;
		var queryCallBack = function(resault) {
			var file = "";
			file += print(resault[0]);
			file += "\n";
			file += "####,";
			file += "混沌区";
			file += ",####";
			file += print(resault[1]);
			res.send(file);
		}
		query.get(queryStr, queryCallBack);
	}
	return routerhandle;
}