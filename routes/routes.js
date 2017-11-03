/*  ================================================================  */
/*  REST															  */
/*  ================================================================  */

module.exports = function(self) {

	var routesGET = {};
	var routesPOST = {};
	var routesOPENGET = {};
	var routesOPENPOST = {};

	var dquery = require('../dbquery.js');
	var path = require('path');
	var inspect = require('util').inspect;
	var csv = require('comma-separated-values');
	var fs = require('fs')

	var LocalStrategy = require('passport-local').Strategy;
	
	var userconfig = {
		eventselected : {
							eventid  : null ,
							teamid   : null ,
							groupid  : null ,
							userposition  : null
						}
	}

	//初始化
	dquery();	
	
	var world = {};
	world.query = dquery;
	world.sqltls = require('../rabbitls/sqltls.js')();
	
	var insertMsg = function(eventid, teamid, msg) {
		var insertStr = " INSERT INTO `FifTeamChatMessage` " + 
						" (`EventID`, " + 
						" `TeamID`, " + 
						" `MessageID`, " + 
						" `Message`, " + 
						" `Version`, " + 
						" `UpdateTime`, " + 
						" `CreateTime`) " + 
						" SELECT " + 
						" '" + eventid + "', " + 
						" '" + teamid + "', " + 
						" IFNULL(( " + 
						" 	SELECT max(`FifTeamChatMessage`.`MessageID`) + 1 " + 
						"     FROM `FifTeamChatMessage` " + 
						"     WHERE `EventID` = '" + eventid + "' " + 
						"     AND `TeamID` = '" + teamid + "' " + 
						" ),'1'), " + 
						" '" + msg + "', " + 
						" 0, " + 
						" now(), " + 
						" now(); ";
		//console.log(insertStr);
		dquery.put(insertStr, function(){
			self.io.to(eventid + "_" +teamid).emit('chat message', {
				type : "new" ,
				msg : msg
			});
		});
	};
	world.insertMsg = insertMsg;
	
	//认证模块
	self.passport.use(
		new LocalStrategy(
			{
				//Viewのアカウント入力フォームのname属性を指定する
				usernameField: 'username', 
				passwordField: 'password'
			},
			function(username, password, done) {
				//routerのpassport.authenticate()が呼ばれたらここの処理が走る。
				
				var queryStr = " SELECT UserID ,UserNickName FROM `BifUser` " +
								" WHERE `BifUser`.`UserName` = '" + username + "'" +
							    " AND `BifUser`.`UserPassWord` = '" + password + "'";

				var queryCallBack = function(result) {
					
					if( result[0] ){
						//ログイン成功
						var userinfo = {
							userID : result[0].UserID ,
							userAccount : username ,
							userNickName : result[0].UserNickName
						}

						return done(null, userinfo);
					}

					//ログイン失敗
					//messageはログイン失敗時のフラッシュメッセージ。
					//各routerの req.flash() で取得できる。
	       			return done(null, false, {message:'ID or Passwordが間違っています。'});
	       			
				}
				dquery.get(queryStr, queryCallBack);
			}
		)
	);

	self.passport.serializeUser(function(username, done) {
		//console.log('serializeUser');
		done(null, username);
	});

	self.passport.deserializeUser(function(userinfo, done) {
		//console.log('deserializeUser');
		done(null, {
						userid : userinfo.userID ,
						useraccount : userinfo.userAccount ,
						usernickname : userinfo.userNickName ,
						msg:'my message'
					}
		);
	});

	//HTTP GET部分 Start
	////公开类型GET Start

	// @type 网页路由
	// @target 登陆页面

	routesOPENGET['/login'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('login.html'));
	};
	
	// @type 网页路由
	// @target 登出的重定向
	routesOPENGET['/logout'] = function(req, res) {
		req.session.destroy(function() {
			res.redirect('/');
		});
	}

	// @type 图片路由
	// @target 图片
	routesOPENGET['/image/:target'] = function(req, res) {
		res.send(self.imagecache_get(req.params.target));
	};
	
	// @type js路由
	// @target js
	routesOPENGET['/js/:target'] = function(req, res) {
		res.setHeader('Content-Type', 'text/javascript');
		res.send(self.filecache_get(req.params.target));
	};
	
	// @type css路由
	// @target css
	routesOPENGET['/css/:target'] = function(req, res) {
		res.setHeader('Content-Type', 'text/css');
		res.send(self.filecache_get(req.params.target));
	};
	
	// @type 网页路由
	// @target 主页
	// 已登陆 显示主页
	// 未登陆 跳转登陆页面
	routesOPENGET['/'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		if (req.user) {

			if (!req.session.userconfig) {
				req.session.userconfig = userconfig;
			}

			if ( req.session.userconfig.eventselected.eventid == null ) {
				res.redirect("/eventselect");
			} else {
				res.send(self.cache_get('index.html'));
			}
			
		} else {
			res.redirect("/login");
		}
	};
	////公开类型GET End

	////验证类型GET Start
	//routesGET['/signup'] = function(req, res){
	//	if (req.session.user) {
	//		res.redirect("/");
	//	} else {
	//		res.setHeader('Content-Type', 'text/html');a`
	//		res.send(self.cache_get('signup.html'));
	//	}
	//};

	// @type 网页路由
	// @target 选择活动
	routesGET['/eventselect'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('eventselect.html'));
	};

	// @type 网页路由
	// @target 指令
	routesGET['/action'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('action.html'));
	};

	// @type 网页路由
	// @target 指挥
	routesGET['/command'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('command.html'));
	};

	// @type 网页路由
	// @target 任务池
	routesGET['/quest'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('quest.html'));
	};
	
	// @type 网页路由
	// @target 任务包
	routesGET['/package'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('package.html'));
	};

	// @type 网页路由
	// @target csv处理
	//@suica
	routesGET['/csv'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('csv.html'));
	};

	// @type 网页路由
	// @target 需求生成
	//@suica
	routesOPENGET['/requirement'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('requirement.html'));
	};

	// @type 网页路由
	// @target 团队任务文件
	//@suica
	routesGET['/teamlistfile'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('teamlistfile.html'));
	};

	// @type 网页路由
	// @target 締め処理
	routesGET['/shime'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('shime.html'));
	};

	// @type 网页路由
	// @target 个人结算单
	routesGET['/selfsettlement'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('selfsettlement.html'));
	};

	// @type 网页路由
	// @target 指挥中心视图
	routesGET['/statusscreen'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('statusscreen.html'));
	};
	
	// @type 网页路由
	// @target 信息版
	routesGET['/infopad'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('infopad.html'));
	};

	// @type 网页路由
	// @target XXX
	routesGET['/team'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('team.html'));
	};

	// @type 网页路由
	// @target XXX
	routesGET['/event'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('event.html'));
	};
	
	// @type 网页路由
	// @target XXX
	routesGET['/quest/view'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('quest_view.html'));
	};
	
	// @type 网页路由
	// @target XXX
	routesGET['/team/mission'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('team_mission.html'));
	};
	
	
	// @type 网页路由
	// @target XXX
	routesGET['/team/mission/detail'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('team_mission_detail.html'));
	};
	
	// @type 网页路由
	// @target XXX
	routesGET['/quest/circle/goods'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('quest_goods.html'));
	}
	
	// @type 网页路由
	// @target XXX
	routesGET['/quest/task'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('quest_task.html'));
	}
	
	// @type 网页路由
	// @target XXX
	routesGET['/quest/teamview'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('quest_teamview.html'));
	}
	// @type 网页路由
	// @target XXX
	routesGET['/quest/teamview_mgroup'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('quest_teamview_mgroup.html'));
	}
	// @type 网页路由
	// @target XXX
	routesGET['/quest/self'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		if ( req.session.userconfig.eventselected.eventid == null 
			|| req.session.userconfig.eventselected.eventid == null
			)
		{
			res.send(self.cache_get('quest_view.html'));
 		} else {
			res.send(self.cache_get('quest_self.html'));
		}
	}
	// @type 业务处理
	// 查询任务池信息
	// @return  resault 查询结果
	routesGET['/quest_info'] = function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		var r_url_parts = require('url').parse(req.url,true);
		//console.log(r_url_parts.query.viewtype);
		var plussql = "";
		if(r_url_parts.query && r_url_parts.query.viewtype){
			if(r_url_parts.query.viewtype=="ALL"){
			}else if(r_url_parts.query.viewtype=="ONA"){
				plussql = " AND `FifQuestCircle`.`CircleStatus` IN ('ST','ON')";
			}else if(r_url_parts.query.viewtype=="ONF"){
				plussql = " AND `FifQuestCircle`.`CircleStatus` IN ('FI','GV')";
			}else if(r_url_parts.query.viewtype=="FMS"){
				plussql = " AND EXISTS ( " +
					"SELECT * FROM `FifQuestTask`" +
					"WHERE `FifQuestTask`.`EventID` = `FifQuestCircle`.`EventID`" +
					"AND `FifQuestTask`.`TeamID` = `FifQuestCircle`.`TeamID`" +
					"AND `FifQuestTask`.`CircleID` = `FifQuestCircle`.`CircleID`" +
				")";
			}else if(r_url_parts.query.viewtype=="OMS"){
				// TODO
			}else if(r_url_parts.query.viewtype=="LCK"){
				plussql = " AND `FifQuestCircle`.`LockerID` IS NOT NULL";
			}
		}
		var queryStr = "SELECT `FifQuestCircle`.`EventID`," +
			"`FifQuestCircle`.`CircleID`," +
			"`FifQuestCircle`.`CircleLocation`," +
			"`FifQuestCircle`.`CircleName`," +
			"`FifQuestCircle`.`CircleStatus`," +
			" ( " +
			"     SELECT `BifUser`.`UserNickName`" +
			"     FROM `BifUser` " +
			"     WHERE `FifQuestCircle`.`LockerID` = `BifUser`.`UserID` " +
			" ) AS `UserNickName` " +
			" FROM `FifQuestCircle`" +
			" WHERE `FifQuestCircle`.`EventID` = '" + req.session.userconfig.eventselected.eventid + "'" +
			" AND `FifQuestCircle`.`TeamID` = '" + req.session.userconfig.eventselected.teamid + "'" +
			plussql +
			" ORDER BY `FifQuestCircle`.`CircleLocation`;"
			//console.log(queryStr);
		var queryCallBack = function(resault) {
			//console.log("SQL result:" + resault);
			res.send(resault);
		}
		dquery.get(queryStr, queryCallBack);
	};

	// @type 业务处理
	// 查询信息记录表(FifTransferLog)中的数据
	// @return  resault 查询结果
	routesGET['/battle_status'] = function(req, res) {
		var queryStr = "SELECT `FifTransferLog`.`MessageNo`," +
			"`FifTransferLog`.`Status`," +
			"`FifTransferLog`.`UserID`," +
			"`FifTransferLog`.`UserName`," +
			"`FifTransferLog`.`EventID`," +
			"`FifTransferLog`.`CircleID`," +
			"`FifTransferLog`.`CircleLocation`," +
			"`FifTransferLog`.`CircleName`," +
			"`FifTransferLog`.`GoodsID`," +
			"`FifTransferLog`.`GoodsName`," +
			"`FifTransferLog`.`Num`," +
			"`FifTransferLog`.`GoodsStatus`," +
			"`FifTransferLog`.`UpdatePrice`," +
			"`FifTransferLog`.`Info` " +
			"FROM `FifTransferLog` " +
			"WHERE `FifTransferLog`.`EventID` = '" + req.session.userconfig.eventselected.eventid + "'" +
			"AND `FifTransferLog`.`TeamID` = '" + req.session.userconfig.eventselected.teamid + "'" +
			"ORDER BY `FifTransferLog`.`MessageNo` DESC LIMIT 300;"
			//console.log(queryStr);

		res.setHeader('Content-Type', 'application/json');
		var queryCallBack = function(result) {
			//onsole.log("SQL result:" + result);
			res.send(result);
		}
		dquery.get(queryStr, queryCallBack);
	};

	// @type 业务处理
	// 查询当前可用活动
	// @pram  session
	// @return  resault 查询结果
	routesGET['/eventselect_info'] = function(req, res) {
		var queryStr = "SELECT `BifEvent`.`EventID`," + 
						"    `BifEvent`.`EventName`," + 
						"    `BifEvent`.`EventOpenTime`," + 
						"    `BifEvent`.`EventCloseTime`," + 
						"    `BifEvent`.`EventLocation`," + 
						"    `BifEvent`.`EventIsAlive`" + 
						"FROM `BifEvent`,`BifMember`" + 
						"WHERE `BifEvent`.`EventID` = `BifMember`.`EventID`" + 
						"AND `BifMember`.`UserID` = '" + req.user.userid + "'" + 
						"AND `BifEvent`.`EventIsAlive` = 'Y';";

		//console.log("SQL:" + queryStr);
		res.setHeader('Content-Type', 'application/json');
		var queryCallBack = function(result) {
			//console.log("SQL result:" + result);
			res.send(result);
		}
		dquery.get(queryStr, queryCallBack);
	};

	// @type 业务处理
	// 查询战士列表
	// @return  resault 查询结果
	routesGET['/fighter_list'] = function(req, res) {
		var queryStr = "SELECT `BifUser`.`UserID` ," +
			" `BifUser`.`UserNickName` " +
			" FROM `BifUser`,`BifMember`" +
			" WHERE `BifUser`.`UserID` = `BifMember`.`UserID`" +
			" AND `BifMember`.`EventID` = '" + req.session.userconfig.eventselected.eventid + "'" +
			" AND `BifMember`.`TeamID` = '" + req.session.userconfig.eventselected.teamid + "'" +
			" ORDER BY `BifUser`.`UserID`;"
			//console.log(queryStr);

		res.setHeader('Content-Type', 'application/json');
		var queryCallBack = function(resault) {
			//console.log("SQL result:" + resault);
			res.send(resault);
		}
		dquery.get(queryStr, queryCallBack);
	};

	// @type 业务处理
	// 〆処理 采番 Bif To Fif
	routesGET['/eventshime_setid'] = function(req, res) {
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		var queryStr = " SELECT `BifQuestMemberIF`.`IFType`, " + 
						"	`BifQuestMemberIF`.`EventID`, " + 
						"	`BifQuestMemberIF`.`TeamID`, " + 
						"	`BifQuestMemberIF`.`GroupID`, " + 
						"	`BifQuestMemberIF`.`TempCircleID` AS CircleID, " + 
						"	`BifQuestMemberIF`.`CircleLocation`, " + 
						"	`BifQuestMemberIF`.`CircleName`, " + 
						"	`BifQuestMemberIF`.`TempGoodsID`AS GoodsID, " + 
						"	`BifQuestMemberIF`.`GoodsName`, " + 
						"	`BifQuestMemberIF`.`GoodsPrice`, " + 
						"  `BifQuestMemberIF`.`RequesterID`, " + 
						"	sum(`BifQuestMemberIF`.`RequestNum`) as  RequestNum " + 
						" FROM `BifQuestMemberIF` " + 
						" GROUP BY `CircleLocation`,`CircleName`,`GoodsName`,`GoodsPrice`,`RequesterID` " + 
						" ORDER BY `CircleLocation`,`CircleName`,`GoodsName`,`GoodsPrice`,`RequesterID`; "
		//console.log(queryStr);
		var queryCallBack = function(result) {
			var CircleID = 100000;
			var CircleLocation = "";
			var CircleName = "";
			var GoodsID = 1;
			var GoodsName = "";
			var GoodsPrice = "";
			for (x in result) {
				if (result[x].CircleLocation != CircleLocation ||
					result[x].CircleName != CircleName) {
					result[x].CircleID = CircleID + 1;
					CircleID = result[x].CircleID;
					CircleLocation = result[x].CircleLocation;
					CircleName = result[x].CircleName;
					GoodsID = 1;
					result[x].GoodsID = "0" + GoodsID;
				} else {
					result[x].CircleID = CircleID;
					if (result[x].GoodsName != GoodsName ||
						result[x].GoodsPrice != GoodsPrice) {
						GoodsID = GoodsID + 1;
						if (GoodsID < 10) {
							result[x].GoodsID = "0" + GoodsID;
						} else {
							result[x].GoodsID = GoodsID;
						}
					} else {
						result[x].GoodsID = GoodsID;
					}
				}
			}
			//console.log(result);
			var queryStr = ""
			for (y in result) {
				queryStr += " UPDATE `BifQuestMemberIF`" +
					" SET `BifQuestMemberIF`.`TempCircleID` = '" + result[y].CircleID + "'" +
					" ,`BifQuestMemberIF`.`TempGoodsID` = '" + result[y].GoodsID + "'" +
					" WHERE `BifQuestMemberIF`.`EventID` = '" + req.session.userconfig.eventselected.eventid + "'" +
					" AND `BifQuestMemberIF`.`TeamID` = '" + req.session.userconfig.eventselected.teamid + "'" +
					" AND `BifQuestMemberIF`.`CircleLocation` = '" + result[y].CircleLocation + "'" +
					" AND `BifQuestMemberIF`.`CircleName` = '" + result[y].CircleName + "'" +
					" AND `BifQuestMemberIF`.`GoodsName` = '" + result[y].GoodsName + "'" +
					" AND `BifQuestMemberIF`.`GoodsPrice` = '" + result[y].GoodsPrice + "';"
				//console.log(queryStr);
			}
			dquery.put(queryStr, function(result) {
				console.log("[set_num] UPDATE is OK!!");
			});
		}
		dquery.get(queryStr, queryCallBack);
		res.send("最终采番已执行");
	};

	// @type 业务处理
	// 〆処理 一次〆
	// @return  resault 查询结果
	routesGET['/eventshime_1st'] = function(req, res) {
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		var queryStr = "CALL function_BifQuestMemberIF(" + req.session.userconfig.eventselected.eventid +
						 "," + req.session.userconfig.eventselected.teamid + ");"
		var queryCallBack = function(resault) {
			//console.log("SQL result:" + resault);
			res.send("第一轮截止已执行");
		}
		dquery.get(queryStr, queryCallBack);
	};

	// @type 业务处理
	// 〆処理 二次〆
	// @return  resault 查询结果
	routesGET['/eventshime_last'] = function(req, res) {
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		var queryStr = "CALL function_FifQuestMember(" + req.session.userconfig.eventselected.eventid +
						 "," + req.session.userconfig.eventselected.teamid + ");"
		var queryCallBack = function(resault) {
			//console.log("SQL result:" + resault);
			res.send("最终截止已执行");
		}
		dquery.get(queryStr, queryCallBack);
	};

	// @type 业务处理
	// 查询单子信息(FifQuestMember)
	// @return  resault 查询结果
	routesGET['/team_quest_file'] = function(req, res) {
		var queryStr = " SELECT `FifQuestMember`.`EventID`, " + 
					"     `FifQuestMember`.`TeamID`, " + 
					"     `FifQuestMember`.`GroupID`, " + 
					"     `FifQuestMember`.`CircleID`, " + 
					"     `FifQuestMember`.`CircleLocation`, " + 
					"     `FifQuestMember`.`CircleName`, " + 
					"     `FifQuestMember`.`GoodsID`, " + 
					"     `FifQuestMember`.`GoodsName`, " + 
					"     `FifQuestMember`.`GoodsPrice`, " + 
					"     `FifQuestMember`.`RequesterID`, " + 
					"     `FifQuestMember`.`RequestNum`, " + 
					"     `BifUser`.`UserNickName` " + 
					" FROM `FifQuestMember`,`BifUser` " +		
					" WHERE `FifQuestMember`.`EventID` = '" + req.session.userconfig.eventselected.eventid + "'" +
					" AND `FifQuestMember`.`TeamID` = '" + req.session.userconfig.eventselected.teamid + "'" +
					" AND `FifQuestMember`.`RequesterID` = `BifUser`.`UserID` " + 
					" ORDER BY `FifQuestMember`.`CircleLocation`, " + 
					" 		`FifQuestMember`.`CircleID`, " + 
					"         `FifQuestMember`.`GoodsID`, " + 
					"         `FifQuestMember`.`RequesterID`;"
		//console.log(queryStr);

		//res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.setHeader("Content-Type", "text/html; charset=utf-8");
		var queryCallBack = function(result) {
			console.log("[team_quest_file] SELECT IS OK!!!");
			//console.log("[team_quest_file] SQL:" + result);
			var CircleID = "";
			var GoodsID = "";
			var UserNickName = "";
			var printStr = ""
			for (var x in result) {
				if ( result[x].CircleID != CircleID ) {
					CircleID = result[x].CircleID;
					printStr += ')</font><br><br><font size="5" color ="red">' + result[x].CircleLocation + '   ' + result[x].CircleName + '</font>';
					GoodsID = result[x].GoodsID;
					printStr += '<br><font size="4" color ="blue">' + result[x].GoodsName + '    ' + result[x].GoodsPrice + '    ';
					printStr += "(" + result[x].UserNickName;
					if ( result[x].RequestNum > 1 ) {
						for( var c=1; c < result[x].RequestNum; c++ ){
							printStr += ',' + result[x].UserNickName;
						}
					}
				} else if ( result[x].GoodsID != GoodsID ) {
					GoodsID = result[x].GoodsID;
					printStr += ')<br>' + result[x].GoodsName + '    ' + result[x].GoodsPrice + '    ';
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
		dquery.get(queryStr, queryCallBack);
	};
	// @type 业务处理
	// 结算系统
	// @return  resault 查询结果
	routesGET['/settlement'] = function(req, res) {
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		var s_eventid = req.session.userconfig.eventselected.eventid ;
		var s_teamid = req.session.userconfig.eventselected.teamid ;
		var s_userid = req.user.userid ;
		var queryStr1 = " SELECT `FifTransferLog`.`UserID`, " + 
					"     `FifTransferLog`.`UserName`, " + 
					"     `FifTransferLog`.`EventID`, " + 
					"     `FifTransferLog`.`TeamID`, " + 
					"     `FifTransferLog`.`GroupID`, " + 
					"     `FifTransferLog`.`CircleID`, " + 
					"     `FifTransferLog`.`CircleLocation`, " + 
					"     `FifTransferLog`.`CircleName`, " + 
					"     `FifTransferLog`.`GoodsID`, " + 
					"     `FifTransferLog`.`GoodsName`, " + 
					"     sum(`FifTransferLog`.`Num`) as Num, " + 
					"     `FifTransferLog`.`GoodsStatus`, " + 
					"     `FifQuest`.`GoodsPrice`, " + 
					"     `FifTransferLog`.`UpdatePrice`, " + 
					"     `FifTransferLog`.`Info`, " + 
					"     `FifTransferLog`.`DeleteFlag`" + 
					" FROM `FifTransferLog`,`FifQuest`" + 
					" WHERE `FifTransferLog`.`DeleteFlag` = 'N' " + 
					" AND `FifTransferLog`.`Status` = 'FI' " + 
					" AND `FifTransferLog`.`EventID` = '" + s_eventid + "' " + 
					" AND `FifTransferLog`.`TeamID` = '" + s_teamid + "' " + 
					" AND `FifTransferLog`.`EventID` = `FifQuest`.`EventID` " + 
					" AND `FifTransferLog`.`TeamID` = `FifQuest`.`TeamID` " + 
					" AND `FifTransferLog`.`CircleID` = `FifQuest`.`CircleID` " + 
					" AND `FifTransferLog`.`GoodsID` = `FifQuest`.`GoodsID` " + 
					" GROUP BY `FifTransferLog`.`EventID`, " + 
					"          `FifTransferLog`.`TeamID`, " + 
					"          `FifTransferLog`.`CircleID`, " + 
					"          `FifTransferLog`.`GoodsID`, " + 
					"          `FifTransferLog`.`UserID` " + 
					" ORDER BY `FifTransferLog`.`EventID`, " + 
					"          `FifTransferLog`.`TeamID`, " + 
					"          `FifTransferLog`.`CircleID`, " + 
					"          `FifTransferLog`.`GoodsID`, " + 
					"          `FifTransferLog`.`UserID`; "; 
					
		var queryStr2 = " SELECT `FifQuestMember`.`EventID`, " + 
						" `FifQuestMember`.`TeamID`, " + 
						" `FifQuestMember`.`GroupID`, " + 
						" `FifQuestMember`.`CircleID`, " + 
						" `FifQuestMember`.`CircleLocation`, " + 
						" `FifQuestMember`.`CircleName`, " + 
						" `FifQuestMember`.`GoodsID`, " + 
						" `FifQuestMember`.`GoodsName`, " + 
						" `FifQuestMember`.`GoodsPrice`, " + 
						" `FifQuestMember`.`RequesterID`, " + 
						" `BifUser`.`UserNickName`, " + 
						" `FifQuestMember`.`RequestNum`, " + 
						" Num.TotalRequestNum " + 
						" FROM (`FifQuestMember`,`BifUser`) " + 
						" INNER JOIN (SELECT `FifQuestMember`.`EventID`, " + 
						" `FifQuestMember`.`TeamID`, " + 
						" `FifQuestMember`.`GroupID`, " + 
						" `FifQuestMember`.`CircleID`, " + 
						" `FifQuestMember`.`GoodsID`, " + 
						" sum(RequestNum) as TotalRequestNum " + 
						" FROM `FifQuestMember` " + 
						" GROUP BY `FifQuestMember`.`EventID`, " + 
						"          `FifQuestMember`.`TeamID`, " + 
						"             `FifQuestMember`.`CircleID`, " + 
						"             `FifQuestMember`.`GoodsID` " + 
						" ORDER BY `FifQuestMember`.`EventID`, " + 
						"           `FifQuestMember`.`TeamID`, " + 
						"             `FifQuestMember`.`CircleID`, " + 
						"             `FifQuestMember`.`GoodsID`) Num " + 
						" ON (  Num.EventID = `FifQuestMember`.`EventID` " + 
						"       AND Num.TeamID = `FifQuestMember`.`TeamID` " + 
						"       AND Num.CircleID = `FifQuestMember`.`CircleID` " + 
						"       AND Num.GoodsID = `FifQuestMember`.`GoodsID` " + 
						"    ) " + 
						" WHERE `FifQuestMember`.`EventID` = '" + s_eventid + "' " + 
						" AND `FifQuestMember`.`TeamID` = '" + s_teamid + "' " + 
						" AND `FifQuestMember`.`RequesterID` = `BifUser`.`UserID` " + 
						" ORDER BY `FifQuestMember`.`EventID`, " + 
						"           `FifQuestMember`.`TeamID`, " + 
						"             `FifQuestMember`.`CircleID`, " + 
						"             `FifQuestMember`.`GoodsID`; ";
		queryStr = queryStr1 + queryStr2;
		var queryCallBack = function(resault) {
			var loglist = resault[0] ;
			var reqlist = resault[1] ;
			var banklist = [] ;
			var pendinglist_buy = [] ;
			var pendinglist_get = [] ;
			
			/**
			* 数値チェック関数
			* 入力値が数値 (符号あり小数 (- のみ許容)) であることをチェックする
			* [引数]   numVal: 入力値
			* [返却値] true:  数値
			*          false: 数値以外
			*/
			function isNumber(numVal){
				// チェック条件パターン
				var pattern = /^[-]?([1-9]\d*|0)(\.\d+)?$/;
				// 数値チェック
				return pattern.test(numVal);
			}
			
			var settlementlist = "=====购买明细=====\n\n";
			
			
			for ( logone in loglist ) {
				if ( loglist[logone].UserID != s_userid ) {
					continue;
				}
				settlementlist += logone + ".买到了 " 
				+ " 【" + loglist[logone].CircleLocation + "】"
				+ loglist[logone].CircleName
				+ " 的 「" + loglist[logone].GoodsName
				+ "」" + loglist[logone].Num + "个" + "\n"
				+ "    物品价格 : " + loglist[logone].GoodsPrice
				+ " 更新价格 : " + loglist[logone].UpdatePrice +"\n"
				+ "    有以下人需求:\n";
				
				for ( reqone in reqlist ) {
					if ( reqlist[reqone].CircleID == loglist[logone].CircleID &&
							reqlist[reqone].GoodsID == loglist[logone].GoodsID ) {
								settlementlist += "        " + "□ " + reqlist[reqone].UserNickName + "\n";
								if ( reqlist[reqone].TotalRequestNum != loglist[logone].Num ||
 										!isNumber(parseInt(reqlist[reqone].GoodsPrice,10)) ) {
									pendinglist_buy.push({
										CircleLocation : reqlist[reqone].CircleLocation ,
										CircleName : reqlist[reqone].CircleName ,
										GoodsName : reqlist[reqone].GoodsName ,
										GoodsPrice : reqlist[reqone].GoodsPrice ,
										UserNickName : reqlist[reqone].UserNickName
									});
								} else {
									banklist.push({
										UserID : reqlist[reqone].RequesterID ,
										UserNickName : reqlist[reqone].UserNickName ,
										Money : reqlist[reqone].GoodsPrice
									});
								}
					}
				}
				
				settlementlist += "\n\n";
			}
			
			settlementlist += "\n=====购买明细(PENDING)=====\n\n";
			for ( one in pendinglist_buy ) {
				settlementlist += pendinglist_buy[one].CircleLocation
				+ " " + pendinglist_buy[one].CircleName
				+ " " + pendinglist_buy[one].GoodsName
 				+ " " + pendinglist_buy[one].GoodsPrice
 				+ " " + pendinglist_buy[one].UserNickName
 				+ "\n";
 			}
 			
 			delete pendinglist_buy;
 			settlementlist += "\n\n";
			
			settlementlist += "\n=====索取明细=====\n\n";
			
			for ( reqone in reqlist ) {
				if ( reqlist[reqone].RequesterID == s_userid ) {
					for ( logone in loglist ) {
						if ( loglist[logone].CircleID == reqlist[reqone].CircleID &&
  							loglist[logone].GoodsID == reqlist[reqone].GoodsID ) {
								if ( loglist[logone].UserID != reqlist[reqone].RequesterID ) {
								//自分の表示しない
									settlementlist += "□ " + loglist[logone].UserName + " 买到了我需求的"
									+ " " + reqlist[reqone].CircleLocation 
									+ " " + reqlist[reqone].CircleName
									+ " " + reqlist[reqone].GoodsName
									+ " " + reqlist[reqone].GoodsPrice
									+ "\n";
								}
								if ( reqlist[reqone].TotalRequestNum != loglist[logone].Num ||
										!isNumber(parseInt(reqlist[reqone].GoodsPrice,10)) ) {
									pendinglist_get.push({
										CircleLocation : reqlist[reqone].CircleLocation ,
										CircleName : reqlist[reqone].CircleName ,
										GoodsName : reqlist[reqone].GoodsName ,
										GoodsPrice : reqlist[reqone].GoodsPrice ,
									});
								} else {
									banklist.push({
										UserID : loglist[logone].UserID ,
										UserNickName : reqlist[reqone].UserNickName ,
										Money : Number(reqlist[reqone].GoodsPrice) * -1
									});
								}
						} 
					}
				}
			}
			
			settlementlist += "\n=====索取明细(PENDING)=====\n\n";
			for ( one in pendinglist_get ) {
				settlementlist += pendinglist_get[one].CircleLocation
				+ " " + pendinglist_get[one].CircleName
				+ " " + pendinglist_get[one].GoodsName
 				+ " " + pendinglist_get[one].GoodsPrice
 				+ "\n";
 			}

			delete pendinglist_get;
 			settlementlist += "\n\n\n\n";
			
			settlementlist += "\n=====收支明细=====\n\n";
			var finallist = [];
			var f_settlement = function ( bankone ) {
				var isCreate = false ;
				var index = 0 ;
				for ( one in finallist ) {
					if ( finallist[one].UserID == bankone.UserID ) {
						isCreate = true ;
						index = one ;
					}
				}
				if ( isCreate ) {
					finallist[index].Money = Number(finallist[index].Money) + Number(bankone.Money);
				} else {
					finallist.push(bankone);
				}
			}
			
			for ( bankone in banklist ) {
				f_settlement ( banklist[bankone] );
			}
			
			for ( one in finallist ) {
				settlementlist += finallist[one].UserNickName + " 应给我 "
				+ finallist[one].Money + " 円 "
 				+ "\n";
			}
			
			//console.log("SQL result:" + resault);
			res.send(settlementlist);
		}
		dquery.get(queryStr, queryCallBack);
	};
	
	// @type 业务处理
	// 指挥中心视图
	// @return  resault 查询结果
	routesGET['/status_screen'] = function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		var s_eventid = req.session.userconfig.eventselected.eventid ;
		var s_teamid = req.session.userconfig.eventselected.teamid ;
		var s_userid = req.user.userid ;
		var queryStrCircle = " SELECT `FifQuestCircle`.`CircleLocation`, " + 
							"     `FifQuestCircle`.`CircleName`, " + 
							"     `FifQuestCircle`.`CircleStatus` " + 
							" FROM `FifQuestCircle` " + 
							" WHERE `FifQuestCircle`.`EventID` = '" + s_eventid + "' " + 
							" AND `FifQuestCircle`.`TeamID`= '" + s_teamid + "'  " + 
							" ORDER BY `FifQuestCircle`.`CircleLocation`; ";
		var queryStrGoods = " SELECT `FifQuest`.`CircleLocation`, " + 
							"     `FifQuest`.`GoodsName`, " + 
							"     `FifQuest`.`GoodsPrice`, " + 
							"     `FifQuest`.`GoodsStatus` " + 
							" FROM `FifQuest` " + 
							" WHERE `FifQuest`.`EventID` = '" + s_eventid + "' " + 
							" AND `FifQuest`.`TeamID`= '" + s_teamid + "' " + 
							" ORDER BY `FifQuest`.`CircleID`,`FifQuest`.`GoodsID`;";
		var queryStrMember = " SELECT Mem.`UserName`, " + 
							" 		Mem.`CircleLocation`, " +
							" 		Mem.`CircleName` " + 
							" FROM " + 
							" 	(SELECT `FifTransferLog`.`UserName`, " + 
							" 		`FifTransferLog`.`CircleLocation`, " + 
							" 		`FifTransferLog`.`CircleName` " + 
							" 	FROM `FifTransferLog` " + 
							" 	WHERE `FifTransferLog`.`EventID` = '" + s_eventid + "' " + 
							" 	AND `FifTransferLog`.`TeamID`= '" + s_teamid + "' " + 
							" 	AND `FifTransferLog`.`DeleteFlag` = 'N' " + 
							" 	AND `FifTransferLog`.`Status` in ('WA','FI','FR') " + 
							" 	GROUP BY `FifTransferLog`.`UserID`,`FifTransferLog`.`CircleID`  " + 
							" 	ORDER BY `FifTransferLog`.`MessageNo` DESC) Mem " + 
							" GROUP BY Mem.`UserName`;"
		var queryStrLOG = " SELECT `FifTransferLog`.`MessageNo`, " + 
							"     concat(`FifTransferLog`.`Status`,'_', " + 
							"     `FifTransferLog`.`UserName`,'_', " + 
							"     `FifTransferLog`.`CircleID`,'_', " + 
							"     `FifTransferLog`.`CircleLocation`,'_', " + 
							"     `FifTransferLog`.`CircleName`,'_', " + 
							"     `FifTransferLog`.`GoodsName`,'_', " + 
							"     `FifTransferLog`.`Num`,'_', " + 
							"     `FifTransferLog`.`GoodsStatus`) AS Info " + 
							" FROM `nodejs`.`FifTransferLog` " + 
							" WHERE `FifTransferLog`.`EventID` = '" + s_eventid + "' " + 
							" AND `FifTransferLog`.`TeamID`= '" + s_teamid + "' " + 
							" AND `FifTransferLog`.`DeleteFlag` = 'N'; ";
							
		queryStr = queryStrCircle + queryStrGoods + queryStrMember + queryStrLOG ;
		var queryCallBack = function(resault) {
			//console.log("SQL result:" + inspect(resault) );
			res.send(resault);
		}
		dquery.get(queryStr, queryCallBack);
	};
	
	routesGET['/event/view'] = function(req, res) {
		var queryStr = " SELECT `BifEvent`.`EventID`, " + 
						"     `BifEvent`.`EventName`, " + 
						"     `BifEvent`.`EventOpenTime`, " + 
						"     `BifEvent`.`EventCloseTime`, " + 
						"     `BifEvent`.`EventLocation`, " + 
						"     `BifEvent`.`EventIsAlive` " + 
						" FROM `BifEvent`; ";
		//console.log(queryStr);
		res.setHeader('Content-Type', 'application/json');
		var queryCallBack = function(resault) {
			//console.log("SQL result:" + resault);
			res.send(resault);
		}
		dquery.get(queryStr, queryCallBack);
	}
	
	routesGET['/quest/circle'] = function(req, res) {
		var s_eventid = req.session.userconfig.eventselected.eventid ;
		var s_teamid = req.session.userconfig.eventselected.teamid ;
		var queryStr = " SELECT `BifQuestCircle`.`CircleID`, " + 
						" 	`BifQuestCircle`.`CircleLocation`, " + 
						" 	`BifQuestCircle`.`CircleName`, " +
						" 	`BifQuestCircle`.`CircleWeb` " + 
						" FROM `BifQuestCircle` " + 
						" WHERE `BifQuestCircle`.`EventID` = '" + s_eventid + "' " + 
						" AND `BifQuestCircle`.`TeamID` = '" + s_teamid + "' " + 
						" ORDER BY `BifQuestCircle`.`CircleLocation`; ";
		//console.log(queryStr);
		res.setHeader('Content-Type', 'application/json');
		var queryCallBack = function(resault) {
			//console.log("SQL result:" + resault);
			res.send(resault);
		}
		dquery.get(queryStr, queryCallBack);
	}
	
	routesGET['/quest/circle/view'] = function(req, res) {
		var s_eventid = req.session.userconfig.eventselected.eventid ;
		var s_teamid = req.session.userconfig.eventselected.teamid ;
		var queryStr = " SELECT `BifQuestCircle`.`CircleID`, " + 
						" 	`BifQuestCircle`.`CircleLocation`, " + 
						" 	`BifQuestCircle`.`CircleName`, " +
						" 	`BifQuestCircle`.`CircleWeb` " + 
						" FROM `BifQuestCircle` " + 
						" WHERE `BifQuestCircle`.`EventID` = '" + s_eventid + "' " + 
						" AND `BifQuestCircle`.`TeamID` = '" + s_teamid + "'; ";
		//console.log(queryStr);
		res.setHeader('Content-Type', 'application/json');
		var queryCallBack = function(resault) {
			//console.log("SQL result:" + resault);
			res.send(resault);
		}
		dquery.get(queryStr, queryCallBack);
	}	
	
	routesGET['/quest/system_shime'] = function(req, res) {
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		var s_eventid = req.session.userconfig.eventselected.eventid ;
		var s_teamid = req.session.userconfig.eventselected.teamid ;
		var queryStr = "call function_BifQuest_View(" + s_eventid + "," + s_teamid + ");";
		//console.log(queryStr);
		
		var queryCallBack = function(resault) {
			//console.log("SQL result:" + resault);
			res.send('OK');
		}
		dquery.put(queryStr, queryCallBack);
	}

	routesGET['/quest/output.csv'] = function(req, res) {
		res.setHeader("Content-Type", "text/csv; charset=utf-8");
		var s_eventid = req.session.userconfig.eventselected.eventid ;
		var s_teamid = req.session.userconfig.eventselected.teamid ;
		var queryStr = " SELECT `FifQuestMember`.`CircleID`, " + 
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
					" ORDER BY `FifQuestMember`.`CircleID`, " + 
					"          `FifQuestMember`.`GoodsID`, " + 
					"          `FifQuestMember`.`RequesterID` ;" ;
		//console.log(queryStr);
		
		var queryCallBack = function(resault) {
			//console.log("SQL result:" + resault);
			var t_CircleID = "";
			var t_GoodsID = "";
			var print = "";
			for (onerow in resault) {
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
			//console.log(queryStr);
			res.send(print);
		}
		dquery.get(queryStr, queryCallBack);
	}
	routesGET['/quest/mine'] = require('./quest_mine.js')(dquery);
	routesGET['/quest/team'] = require('./quest_team.js')(dquery);
	routesGET['/quest/team_mgroup'] = require('./quest_team_mgroup.js')(dquery);
	routesGET['/quest/self.csv'] = require('./quest_self.csv.js')(dquery);
	routesGET['/quest/output_task.csv'] = require('./output_task.csv.js')(dquery);
	////验证类型GET End
	//HTTP GET部分 End	

	//HTTP POST部分 Start
	////公开类型POST Start
	
	// @type 网页路由
	// @target 登陆判断
	self.app.post('/login',
		self.passport.authenticate('local', { successRedirect: '/',
		failureRedirect: '/login'})
	);
	////公开类型POST End

	////验证类型POST Start
	// @type 业务处理
	// 查询任务包信息
	// @return  object 任务包信息
	routesPOST['/package'] = function(req, res) {
		//console.log('[package] CircleID:' + req.body.CircleID);
		var queryStr = "SELECT `FifQuest`.`CircleID`," +
			"`FifQuest`.`CircleLocation`," +
			"`FifQuest`.`CircleName`," +
			"`FifQuestCircle`.`CircleWeb`," +
			"`FifQuest`.`GoodsID`," +
			"`FifQuest`.`GoodsName`," +
			"`FifQuest`.`GoodsPrice`," +
			"`FifQuest`.`Num`," +
			"`FifQuest`.`GoodsStatus`," +
			" ( " +
			"     SELECT `BifUser`.`UserNickName`" +
			"     FROM `BifUser` " +
			"     WHERE `FifQuestCircle`.`LockerID` = `BifUser`.`UserID` " +
			" ) AS `UserNickName`, " +
			"`FifQuestCircle`.`CircleStatus`," +
			"(SELECT sum(`FifTransferLog`.`Num`) FROM `FifTransferLog`" +
			" WHERE `FifQuest`.`EventID` = `FifTransferLog`.`EventID`" +
			" AND `FifQuest`.`TeamID` = `FifTransferLog`.`TeamID`" +
			" AND `FifQuest`.`CircleID` = `FifTransferLog`.`CircleID`" +
			" AND `FifQuest`.`GoodsID` = `FifTransferLog`.`GoodsID`" +
			" AND `FifTransferLog`.`DeleteFlag` != 'Y' ) as bNum" +
			" FROM `FifQuest`,`FifQuestCircle`" +
			" WHERE `FifQuest`.`EventID` =  '" + req.session.userconfig.eventselected.eventid + "'" +
			" AND `FifQuest`.`TeamID` =  '" + req.session.userconfig.eventselected.teamid + "'" +
			" AND `FifQuest`.`CircleID` =  '" + req.body.CircleID + "'" +
			" AND `FifQuestCircle`.`EventID` =  '" + req.session.userconfig.eventselected.eventid + "'" +
			" AND `FifQuestCircle`.`TeamID` =  '" + req.session.userconfig.eventselected.teamid + "'" +
			" AND `FifQuestCircle`.`CircleID` =  '" + req.body.CircleID + "'" +
			//" AND `FifQuest`.`GoodsStatus` = 'OK'" +
			" ORDER BY `FifQuest`.`GoodsID`;"
			//console.log(inspect(queryStr));

		res.setHeader('Content-Type', 'application/json');
		var queryCallBack = function(result) {
			//console.log("SQL result:" + result);
			if (result == "") {
				res.send(result);
			} else {
				result[0].UserName = req.user.usernickname;
				res.send(result);
			}
		}
		dquery.get(queryStr, queryCallBack);
	};

	// @type 业务处理
	// 任务包收集以及状态更新
	// @return  resault 查询结果
	routesPOST['/package_report'] = function(req, res) {
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		console.log('[packagefinish] recive post data:' + JSON.stringify(req.body.package));
		var package = req.body.package;
		
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_groupid = req.session.userconfig.eventselected.groupid ;
		var r_teamroom = req.session.userconfig.eventselected.eventid + "_" + req.session.userconfig.eventselected.teamid ;

		//サークル情報更新
		var circleID = package[0].CircleID;
		//戦闘中に更新
		var circleStrON = "UPDATE `FifQuestCircle`" +
			" SET `FifQuestCircle`.`CircleStatus` = 'ON'" +
			" WHERE `FifQuestCircle`.`EventID` =  '" + r_eventid + "'" +
			" AND `FifQuestCircle`.`TeamID` =  '" + r_teamid + "'" +
			" AND `FifQuestCircle`.`CircleID` = '" + circleID + "';"
		console.log(circleStrON);
		if (package[0].Status == "FI") {
			dquery.put(circleStrON, function(result) {
				//var msg = req.user.usernickname
				//		+ ' 提交了 ' + package[0].CircleLocation
				//		+ " " + package[0].CircleName + " 的最新战况。";
				//insertMsg(r_eventid, r_teamid, msg);
				//self.io.to(r_teamroom).emit('chat message', req.user.usernickname
				//							+ ' 提交了 ' + package[0].CircleLocation
				//							+ " " + package[0].CircleName + " 的最新战况。");
				console.log("[CircleStatus] ON UPDATE is OK!!");
			});
 		}else if (package[0].Status == "WA") {
			var msg = req.user.usernickname
					+ ' 现在已经抵达 ' + package[0].CircleLocation
					+ " " + package[0].CircleName + " 的队列中。";
			insertMsg(r_eventid, r_teamid, msg);
			//self.io.to(r_teamroom).emit('chat message', req.user.usernickname
			//							+ ' 现在已经抵达 ' + package[0].CircleLocation
			//							+ " " + package[0].CircleName + " 的队列中。");
		} else if (package[0].Status == "FR") {
			var msg = req.user.usernickname
					+ ' 现在闲得不行，在 ' + package[0].CircleLocation
					+ " " + package[0].CircleName + " 附近徘徊。";
			insertMsg(r_eventid, r_teamid, msg);
			//self.io.to(r_teamroom).emit('chat message', req.user.usernickname
			//							+ ' 现在闲得不行，在 ' + package[0].CircleLocation
			//							+ " " + package[0].CircleName + " 附近徘徊。");
		}
		
		//購入可能のものがないなら、完了に更新
		var circleStrFI = "UPDATE `FifQuestCircle`" +
			" SET `FifQuestCircle`.`CircleStatus` = 'FI'" +
			" WHERE `FifQuestCircle`.`EventID` =  '" + r_eventid + "'" +
			" AND `FifQuestCircle`.`TeamID` =  '" + r_teamid + "'" +
			" AND `FifQuestCircle`.`CircleID` = '" + circleID + "'" +
			" AND (SELECT count(*) FROM `FifQuest`" +
			"      WHERE `FifQuest`.`GoodsStatus` = 'OK'" +
			"      AND `FifQuest`.`EventID` =  '" + r_eventid + "'" +
			"      AND `FifQuest`.`TeamID` =  '" + r_teamid + "'" +
			"      AND `FifQuest`.`CircleID` = `FifQuestCircle`.`CircleID`) = 0; "
		console.log(circleStrFI);

		var queryReasult = function(result) {
			console.log("DB UPDATE is OK!!");
			res.send("報告が完了しました!!");
		}

		var queryStr = "INSERT INTO `FifTransferLog`" +
			"(`Status`," +
			"`UserID`," +
			"`UserName`," +
			"`GroupID`," +
			"`TeamID`," +
			"`EventID`," +
			"`CircleID`," +
			"`CircleLocation`," +
			"`CircleName`," +
			"`GoodsID`," +
			"`GoodsName`," +
			"`Num`," +
			"`GoodsStatus`," +
			"`UpdatePrice`," +
			"`Info`)" +
			" VALUES ";
		
		var finishFlag = 'Y';
		for (var packageidx = 0; packageidx < package.length; packageidx++) {
			if (package[packageidx].GoodsPrice == '') {
				package[packageidx].GoodsPrice = null;
			}

			if (package[packageidx].Info == '') {
				package[packageidx].Info = null;
			} else {
				package[packageidx].Info = "'" + package[packageidx].Info + "'";
			}

			//頒布物状態更新
			if (package[packageidx].GoodsStatus == 'SO' || package[packageidx].GoodsStatus == 'FI') {
				var updateStr = "UPDATE `FifQuest`" +
					" SET `GoodsStatus` = '" + package[packageidx].GoodsStatus + "'" +
					" WHERE `FifQuest`.`EventID` =  '" + r_eventid + "'" +
					" AND `FifQuest`.`TeamID` =  '" + r_teamid + "'" +
					" AND `FifQuest`.`CircleID` = '" + package[packageidx].CircleID + "'" +
					" AND `FifQuest`.`GoodsID` = '" + package[packageidx].GoodsID + "';"
				console.log(updateStr);
				dquery.put(updateStr, function(result) {
					console.log("[GoodsStatus] UPDATE is OK!!");
					dquery.put(circleStrFI, function(result) {
						console.log("[CircleStatus] FI UPDATE is OK!!");
					});
				});
			} else if ( package[packageidx].GoodsStatus == 'OK' ) {
				finishFlag = 'N';
			}

			console.log(package[packageidx]);
			queryStr = queryStr + "('" + package[packageidx].Status + "'," +
				"'" + req.user.userid + "'," +
				"'" + req.user.usernickname + "'," +
				"'" + r_groupid + "'," +
				"'" + r_teamid + "'," +
				"'" + r_eventid + "'," +
				"'" + package[packageidx].CircleID + "'," +
				"'" + package[packageidx].CircleLocation + "'," +
				"'" + package[packageidx].CircleName + "'," +
				"'" + package[packageidx].GoodsID + "'," +
				"'" + package[packageidx].GoodsName + "'," +
				package[packageidx].Num + "," +
				"'" + package[packageidx].GoodsStatus + "'," +
				"'" + package[packageidx].GoodsPrice + "'," +
				package[packageidx].Info + "),";
		}
		if (package[0].Status == "FI" && finishFlag == 'N'){
			var msg = req.user.usernickname
					+ ' 提交了 ' + package[0].CircleLocation
					+ " " + package[0].CircleName + " 的最新战况。但是有物品没有购入全数。";
			insertMsg(r_eventid, r_teamid, msg);
		} else if ( package[0].Status == "FI" && finishFlag == 'Y'){
			var msg = req.user.usernickname
					+ ' 提交了 ' + package[0].CircleLocation
					+ " " + package[0].CircleName + " 的最新战况。所有物品都已完成。";
			insertMsg(r_eventid, r_teamid, msg);
		}
		queryStr = queryStr.replace(/.$/, ";");
		// console.log(queryStr);
		dquery.put(queryStr, queryReasult);
	};

	routesPOST['/circle_reset'] = function(req, res) {
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		var circleID = req.body.CircleID;
		//異常処理
		//if ( circleID == null ) {
		//	res.send("サークルIDエラー！！！");
		//}
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_teamroom = req.session.userconfig.eventselected.eventid + "_" + req.session.userconfig.eventselected.teamid ;
		
		var queryStr = "INSERT INTO `FifTransferLog`" +
			"(`Status`," +
			"`UserID`," +
			"`UserName`," +
			"`GroupID`," +
			"`TeamID`," +
			"`EventID`," +
			"`CircleID`," +
			"`Info`," +
			"`GoodsStatus`)" +
			" VALUES ";
		queryStr = queryStr + "('RS'," +
			"'" + req.user.userid + "'," +
			"'" + req.user.usernickname + "'," +
			"'" + req.session.userconfig.eventselected.groupid + "'," +
			"'" + r_teamid + "'," +
			"'" + r_eventid + "'," +
			"'" + circleID + "'," +
			"'" + circleID + "'," +
			"'OK');";
		console.log(queryStr);
		var queryResetStr1 = "UPDATE `FifQuestCircle` SET `FifQuestCircle`.`CircleStatus` = 'ST' " +
			" WHERE `FifQuestCircle`.`EventID` =  '" + r_eventid + "'" +
			" AND `FifQuestCircle`.`TeamID` =  '" + r_teamid + "'" +
			" AND `FifQuestCircle`.`CircleID` = '" + circleID + "'; "
		var queryResetStr2 = "UPDATE `FifQuest` SET `FifQuest`.`GoodsStatus` = 'OK' " +
			" WHERE `FifQuest`.`EventID` =  '" + r_eventid + "'" +
			" AND `FifQuest`.`TeamID` =  '" + r_teamid + "'" +
			" AND `FifQuest`.`CircleID` = '" + circleID + "'; "
		var queryResetStr3 = "UPDATE `FifTransferLog` SET `FifTransferLog`.`DeleteFlag` = 'Y' " +
			" WHERE `FifTransferLog`.`EventID` =  '" + r_eventid + "'" +
			" AND `FifTransferLog`.`TeamID` =  '" + r_teamid + "'" +
			" AND `FifTransferLog`.`CircleID` = '" + circleID + "'; "
		dquery.put(queryStr, function(result) {
			console.log("[CircleReset] INSERT is OK!!");
		});
		dquery.put(queryResetStr1, function(result) {
			console.log("[CircleReset] ReSet1 UPDATE is OK!!");
		});
		dquery.put(queryResetStr2, function(result) {
			console.log("[CircleReset] ReSet2 UPDATE is OK!!");
		});
		dquery.put(queryResetStr3, function(result) {
			console.log("[CircleReset] ReSet3 UPDATE is OK!!");
			var msg = req.user.usernickname
					+ ' 重置了 ' + req.body.CircleLocation
					+ " " + req.body.CircleName + " 的战况。";
			insertMsg(r_eventid, r_teamid, msg);
			//self.io.to(r_teamroom).emit('chat message', req.user.usernickname
			//							+ ' 重置了 ' + req.body.CircleLocation
			//							+ " " + req.body.CircleName + " 的战况。");
			res.send("サークル情報を更新しました！！！");
		});
	};

	routesPOST['/task_add'] = function(req, res) {
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		var circleID = req.body.CircleID;
		var fighterID = req.body.FighterID;
		var fighter = req.body.Fighter;
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_teamroom = req.session.userconfig.eventselected.eventid + "_" + req.session.userconfig.eventselected.teamid ;
		//異常処理
		//if ( circleID == null ) {
		//	res.send("サークルIDエラー！！！");
		//}
		var queryTaskStr = " INSERT INTO `FifQuestTask`" +
			" (`EventID`," +
			" `TeamID`," +
			" `UserID`," +
			" `CircleID`," +
			" `Level`," +
			" `Version`," +
			" `UpdateTime`," +
			" `CreateTime`)" +
			" VALUES" +
			" ('" + r_eventid + "'," +
			" '" + r_teamid + "'," +
			" '" + fighterID + "'," +
			" '" + circleID + "'," +
			" 5," +
			" 1," +
			" now()," +
			/////////////
			///対応忘れな
			//////////////
			" now() );"
		dquery.put(queryTaskStr, function(result) {
			console.log("[TASKADD] UPDATE is OK!!");
			var msg = req.user.usernickname
					+ ' 给 ' + req.body.Fighter + " 分发了 " +  req.body.CircleLocation
					+ " " + req.body.CircleName + " 的指示。";
			insertMsg(r_eventid, r_teamid, msg);
			//self.io.to(r_teamroom).emit('chat message', req.user.usernickname
			//							+ ' 给 ' + req.body.Fighter + " 分发了 " +  req.body.CircleLocation
			//							+ " " + req.body.CircleName + " 的指示。");
			res.send("任務を生成しました!");
		});
	};

	routesPOST['/fighter_on'] = function(req, res) {
		var circleID = req.body.CircleID;
		var queryStr = "SELECT `FifQuestTask`.`CircleID`," +
						" `BifUser`.`UserNickName`" +
						" FROM `FifQuestTask`,`BifUser`" +
						" WHERE `FifQuestTask`.`EventID` =  '" + req.session.userconfig.eventselected.eventid + "'" +
						" AND `FifQuestTask`.`TeamID` =  '" + req.session.userconfig.eventselected.teamid + "'" +
						" AND `FifQuestTask`.`CircleID` = '" + circleID + "'" +
						" AND `FifQuestTask`.`UserID` =  `BifUser`.`UserID` " +
						" GROUP BY `BifUser`.`UserNickName`;"
		//console.log(queryStr);

		res.setHeader('Content-Type', 'application/json');
		var queryCallBack = function(resault) {
			console.log("SQL result:" + resault);
			res.send(resault);
		}
		dquery.get(queryStr, queryCallBack);
	};

	//対応忘れな
	routesPOST['/eventselect_info'] = function(req, res) {
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		
		var queryStr = 	" SELECT `BifMember`.`EventID`, " + 
						"     `BifMember`.`TeamID`, " + 
						"     `BifMember`.`GroupID`, " + 
						"     `BifMember`.`UserID`, " + 
						"     `BifEvent`.`EventName`, " + 
						"     `BifEvent`.`EventOpenTime`, " + 
						"     `BifEvent`.`EventCloseTime`, " + -
						"     `BifEvent`.`EventLocation` " + 
						" FROM `BifMember` ,`BifEvent` " + 
						" WHERE `BifMember`.`EventID` = '" + req.body.eventselect + "'" + 
						" AND   `BifMember`.`UserID` = '" + req.user.userid + "'" + 
						" AND   `BifMember`.`EventID` = `BifEvent`.`EventID` ;" ;
		//console.log(queryStr);

		var queryCallBack = function(resault) {
			//console.log("SQL result:" + resault);
			if ( resault[0] ) {
				req.session.userconfig.eventselected.eventid = req.body.eventselect;
				req.session.userconfig.eventselected.teamid = resault[0].TeamID;
				req.session.userconfig.eventselected.groupid = resault[0].GroupID;
			
				//console.log("[eventselect_info] UPDATE is OK!! : " + req.session.userconfig.eventselected.eventid);
				res.send("OK");
			} else {
				res.send("failed");
			}
		}
		dquery.get(queryStr, queryCallBack);
	};

	routesPOST['/quest_giveup'] = function(req, res) {
		var circleID = req.body.CircleID;
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_groupid = req.session.userconfig.eventselected.groupid ;
		var r_teamroom = req.session.userconfig.eventselected.eventid + "_" + req.session.userconfig.eventselected.teamid ;
		
		var queryStr = "INSERT INTO `FifTransferLog`" +
			"(`Status`," +
			"`UserID`," +
			"`UserName`," +
			"`GroupID`," +
			"`TeamID`," +
			"`EventID`," +
			"`CircleID`," +
			"`Info`," +
			"`GoodsStatus`)" +
			" VALUES ";
		queryStr = queryStr + "('GV'," +
			"'" + req.user.userid + "'," +
			"'" + req.user.usernickname + "'," +
			"'" + r_groupid + "'," +
			"'" + r_teamid + "'," +
			"'" + r_eventid + "'," +
			"'" + circleID + "'," +
			"'" + circleID + "'," +
			"'OK');";
		console.log(queryStr);
		var queryGiveUpStr = "UPDATE FifQuestCircle SET CircleStatus = 'GV' " +
			" WHERE `FifQuestCircle`.`EventID` =  '" + r_eventid + "'" +
			" AND `FifQuestCircle`.`TeamID` =  '" + r_teamid + "'" +
			" AND `FifQuestCircle`.`CircleID` = '" + circleID + "'; "
			//console.log(queryStr);

		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		dquery.put(queryStr, function(result) {
			console.log("[QUEST_GIVEUP] INSERT is OK!!");
		})
		dquery.put(queryGiveUpStr, function(result) {
			console.log("[QUEST_GIVEUP] UPDATE is OK!!");
			
			var msg = req.user.usernickname
					+ ' 放弃了 ' + req.body.CircleLocation
					+ " " + req.body.CircleName + " 的任务。";
			insertMsg(r_eventid, r_teamid, msg);
			//self.io.to(r_teamroom).emit('chat message', req.user.usernickname
			//							+ ' 放弃了 ' + req.body.CircleLocation
			//							+ " " + req.body.CircleName + " 的任务。");
			res.send("已放弃任务!");
		})
	};
	//suica
	routesPOST['/csv_process'] = function(req, res) {
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		//提取信息
		console.log("[csv_process] DATA");
		var data = JSON.parse(req.body.data); //str -> array

		//sql语句存储变量声明
		var queryINSERT_REQUIREMENT = "";
		var queryDELETE = " DELETE FROM `BifQuestMemberIF` " + 
						" WHERE `BifQuestMemberIF`.`IFType` = 'CTL' " + 
						" AND `BifQuestMemberIF`.`EventID` = '" + req.session.userconfig.eventselected.eventid + "' " + 
						" AND `BifQuestMemberIF`.`TeamID` = '" + req.session.userconfig.eventselected.teamid + "' " + 
						" AND `BifQuestMemberIF`.`GroupID` = '" + req.session.userconfig.eventselected.groupid + "' " + 
						" AND `BifQuestMemberIF`.`RequesterID` = '" + req.user.userid + "'; "

		for (var p in data) {
			var result = new csv(data[p]).parse()
			var circlelocation = result[0][7] + result[0][8];
			var circlename = result[0][10];
			if (result[0][17]) {
				try {
					var requirement = JSON.parse(result[0][17]);
				} catch (e) {
					console.log("[csv_process] " + result[0][10] + ":该社团转化JSON失败！目标内容:" + result[0][17]);
					continue;
				}
				var countgoodsid = 0 ;
				for (var x in requirement) {
					var goodsid ;
					countgoodsid = countgoodsid + 1 ;
					if ( countgoodsid < 10) {
						goodsid = "0" + countgoodsid ;
					} else {
						goodsid = countgoodsid ;
					}
					queryINSERT_REQUIREMENT += "INSERT INTO `BifQuestMemberIF` " +
						"(" +
						"`IFType`," +
						"`EventID`," +
						"`TeamID`," +
						"`GroupID`," +
						"`TempCircleID`," +
						"`CircleLocation`," +
						"`CircleName`," +
						"`TempGoodsID`," +
						"`GoodsName`," +
						"`GoodsPrice`," +
						"`RequesterID`," +
						"`RequestNum`)" +
						" VALUES " +
						"( " +
						"'CTL'," +
						"'" + req.session.userconfig.eventselected.eventid + "'," +
						"'" + req.session.userconfig.eventselected.teamid + "'," +
						"'" + req.session.userconfig.eventselected.groupid + "'," +
						"'" + result[0][1] + "'," +
						"'" + circlelocation + "'," +
						"'" + circlename + "'," +
						"'" + goodsid + "'," +
						"'" + requirement[x]['GoodsName' + x] + "'," +
						"'" + requirement[x]['GoodsPrice' + x] + "'," +
						"'" + req.user.userid + "'," +
						///数量対応忘れな
						"'" + "1" + "');" + "\r\n";
				}
			} else {
				res.send(result[0][10] + ":enormous epic great big change!出现意外错误，请联系兔子确认!");
			}
		};

		var sql_delete = function exe_queryDELETE() {
			console.log("[csv_process] DELETE OK!");
			console.log("[csv_process] SQL:" + queryDELETE);
			dquery.put(queryDELETE, exe_queryINSERT_REQUIREMENT);
		};

		var exe_queryINSERT_REQUIREMENT = function(result1) {
			dquery.put(queryINSERT_REQUIREMENT, function return_insert_result(result2) {
				console.log("[csv_process] SQL:" + queryINSERT_REQUIREMENT);
				console.log("[csv_process] INSERT OK!");
				res.send("似乎并没有啥问题w!");
			});
		}

		sql_delete();

	};
	
	routesPOST['/quest/circle/create'] = function(req, res) {
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_groupid = req.session.userconfig.eventselected.groupid ;
		var CircleLocation = req.body.CircleLocation;
		var CircleName = req.body.CircleName;
		var CircleWeb = req.body.CircleWeb;
		
		var queryCheckStr = " SELECT count(*) AS NUM " + 
							" FROM `BifQuestCircle` " + 
							" WHERE `BifQuestCircle`.EventID = '" + r_eventid + "' " + 
							" AND `BifQuestCircle`.TeamID = '" + r_teamid + "' " + 
							" AND `BifQuestCircle`.CircleLocation = '" + CircleLocation + "' " + 
							" AND `BifQuestCircle`.CircleName = '" + CircleName + "'; " ;
							
		var queryStr = " INSERT INTO `BifQuestCircle` " + 
						" (`EventID`, " + 
						" `TeamID`, " + 
						" `CircleID`, " + 
						" `CircleLocation`, " + 
						" `CircleName`, " + 
						" `CircleWeb`, " + 
						" `CreateTime`) " + 
						" SELECT " + r_eventid + ", " + 
						" 	" + r_teamid + ", " + 
						" 	IFNULL(max(`BifQuestCircle`.CircleID) + 1,'100001'), " + 
						" 	'" + CircleLocation + "', " + 
						" 	'" + CircleName + "', " + 
						" 	'" + CircleWeb + "', " + 
						" 	now() " + 
						" FROM `BifQuestCircle` " + 
						" WHERE `BifQuestCircle`.EventID = '" + r_eventid + "' " + 
						" AND `BifQuestCircle`.TeamID = '" + r_teamid + "'; ";
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		dquery.get(queryCheckStr, function(result) {
			if ( req.session.userconfig.eventselected.eventid == null ||
					result[0].NUM != 0 ) {
				res.send("Check your input!");
			} else {
				dquery.put(queryStr, function(result) {
					console.log("[quest/circle/create] INSERT is OK!!");
					res.send("似乎并没有啥问题w!");
				})
			}
		})
	};
	
	routesPOST['/quest/circle/update'] = function(req, res) {
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_circleid = req.body.circleid;
		var r_circlelocation = req.body.circlelocation;
		var r_circlename = req.body.circlename;
		var r_circleweb = req.body.circleweb;
		
		var r_version = req.body.version;
		var r_updatetime = req.body.updatetime;
		var r_createtime = req.body.createtime;
		
		var queryStr = " UPDATE `BifQuestCircle` " + 
						" SET " + 
						" `CircleLocation` = '" + r_circlelocation + "', " + 
						" `CircleName` = '" + r_circlename + "', " + 
						" `CircleWeb` = '" + r_circleweb + "', " + 
						" `Version` = `Version` + 1 " + 
						" WHERE `EventID` = '" + r_eventid + "'  " + 
						" AND `TeamID` = '" + r_teamid + "' " + 
						" AND `CircleID` = '" + r_circleid + "' " + 
						" AND `Version` = '" + r_version + "' " + 
						" AND `UpdateTime` = STR_TO_DATE('" + r_updatetime + "', GET_FORMAT(DATETIME,'JIS')) " + 
						" AND `CreateTime` = STR_TO_DATE('" + r_createtime + "', GET_FORMAT(DATETIME,'JIS')); " ;
		//console.log(queryStr);
		dquery.put(queryStr, function(result) {
			//console.log("[/quest/circle/update] UPDATE is OK!!");
			res.send("似乎并没有啥问题w!");
		});
		
	};
	
	routesPOST['/quest/circle/delete'] = function(req, res) {
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_circleid = req.body.circleid;
		
		var r_version = req.body.version;
		var r_updatetime = req.body.updatetime;
		var r_createtime = req.body.createtime;
		
		var queryCheckStr = " SELECT COUNT(*) AS Num " + 
							" FROM `BifQuestGoods` " + 
							" WHERE `BifQuestGoods`.`EventID` = '" + r_eventid + "' " + 
							" AND `BifQuestGoods`.`TeamID` = '" + r_teamid + "' " + 
							" AND `BifQuestGoods`.`CircleID` = '" + r_circleid + "'; " ;
		
		dquery.put(queryCheckStr, function(result) {
			if ( result[0].Num == 0 ) {
				var queryStr = "DELETE FROM `BifQuestCircle` " + 
							" WHERE `BifQuestCircle`.`EventID` = '" + r_eventid + "' " + 
							" AND `BifQuestCircle`.`TeamID` = '" + r_teamid + "' " + 
							" AND `BifQuestCircle`.`CircleID` = '" + r_circleid + "' " + 
							" AND `BifQuestCircle`.`Version` = '" + r_version + "' " + 
							" AND `BifQuestCircle`.`UpdateTime` = STR_TO_DATE('" + r_updatetime + "', GET_FORMAT(DATETIME,'JIS')) " + 
							" AND `BifQuestCircle`.`CreateTime` = STR_TO_DATE('" + r_createtime + "', GET_FORMAT(DATETIME,'JIS')); " ;
				//console.log(queryStr);
				dquery.put(queryStr, function(result) {
					//console.log("[/quest/circle/delete] UPDATE is OK!!");
					res.send("似乎并没有啥问题w!");
				});
			} else {
 				res.send("这个社团尚存在目标颁布物!你无法删除它！");
 			}
		});
		
	};
	
	routesPOST['/quest/circle/goods'] = function(req, res) {
		var s_eventid = req.session.userconfig.eventselected.eventid ;
		var s_teamid = req.session.userconfig.eventselected.teamid ;
		var s_circleid = req.body.circleid ;
		var s_userid = req.user.userid ;
		
		var queryCircleStr = " SELECT `BifQuestCircle`.`EventID`, " + 
								" 	`BifQuestCircle`.`TeamID`, " + 
								" 	`BifQuestCircle`.`CircleID`, " + 
								" 	`BifQuestCircle`.`CircleLocation`, " + 
								" 	`BifQuestCircle`.`CircleName`, " + 
								" 	`BifQuestCircle`.`CircleWeb`, " + 
								" 	`BifQuestCircle`.`Version`, " + 
								" 	DATE_FORMAT(`BifQuestCircle`.`UpdateTime`, GET_FORMAT(DATETIME,'JIS')) AS UpdateTime," + 
								" 	DATE_FORMAT(`BifQuestCircle`.`CreateTime`, GET_FORMAT(DATETIME,'JIS')) AS CreateTime" + 
								" FROM `BifQuestCircle` " + 
								" WHERE `BifQuestCircle`.`EventID` = '" + s_eventid + "' " + 
								" AND `BifQuestCircle`.`TeamID` = '" + s_teamid + "' " + 
								" AND `BifQuestCircle`.`CircleID` = '" + s_circleid + "'; " ;
		//console.log(queryCircleStr);
		var queryGoodsStr = " SELECT `BifQuestGoods`.`EventID`, " + 
						" 	`BifQuestGoods`.`TeamID`, " + 
						" 	`BifQuestGoods`.`CircleID`, " + 
						" 	`BifQuestCircle`.`CircleLocation`, " + 
						" 	`BifQuestCircle`.`CircleName`, " + 
						" 	`BifQuestCircle`.`CircleWeb`, " + 
						" 	`BifQuestGoods`.`GoodsID`, " + 
						" 	`BifQuestGoods`.`GoodsName`, " + 
						" 	`BifQuestGoods`.`GoodsPrice`, " + 
						" 	IFNULL( (SELECT `BifQuestMember`.`RequestNum` " + 
						" 		FROM `BifQuestMember` " + 
						" 		WHERE `BifQuestMember`.`EventID` = `BifQuestGoods`.`EventID` " + 
						" 		AND `BifQuestMember`.`TeamID` = `BifQuestGoods`.`TeamID` " + 
						" 		AND `BifQuestMember`.`CircleID` = `BifQuestGoods`.`CircleID` " + 
						" 		AND `BifQuestMember`.`GoodsID` = `BifQuestGoods`.`GoodsID` " + 
						" 		AND `BifQuestMember`.`RequesterID` = '" + s_userid + "' " + 
						" 	), 0) AS MyNum, " + 
						" 	IFNULL( (SELECT sum(`BifQuestMember`.`RequestNum`) " + 
						" 		FROM `BifQuestMember` " + 
						" 		WHERE `BifQuestMember`.`EventID` = `BifQuestGoods`.`EventID` " + 
						" 		AND `BifQuestMember`.`TeamID` = `BifQuestGoods`.`TeamID` " + 
						" 		AND `BifQuestMember`.`CircleID` = `BifQuestGoods`.`CircleID` " + 
						" 		AND `BifQuestMember`.`GoodsID` = `BifQuestGoods`.`GoodsID` " + 
						" 	), 0) AS TotalNum, " + 
						" 	`BifQuestGoods`.`Version`, " + 
						" 	DATE_FORMAT(`BifQuestGoods`.`UpdateTime`, GET_FORMAT(DATETIME,'JIS')) AS UpdateTime, " + 
						" 	DATE_FORMAT(`BifQuestGoods`.`CreateTime`, GET_FORMAT(DATETIME,'JIS')) AS CreateTime " + 
						" FROM `BifQuestGoods`, `BifQuestCircle` " + 
						" WHERE `BifQuestGoods`.`EventID` = '" + s_eventid + "' " + 
						" AND `BifQuestGoods`.`TeamID` = '" + s_teamid + "' " + 
						" AND `BifQuestGoods`.`CircleID` = '" + s_circleid + "' " + 
						" AND `BifQuestGoods`.`EventID` = `BifQuestCircle`.`EventID` " + 
						" AND `BifQuestGoods`.`TeamID` = `BifQuestCircle`.`TeamID` " + 
						" AND `BifQuestGoods`.`CircleID` = `BifQuestCircle`.`CircleID`; " ;
		//console.log(queryGoodsStr);
		var queryStr = queryCircleStr + queryGoodsStr;
		res.setHeader('Content-Type', 'application/json');
		var queryCallBack = function(resault) {
			//console.log("SQL result:" + resault);
			res.send(resault);
		}
		dquery.get(queryStr, queryCallBack);
	};
	
	routesPOST['/quest/circle/goods/create'] = function(req, res) {
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_circleid = req.body.circleid;
		var r_goodsname = req.body.goodsname;
		var r_goodsprice = req.body.goodsprice;
		
		var queryCheckStr = " SELECT count(*) AS NUM " + 
							" FROM `BifQuestGoods` " + 
							" WHERE `BifQuestGoods`.EventID = '" + r_eventid + "' " + 
							" AND `BifQuestGoods`.TeamID = '" + r_teamid + "' " + 
							" AND `BifQuestGoods`.CircleID = '" + r_circleid + "' " + 
							" AND `BifQuestGoods`.GoodsName = '" + r_goodsname + "' " + 
							" AND `BifQuestGoods`.GoodsPrice = '" + r_goodsprice + "'; " ;
		//console.log(queryCheckStr);
		
		var queryStr = " INSERT INTO `BifQuestGoods` " + 
						" (`EventID`, " + 
						" `TeamID`, " + 
						" `CircleID`, " + 
						" `GoodsID`, " + 
						" `GoodsName`, " + 
						" `GoodsPrice`, " + 
						" `CreateTime`) " + 
						" SELECT " + r_eventid + ", " + 
						" 			" + r_teamid + ", " + 
						" 			" + r_circleid + ", " + 
						" 			IFNULL(max(`BifQuestGoods`.GoodsID) + 1,'11'), " + 
						"			'" + r_goodsname + "', " + 
						" 			'" + r_goodsprice + "', " + 
						" now() " + 
						" FROM `BifQuestGoods` " + 
						" WHERE `BifQuestGoods`.EventID = '" + r_eventid + "' " + 
						" AND `BifQuestGoods`.TeamID = '" + r_teamid + "' " + 
						" AND `BifQuestGoods`.CircleID = '" + r_circleid + "'; " ;
		//console.log(queryStr);
		
		dquery.get(queryCheckStr, function(result) {
			if ( req.session.userconfig.eventselected.eventid == null ||
					result[0].NUM != 0 ) {
				res.send("Check your input!");
			} else {
				dquery.put(queryStr, function(result) {
					//console.log("[/quest/circle/goods/create] INSERT is OK!!");
					res.send("似乎并没有啥问题w!");
				})
			}
		})
	};
	
	routesPOST['/quest/circle/goods/update'] = function(req, res) {
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_circleid = req.body.circleid;
		var r_goodsid = req.body.goodsid;
		var r_goodsname = req.body.goodsname;
		var r_goodsprice = req.body.goodsprice;
		
		var r_version = req.body.version;
		var r_updatetime = req.body.updatetime;
		var r_createtime = req.body.createtime;
		
		var queryStr = " UPDATE `BifQuestGoods` " + 
						" SET " + 
						" `GoodsName` = '" + r_goodsname + "', " + 
						" `GoodsPrice` = '" + r_goodsprice + "' " + 
						" WHERE `EventID` = '" + r_eventid + "'  " + 
						" AND `TeamID` = '" + r_teamid + "' " + 
						" AND `CircleID` = '" + r_circleid + "' " + 
						" AND `GoodsID` = '" + r_goodsid + "' " + 
						" AND `Version` = '" + r_version + "' " + 
						" AND `UpdateTime` = STR_TO_DATE('" + r_updatetime + "', GET_FORMAT(DATETIME,'JIS')) " + 
						" AND `CreateTime` = STR_TO_DATE('" + r_createtime + "', GET_FORMAT(DATETIME,'JIS')); " ;
		//console.log(queryStr);
		
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		dquery.put(queryStr, function(result) {
			//console.log("[/quest/circle/goods/update] UPDATE is OK!!");
			res.send("似乎并没有啥问题w!");
		})
	};
	
	routesPOST['/quest/circle/goods/delete'] = function(req, res) {
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_userposition = req.session.userconfig.eventselected.userposition ;
		var r_circleid = req.body.circleid;
		var r_goodsid = req.body.goodsid;
		
		var r_version = req.body.version;
		var r_updatetime = req.body.updatetime;
		var r_createtime = req.body.createtime;
		
		var queryCheckStr = " SELECT COUNT(*) AS Num " + 
							" FROM `BifQuestMember` " + 
							" WHERE `BifQuestMember`.`EventID` = '" + r_eventid + "' " + 
							" AND `BifQuestMember`.`TeamID` = '" + r_teamid + "' " + 
							" AND `BifQuestMember`.`CircleID` = '" + r_circleid + "' " + 
							" AND `BifQuestMember`.`GoodsID` = '" + r_goodsid + "'; " ;
		
		dquery.put(queryCheckStr, function(result) {
			if ( result[0].Num != 0 && r_userposition == 'Owner' ) {
				var queryStr = "DELETE FROM `BifQuestMember` " + 
							" WHERE `BifQuestMember`.`EventID` = '" + r_eventid + "' " + 
							" AND `BifQuestMember`.`TeamID` = '" + r_teamid + "' " + 
							" AND `BifQuestMember`.`CircleID` = '" + r_circleid + "' " + 
							" AND `BifQuestMember`.`GoodsID` = '" + r_goodsid + "'; ";
				//console.log(queryStr);
				dquery.put(queryStr, function(result) {
					res.send("你动用管理员权限删除了这件物品的所有需求。再进行一次删除将完全删除该物品。");
				});
			} else if ( result[0].Num == 0 ) {
				var queryStr = "DELETE FROM `BifQuestGoods` " + 
							" WHERE `BifQuestGoods`.`EventID` = '" + r_eventid + "' " + 
							" AND `BifQuestGoods`.`TeamID` = '" + r_teamid + "' " + 
							" AND `BifQuestGoods`.`CircleID` = '" + r_circleid + "' " + 
							" AND `BifQuestGoods`.`GoodsID` = '" + r_goodsid + "' " + 
							" AND `BifQuestGoods`.`Version` = '" + r_version + "' " + 
							" AND `BifQuestGoods`.`UpdateTime` = STR_TO_DATE('" + r_updatetime + "', GET_FORMAT(DATETIME,'JIS')) " + 
							" AND `BifQuestGoods`.`CreateTime` = STR_TO_DATE('" + r_createtime + "', GET_FORMAT(DATETIME,'JIS')); " ;
				//console.log(queryStr);
				dquery.put(queryStr, function(result) {
					//console.log("[/quest/circle/goods/delete] UPDATE is OK!!");
					res.send("似乎并没有啥问题w!");
				});
			} else {
 				res.send("有人正需求这件物品!你无法删除它！");
 			}
		});
		
	};
	
	routesPOST['/quest/circle/goods/request'] = function(req, res) {
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		
		var r_eventid = req.session.userconfig.eventselected.eventid ;
		var r_teamid = req.session.userconfig.eventselected.teamid ;
		var r_circleid = req.body.circleid;
		var r_goodsid = req.body.goodsid;
		var r_goodsquest = req.body.goodsquest;
		var r_userid = req.user.userid ;
		
		var queryCheckStr = " SELECT COUNT(*) AS Num " + 
							" FROM `BifQuestMember` " + 
							" WHERE `BifQuestMember`.`EventID` = '" + r_eventid + "' " + 
							" AND `BifQuestMember`.`TeamID` = '" + r_teamid + "' " + 
							" AND `BifQuestMember`.`CircleID` = '" + r_circleid + "' " + 
							" AND `BifQuestMember`.`GoodsID` = '" + r_goodsid + "' " + 
							" AND `BifQuestMember`.`RequesterID` = '" + r_userid + "'; " ;
		
		var queryStr = ""
		dquery.put(queryCheckStr, function(result) {
			if ( result[0].Num == 0 && r_goodsquest > 0 ) {
				// insert
				queryStr = " INSERT INTO `BifQuestMember` " + 
								" (`EventID`, " + 
								" `TeamID`, " + 
								" `CircleID`, " + 
								" `GoodsID`, " + 
								" `RequesterID`, " + 
								" `RequestNum`, " + 
								" `CreateTime`) " + 
								" VALUES (" + 
								"'" + r_eventid + "', " + 
								"'" + r_teamid + "', " + 
								"'" + r_circleid + "', " + 
								"'" + r_goodsid + "', " + 
								"'" + r_userid + "', " + 
								"'" + r_goodsquest + "', " + 
								" now() ); " ;
			} else if ( result[0].Num > 0 && r_goodsquest == 0 ){
				// delete
				queryStr = "DELETE FROM `BifQuestMember` " + 
							" WHERE `BifQuestMember`.`EventID` = '" + r_eventid + "' " + 
							" AND `BifQuestMember`.`TeamID` = '" + r_teamid + "' " + 
							" AND `BifQuestMember`.`CircleID` = '" + r_circleid + "' " + 
							" AND `BifQuestMember`.`GoodsID` = '" + r_goodsid + "' " + 
							" AND `BifQuestMember`.`RequesterID` = '" + r_userid + "'; " ;
			} else if ( result[0].Num > 0 && r_goodsquest > 0 ){
				// update
				queryStr = "UPDATE `BifQuestMember` " + 
							" SET `BifQuestMember`.`RequestNum` = '" + r_goodsquest + "' " + 
							" WHERE `BifQuestMember`.`EventID` = '" + r_eventid + "' " + 
							" AND `BifQuestMember`.`TeamID` = '" + r_teamid + "' " + 
							" AND `BifQuestMember`.`CircleID` = '" + r_circleid + "' " + 
							" AND `BifQuestMember`.`GoodsID` = '" + r_goodsid + "' " + 
							" AND `BifQuestMember`.`RequesterID` = '" + r_userid + "'; " ;
 			} else {
 				res.send("ERROR!");
 			}
			//console.log(queryStr);
			
			dquery.put(queryStr, function(result) {
				//console.log("[/quest/circle/goods/request] UPDATE is OK!!");
				res.send("似乎并没有啥问题w!");
			})
 		
		})
	};
	
	routesGET['/battle/quest/task'] = require('./battle_quest_task.js')(dquery);
	routesGET['/battle/quest/sister'] = require('./battle_quest_sister.js')(world);
	
	routesPOST['/quest/task'] = require('./quest_task.js')(dquery);
		routesPOST['/quest/task/add'] = require('./quest_task_add.js')(dquery);
		routesPOST['/quest/task/delete'] = require('./quest_task_delete.js')(dquery);
		routesPOST['/quest/task/update'] = require('./quest_task_update.js')(dquery);
	routesGET['/quest/team/delete'] = require('./quest_team_delete_null.js')(world);
	routesPOST['/quest/self/upload'] = require('./quest_self_upload.js')(world);
		routesGET['/quest/self/delete'] = require('./quest_self_delete.js')(world);
	routesGET['/team/mission/view'] = require('./team_mission_view.js')(world);
		routesPOST['/team/mission/create'] = require('./team_mission_create.js')(world);
		routesPOST['/team/mission/delete'] = require('./team_mission_delete.js')(world);
		routesPOST['/team/mission/update'] = require('./team_mission_update.js')(world);
	routesPOST['/team/mission/detail/view'] = require('./team_mission_detail_view.js')(world);
		routesPOST['/team/mission/detail/view/panel'] = require('./team_mission_detail_view_panel.js')(world);
	routesPOST['/team/mission/detail/create'] = require('./team_mission_detail_create.js')(world);
		
	routesPOST['/package/lock'] = require('./package_lock.js')(world);
	routesPOST['/package/unlock'] = require('./package_unlock.js')(world);
		
	routesGET['/team/view'] = require('./team_view.js')(dquery);
	routesGET['/team/view/plus'] = require('./team_view_plus.js')(dquery);
		routesPOST['/team/select'] = require('./team_select.js')(dquery);
		routesPOST['/team/create'] = require('./team_create.js')(dquery);
		routesGET['/team/delete'] = require('./team_delete.js')(dquery);
			routesGET['/team/member/view'] = require('./team_member_view.js')(dquery);
	
	routesPOST['/team/apply/new'] = require('./team_apply_new.js')(dquery);
	routesGET['/team/apply/send'] = require('./team_apply_send.js')(dquery);
	routesGET['/team/apply/recive'] = require('./team_apply_recive.js')(dquery);
	routesPOST['/team/apply/yes'] = require('./team_apply_yes.js')(dquery);
		
	routesGET['/event/view'] = require('./event_view.js')(dquery);
	
	routesOPENGET['/public/eventinfo'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('public_eventinfo.html'));
	};
	routesOPENGET['/public/menuinfo'] = function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('public_menuinfo.html'));
	};
	routesOPENGET['/public/event/select'] = require('./public_eventinfo.js')(world);
	routesOPENGET['/public/menuinfo/:target'] = require('./public_menuinfo.js')(world);
	////验证类型POST End
	//HTTP POST部分 End

	//身份校验用
	function requiredAuthentication(req, res, next) {
		if ( req.user ) {
			next();
		} else {
			req.session.error = 'Access denied!';
			res.redirect('/login');
		}
	}

	//  Add handlers for the app (from the routes).
	for (var r in routesGET) {
		self.app.get(r, requiredAuthentication, routesGET[r]);
		//self.app.get(r, routesGET[r]);
	}

	// routes for Post
	for (var r in routesPOST) {
		self.app.post(r, requiredAuthentication, routesPOST[r]);
		//self.app.post(r, routesPOST[r]);
	}

	// routes for OPENGET
	for (var r in routesOPENGET) {
		self.app.get(r, routesOPENGET[r]);
	}

	// routes for OPENPOST
	for (var r in routesOPENPOST) {
		self.app.post(r, routesOPENPOST[r]);
	}
}
