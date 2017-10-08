module.exports = function(dquery) {
	var query = dquery;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		var r_eventid = req.body.eventid ;
		var r_teamname = req.body.teamname ;
		var r_groupname = req.body.groupname ;
		var r_userid = req.user.userid ;
		
		var queryStr = " CALL function_CreateNewTeam('" + r_eventid + "', '" + r_teamname + "', '" + r_groupname + "', '" + r_userid + "'); " ;
		//console.log(queryStr);
		
		query.put(queryStr, function(result) {
			res.send("OK");
		});
	}
	return routerhandle;
}