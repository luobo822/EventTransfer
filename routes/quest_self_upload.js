module.exports = function(world) {
	var query = world.query;
	var sqltls = world.sqltls;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_userid = req.user.userid ;
		var r_data = req.body.Data ;
		
		var readline = require('readline');
		var csv = require('csv');
		var parser = csv.parse({columns : true});
		var stream = require("stream");
		var sstream = new stream.PassThrough()
		
		
		if ( r_eventid == null 
			|| r_teamid == null
			|| r_userid == null
			|| r_data == "")
		{
			res.send("Error.");
			return;
		}
		
		try {
			sstream.push("CircleLocation,CircleName,CircleWeb,GoodsName,GoodsPrice,RequestNum\n");
			sstream.push(r_data);
			sstream.push(null);
			sstream.pipe(parser);
			
			var insertStr = " INSERT INTO `BifQuestMemberIF` " +
							" (`IFType`, " +
							" `EventID`, " +
							" `TeamID`, " +
							" `GroupID`, " +
							" `TempCircleID`, " +
							" `CircleLocation`, " +
							" `CircleName`, " +
							" `CircleWeb`, " +
							" `TempGoodsID`, " +
							" `GoodsName`, " +
							" `GoodsPrice`, " +
							" `RequesterID`, " +
							" `RequestNum`, " +
							" `Version`, " +
							" `UpdateTime`, " +
							" `CreateTime`) " +
							" VALUES ";
			var defStr = insertStr;
			
			parser.on('readable', function(){
				var data;
				while (data = parser.read()) {
					
					var err = {};
					if(!sqltls.isStr(data.CircleLocation)){
						err.stack = "CircleLocation is error :[" + data.CircleLocation + "]";
						throw err;
					}
					if(!sqltls.isStr(data.CircleName)){
						err.stack = "CircleName is error :[" + data.CircleName + "]";
						throw err;
					}
					if(!sqltls.isUrl(data.CircleWeb)){
						err.stack = "CircleWeb is error :[" + data.CircleWeb + "]";
						throw err;
					}
					if(!sqltls.isStr(data.GoodsName)){
						err.stack = "GoodsName is error :[" + data.GoodsName + "]";
						throw err;
					}
					if(!sqltls.isPInt(data.GoodsPrice) && data.GoodsPrice != 0){
						err.stack = "GoodsPrice is error :[" + data.GoodsPrice + "]";
						throw err;
					}
					if(!sqltls.isPInt(data.RequestNum)){
						err.stack = "RequestNum is error :[" + data.RequestNum + "]";
						throw err;
					}
				
					insertStr = insertStr + "('CSV'," +
						"'" + r_eventid + "'," +
						"'" + r_teamid + "'," +
						"'NS'," +
						"'NS'," +
						"'" + data.CircleLocation + "'," +
						"'" + data.CircleName + "'," +
						"'" + data.CircleWeb + "'," +
						"'NS'," +
						"'" + data.GoodsName + "'," +
						"'" + data.GoodsPrice + "'," +
						"'" + r_userid + "'," +
						"'" + data.RequestNum + "'," +
						"0," +
						"now()," +
						"now()),";
				}
			});
			parser.on('end', function(){
				insertStr = insertStr.replace(/.$/, ";");
				var deleteStr = " DELETE FROM `BifQuestMemberIF` " +
							" WHERE `BifQuestMemberIF`.EventID = '" + r_eventid + "' " +
							" AND `BifQuestMemberIF`.TeamID = '" + r_teamid + "' " +
							" AND `BifQuestMemberIF`.RequesterID = '" + r_userid + "' " +
							" AND `BifQuestMemberIF`.IFType = 'CSV'; " ;
				var callStr;
				callStr = "CALL function_BifQuestMemberIF_CSV("
				+"'"+  r_eventid + "',"
				+"'"+ r_teamid + "',"
				+"'"+ r_userid + "');"
				
				if(insertStr!=defStr){
					query.put(deleteStr + insertStr + callStr, function(result) {
						res.send("DB input OK.");
					});
				};
			});
			parser.on('error', function(err) {
				//console.log(err);
				//console.log(err.stack);
				var errStr = "Error.";
				if(err.stack){
					errStr = JSON.stringify(err.stack).replace(/\\n.*/, "");
					errStr = errStr.replace(/^./, "");
					errStr = errStr.replace(/\"$/, "");
				}
				res.send(errStr);
			});
		} catch(e) {
			console.log('catch: ' + e);
			res.send("DB input error.Please Check your data or try report the administrator.");
			return;
		}
	}
	return routerhandle;
}