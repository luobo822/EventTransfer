module.exports = function(dquery) {
	var query = dquery;
	var routerhandle = function(req, res) {
		res.setHeader("Content-Type", "text/html; charset=utf-8");
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_userid = req.user.userid ;
		
		var queryStr0 = " SELECT `BifQuestTask`.`EventID`, " + 
						"     `BifQuestTask`.`TeamID`, " + 
						"     `BifUser`.`UserNickName`, " + 
						"     `BifQuestTask`.`UserID`, " + 
						"     `BifQuestTask`.`CircleID`, " + 
						"     `BifQuestTask`.`Level` " + 
						" FROM `BifQuestTask`,`BifUser` " + 
						" WHERE `BifQuestTask`.`EventID` = '" + r_eventid + "' " + 
						" AND `BifQuestTask`.`TeamID` = '" + r_teamid + "' " + 
						" AND `BifQuestTask`.`UserID` = `BifUser`.`UserID` " + 
						" ORDER BY " + 
						" `BifQuestTask`.`EventID`, " + 
						" `BifQuestTask`.`TeamID`, " + 
						" `BifQuestTask`.`UserID`, " + 
						" `BifQuestTask`.`Level`; " ;
		var queryStr1 = " SELECT `BifQuest_View`.`EventID`, " + 
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
					" AND EXISTS " + 
					" (SELECT * FROM `BifQuestTask` " + 
					" WHERE `BifQuestTask`.`EventID` = `BifQuest_View`.`EventID` " + 
					" AND `BifQuestTask`.`TeamID` = `BifQuest_View`.`TeamID` " + 
					" AND `BifQuestTask`.`CircleID` = `BifQuest_View`.`CircleID`) " + 
					" ORDER BY `BifQuest_View`.`EventID`, " + 
					" 		`BifQuest_View`.`CircleID`, " + 
					"         `BifQuest_View`.`GoodsID`, " + 
					"         `BifQuest_View`.`RequesterID`;"
		var queryStr2 = " SELECT `BifQuest_View`.`EventID`, " + 
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
					" AND NOT EXISTS " + 
					" (SELECT * FROM `BifQuestTask` " + 
					" WHERE `BifQuestTask`.`EventID` = `BifQuest_View`.`EventID` " + 
					" AND `BifQuestTask`.`TeamID` = `BifQuest_View`.`TeamID` " + 
					" AND `BifQuestTask`.`CircleID` = `BifQuest_View`.`CircleID`) " + 
					" ORDER BY `BifQuest_View`.`EventID`, " + 
					" 		`BifQuest_View`.`CircleID`, " + 
					"         `BifQuest_View`.`GoodsID`, " + 
					"         `BifQuest_View`.`RequesterID`;"
		
		var queryCallBack = function(resultALL) {
			//console.log("[team_quest_file] SQL result:" + resultALL);
			
			var printStr = ""
			
			var resultTask = resultALL[0];
			var resultTaskM = resultALL[1];
			
			var scanData = function(data,cID){
				var resault = {
					index  : 0,
					count : 0
				};
				var address = "";
				var sFlag = true;
				
				var CircleID = cID;
				var GoodsID = "";
				for (var one in data){
					if (data[one].CircleID == CircleID && sFlag == true) {
						sFlag = false;
						resault.index = one;
						resault.count++;
					} else if (data[one].CircleID == CircleID && sFlag == false) {
						if ( data[one].GoodsID != GoodsID ) {
							resault.count++;
						}
					} else if (!sFlag) {
						break;
					}
				}
				return resault;
			}
			
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
			
			
			var UserID = "";
			for (var one in resultTask) {
				if ( resultTask[one].UserID != UserID ) {
					UserID = resultTask[one].UserID;
					printStr += '</font><br><br><font size="6" color ="green">#####' + resultTask[one].UserNickName + '#####</font>';
				}
				
				var CircleID = resultTask[one].CircleID;
				var scan = scanData(resultTaskM,CircleID);
				
				var sIndex = scan.index;
				var sCount = scan.count;
				printStr += '</font><br><br><font size="5" color ="red">' + resultTaskM[sIndex].CircleLocation + '   ' + resultTaskM[sIndex].CircleName + '</font>';
				printStr += '<br><font size="4" color ="blue"><a href="' + resultTaskM[sIndex].CircleWeb + '" target="_blank">' + resultTaskM[sIndex].CircleWeb + '</a></font>';
				
				var rCount = 0;
				var GoodsID = "";
				for (var one = 0; one < sCount ; one++) {
					if ( resultTaskM[sIndex].GoodsID != GoodsID ) {
						GoodsID = resultTaskM[sIndex].GoodsID;
						rCount = scanReq(resultTaskM,resultTaskM[sIndex].CircleID,resultTaskM[sIndex].GoodsID);
						
						printStr += '<br><font size="4" color ="blue">' + resultTaskM[sIndex].GoodsName + '    ' + resultTaskM[sIndex].GoodsPrice + '    ';
						printStr += ' x' + rCount + ' ';
						printStr += '(' + resultTaskM[sIndex].UserNickName;
						
						for( var c=1; c < resultTaskM[sIndex].RequestNum; c++ ){
							printStr += ',' + resultTaskM[sIndex].UserNickName;
						}
						
						rCount--;
					} else {
						for( var c=0; c < resultTaskM[sIndex].RequestNum; c++ ){
							printStr += ',' + resultTaskM[sIndex].UserNickName;
						}
						rCount--;
					}
					if (rCount == 0){
						printStr += ')</font>';
					}
					sIndex++;
				}
			}
			
			result = resultALL[2];
			var CircleID = "";
			GoodsID = "";
			var UserNickName = "";
			
			
			printStr += '</font><br><br><font size="6" color ="green">####混沌区・その他####</font>';
			var rCount = 0;
			for (var x in result) {
				if ( result[x].CircleID != CircleID ) {
					CircleID = result[x].CircleID;
					printStr += '</font><br><br><font size="5" color ="red">' + result[x].CircleLocation + '   ' + result[x].CircleName + '</font>';
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
					rCount--;
				} else if ( result[x].GoodsID != GoodsID ) {
					GoodsID = result[x].GoodsID;
					rCount = scanReq(result,result[x].CircleID,result[x].GoodsID);
					printStr += '<br>' + result[x].GoodsName + '    ' + result[x].GoodsPrice + '    ';
					printStr += ' x' + rCount + ' ';
					printStr += '(' + result[x].UserNickName;
					if ( result[x].RequestNum > 1 ) {
						for( var c=1; c < result[x].RequestNum; c++ ){
							printStr += ',' + result[x].UserNickName;
						}
					}
					rCount--;
				} else {
					for( var c=0; c < result[x].RequestNum; c++ ){
						printStr += ',' + result[x].UserNickName;
					}
					rCount--;
				}
				if (rCount == 0){
					printStr += ')';
				}
			}
			printStr = printStr + "</font>";
			res.send(printStr);
		}
		//console.log("[team_quest_file] SQL:" + queryStr0 + queryStr1 + queryStr2);
		query.get(queryStr0 + queryStr1 + queryStr2, queryCallBack);
	}
	return routerhandle;
}