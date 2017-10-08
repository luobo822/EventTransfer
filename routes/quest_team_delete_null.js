module.exports = function(world) {
	var query = world.query;
	var routerhandle = function(req, res) {
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_userposition = req.session.userconfig.eventselected.userposition ;
		var r_userid = req.user.userid ;
		
		if ( r_userposition != 'Owner' ) {
			res.send("Only administrator can do this.");
		} else {
			var queryStr = "CALL function_Team_NullDelete('" + r_eventid + "','" + r_teamid + "'); ";
			query.get(queryStr, function(result) {
 				res.send("All null object has been deleted.!");
 			});
		}
	}
	return routerhandle;
}