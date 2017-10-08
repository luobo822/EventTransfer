module.exports = function(dquery) {
	var query = dquery;
	var routerhandle = function(req, res) {
		res.setHeader("Content-Type", "text/html; charset=utf-8");
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
					"     `BifQuest_View`.`RequestNum`, " + 
					"     `BifUser`.`UserNickName` " + 
					" FROM `BifQuest_View`,`BifUser` " +		
					" WHERE `BifQuest_View`.`EventID` = '" + r_eventid + "'" +
					" AND `BifQuest_View`.`TeamID` = '" + r_teamid + "'" +
					" AND `BifQuest_View`.`RequesterID` = `BifUser`.`UserID` " + 
					" ORDER BY `BifQuest_View`.`EventID`, " + 
					" 		`BifQuest_View`.`CircleID`, " + 
					"         `BifQuest_View`.`GoodsID`, " + 
					"         `BifQuest_View`.`RequesterID`;"
		//console.log(queryStr);
		
		var scanReq = function(data,cID,gID){
			var count = 0;
			var sFlag = true;
			
			var CircleID = cID;
			var GoodsID = gID;
			for (var one in data){
				if (data[one].CircleID == CircleID && data[one].GoodsID == GoodsID) {
					sFlag = false;
					count++;
				} else if (!sFlag) {
					break;
				}
			}
			return count;
		}
			
		var queryCallBack = function(result) {
			//console.log("[team_quest_file] SQL:" + result);
			var CircleID = "";
			var GoodsID = "";
			var UserNickName = "";
			var printStr = ""
			var rCount = 0;
			for (var x in result) {
				if ( result[x].CircleID != CircleID ) {
					CircleID = result[x].CircleID;
					printStr += ')</font><br><br><font size="5" color ="red">' + result[x].CircleLocation + '   ' + result[x].CircleName + '</font>';
					printStr += '<br><font size="4" color ="blue"><a href="' + result[x].CircleWeb + '" target="_blank">' + result[x].CircleWeb + '</a></font>';
					GoodsID = result[x].GoodsID;
					rCount = scanReq(result,result[x].CircleID,result[x].GoodsID);
					printStr += '<br><font size="4" color ="blue">' + result[x].GoodsName + '    ' + result[x].GoodsPrice + '    ';
					printStr += ' x' + rCount + ' ';
					printStr += "(" + result[x].UserNickName;
					if ( result[x].RequestNum > 1 ) {
						for( var c=1; c < result[x].RequestNum; c++ ){
							printStr += ',' + result[x].UserNickName;
						}
					}
				} else if ( result[x].GoodsID != GoodsID ) {
					GoodsID = result[x].GoodsID;
					rCount = scanReq(result,result[x].CircleID,result[x].GoodsID);
					printStr += ')<br>' + result[x].GoodsName + '    ' + result[x].GoodsPrice + '    ';
					printStr += ' x' + rCount + ' ';
					printStr += '(' + result[x].UserNickName;
					if ( result[x].RequestNum > 1 ) {
						for( var c=1; c < result[x].RequestNum; c++ ){
							printStr += ',' + result[x].UserNickName;
						}
					}
				} else {
					for( var c=0; c < result[x].RequestNum; c++ ){
						printStr += ',' + result[x].UserNickName;
					}
				}
			}
			printStr = printStr.replace(/^\)<\/font>/, "");
			printStr = printStr + ")";
			res.send(printStr);
		}
		query.get(queryStr, queryCallBack);
	}
	return routerhandle;
}