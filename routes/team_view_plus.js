module.exports = function(dquery) {
	var query = dquery;
	var routerhandle = function(req, res) {
		var queryStr = " SELECT `BifMember_View`.`EventID`, " + 
					" 	`BifMember_View`.`EventName`, " + 
					" 	`BifEvent`.`EventOpenTime`, " + 
					" 	`BifEvent`.`EventCloseTime`, " + 
					" 	`BifEvent`.`EventLocation`, " + 
					" 	`BifEvent`.`EventIsAlive`, " + 
					" 	`BifMember_View`.`TeamID`, " + 
					" 	`BifMember_View`.`TeamName`, " + 
					" 	`BifMember_View`.`GroupID`, " + 
					" 	`BifMember_View`.`GroupName`, " + 
					" 	`BifMember_View`.`UserID` " + 
					" FROM `BifMember_View`,`BifEvent` " + 
					" WHERE `BifMember_View`.`UserID` = '" + req.user.userid + "' " + 
					" AND `BifMember_View`.`EventID` = `BifEvent`.`EventID` " + 
					" AND `BifMember_View`.`EventIsAlive` = 'Y'; " ;
		//console.log(queryStr);
		res.setHeader('Content-Type', 'application/json');
		var queryCallBack = function(resault) {
			//console.log("SQL result:" + resault);
			res.send(resault);
		}
		query.get(queryStr, queryCallBack);
	}
	return routerhandle;
}