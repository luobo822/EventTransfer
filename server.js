#!/bin/env node

// OpenShift sample Node application

var express = require('express')
var storeMemory = new express.session.MemoryStore();
var fs = require('fs')
var bodyParser = require('body-parser')
var populateCache = require('./routes/populateCache.js');
var image_cache = require('./image/image_cache.js');
var js_cache = require('./file/file_cache.js');
var routes = require('./routes/routes.js');

var passport = require('passport');
var inspect = require('util').inspect;
var crypto = require('crypto');
var cookies = require('cookie');

var dquery = require('./dbquery.js');

var Redis = require('ioredis');
var redis = new Redis(require('./redis.js'));

// サーバのアドレスとポート
//use env!!!
//Web Server
//var SERVER_IP = process.env.OPENSHIFT_NODEJS_IP;
//var SERVER_PORT = process.env.OPENSHIFT_NODEJS_PORT;
var SERVER_IP = '127.0.0.1';
var SERVER_PORT = '80';

/*  Define the sample application. */
var EventServer = function() {

	//  Scope.
	var self = this;
	self.passport = passport;


	/*  ================================================================  */
	/*  Helper functions.                                                 */
	/*  ================================================================  */

	/**
	 *  Set up server IP address and port # using env variables/defaults.
	 */
	self.setupVariables = function() {
		//  Set the environment variables we need.
		self.ipaddress = SERVER_IP;
		self.port = SERVER_PORT;

		if (typeof self.ipaddress === "undefined") {
			//  Log errors on OpenShift but continue w/ 127.0.0.1 - this
			//  allows us to run/test the app locally.
			console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
			self.ipaddress = "127.0.0.1";
			self.port = "80";
		};
	};


	/**
	 *  Populate the cache.
	 */
	self.populateCache = function() {
		if (typeof self.zcache === "undefined") {
			self.zcache = {
				'index.html': ''
			};
		}
		populateCache(fs, self.zcache);
		
		if (typeof self.imagecache === "undefined") {
			self.imagecache = {};
		}
		image_cache(fs, self.imagecache);
		
		
		if (typeof self.filecache === "undefined") {
			self.filecache = {};
		}
		js_cache(fs, self.filecache);
	};

	/**
	 *  Retrieve entry (content) from cache.
	 *  @param {string} key  Key identifying content to retrieve from cache.
	 */
	self.cache_get = function(key) {
		return self.zcache[key];
	};
	self.imagecache_get = function(key) {
		return self.imagecache[key];
	};
	self.filecache_get = function(key) {
		return self.filecache[key];
	};


	/**
	 *  terminator === the termination handler
	 *  Terminate server on receipt of the specified signal.
	 *  @param {string} sig  Signal to terminate on.
	 */
	self.terminator = function(sig) {
		if (typeof sig === "string") {
			console.log('%s: Received %s - terminating sample app ...',
				Date(Date.now()), sig);
			process.exit(1);
		}
		console.log('%s: Node server stopped.', Date(Date.now()));
	};


	/**
	 *  Setup termination handlers (for exit and a list of signals).
	 */
	self.setupTerminationHandlers = function() {
		//  Process on exit and signals.
		process.on('exit', function() {
			self.terminator();
		});

		// Removed 'SIGPIPE' from the list - bugz 852598.
		['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
			'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
		].forEach(function(element, index, array) {
			process.on(element, function() {
				self.terminator(element);
			});
		});
	};



	/*  ================================================================  */
	/*  App server functions (main app logic here).                       */
	/*  ================================================================  */


	/**
	 *  Initialize the server (express) and create the routes and register
	 *  the handlers.
	 */
	self.initializeServer = function() {
		self.app = express();
		
		self.app.use(bodyParser.json()); // for parsing application/json
		self.app.use(bodyParser.urlencoded({
			extended: true,
			limit: '1mb'
		})); // for parsing application/x-www-form-urlencoded


		self.app.configure(function() {
			self.app.use(express.static('public'));
 			self.app.use(express.cookieParser());
		
			self.app.use(express.bodyParser());
			
			self.app.use(express.session({secret:'secret',key:'connect.sid',store:storeMemory}));
			self.app.use(passport.initialize());
			self.app.use(passport.session());
			self.app.use(self.app.router);

		});
		//ajax跨域对应 Start
		self.app.use(function(req, res, next) {
			res.header("Access-Control-Allow-Origin", req.headers.origin);
			res.header("Access-Control-Allow-Credentials", true);
			res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
			res.header("Access-Control-Allow-Headers", "X-Requested-With, AUTHORIZATION");
			next();
		});
		//ajax跨域对应 End
		self.app.use(function(req, res, next) {
			var err = req.session.error,
				msg = req.session.success;
			delete req.session.error;
			delete req.session.success;
			res.locals.message = '';
			if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
			if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
			next();
		});
		
		
		self.socketio = require('http').createServer(self.app);
		self.io = require('socket.io').listen(self.socketio);
		
		self.io.use(function (socket,next) {
			var cookie = cookies.parse(socket.handshake.headers.cookie);
			var connect_sid = cookie['connect.sid'];
			if ( typeof connect_sid === "undefined") {
				socket.disconnect();
				return;
			}
			var sessionid = connect_sid.slice(2, connect_sid.indexOf('.'));
			var mac = connect_sid.slice(connect_sid.lastIndexOf('.') + 1);
			var check = crypto
						.createHmac('sha256', 'secret')
						.update(sessionid)
						.digest('base64')
						.replace(/\=+$/, '');
			if ( mac == check ) {
				//console.log(inspect(storeMemory));
				storeMemory.get(sessionid, function(error, session){
					if (error) {
						socket.disconnect();
 					} else {
 						//console.log(inspect(session))
 						if ( typeof(session) == "undefined" ) {
 							socket.disconnect();
 						} else {
							socket.request.session = session;
							next();
 						}
					}
				});
			} else {
				socket.disconnect();
			}
			
		});
		
		self.io.on('connection', function(socket){
			//console.log(inspect(socket.request.session)); 
			var session = socket.request.session;
			if ( typeof(session) == "undefined" ||
					typeof(session.passport) == "undefined" ||
					typeof(session.userconfig) == "undefined" ) {
 				socket.disconnect();
 				return null;
 			}
			var user = session.passport.user;
			var userID = user.userID;
			var userNickName = user.userNickName;
			var eventselected = session.userconfig.eventselected;
			var teamroom = eventselected.eventid + '_' + eventselected.teamid;
			//console.log(teamroom);
			socket.join(teamroom);
			
			var historyMsg = function(todo) {
				var historyStr = " SELECT `FifTeamChatMessage`.`EventID`, " + 
								" 	`FifTeamChatMessage`.`TeamID`, " + 
								" 	`FifTeamChatMessage`.`MessageID`, " + 
								" 	`FifTeamChatMessage`.`Message`, " + 
								" 	`FifTeamChatMessage`.`Version`, " + 
								" 	`FifTeamChatMessage`.`UpdateTime`, " + 
								" 	`FifTeamChatMessage`.`CreateTime` " + 
								" FROM `FifTeamChatMessage` " + 
								" WHERE `FifTeamChatMessage`.`EventID` = '" + eventselected.eventid + "' " + 
								" AND `FifTeamChatMessage`.`TeamID` = '" + eventselected.teamid + "' " + 
								" ORDER BY  `FifTeamChatMessage`.`MessageID` DESC " + 
								" LIMIT 10; " ;
				//console.log(historyStr);
				dquery.put(historyStr, function(result) {
					//console.log("SQL result:" + result);
					result.reverse();
					for( one in result) {
						todo(result[one].Message);
					}
				});
			};
			
			var insertMsg = function(msg, todo) {
				var insertStr = " INSERT INTO `FifTeamChatMessage` " + 
								" (`EventID`, " + 
								" `TeamID`, " + 
								" `MessageID`, " + 
								" `Message`, " + 
								" `Version`, " + 
								" `UpdateTime`, " + 
								" `CreateTime`) " + 
								" SELECT " + 
								" '" + eventselected.eventid + "', " + 
								" '" + eventselected.teamid + "', " + 
								" IFNULL(( " + 
								" 	SELECT max(`FifTeamChatMessage`.`MessageID`) + 1 " + 
								"     FROM `FifTeamChatMessage` " + 
								"     WHERE `EventID` = '" + eventselected.eventid + "' " + 
								"     AND `TeamID` = '" + eventselected.teamid + "' " + 
								" ),'1'), " + 
								" '" + msg + "', " + 
								" 0, " + 
								" now(), " + 
								" now(); ";
				//console.log(insertStr);
				dquery.put(insertStr, todo);
			};
			
			redis.get(teamroom, function (err, result) {
				result = JSON.parse(result);
				if ( result == null ) {
					result = {};
				}
				result[userID] = userNickName;
				redis.set(teamroom, JSON.stringify(result));
				
				self.io.to(teamroom).emit('online list', result);
				//console.log(JSON.stringify(result));
			});
			
			historyMsg(function(msg){
				self.io.to(teamroom).emit('chat message', {
					type : "history" ,
					msg : msg
				});
			});
			//self.io.to(teamroom).emit('chat message',{
			//	type : "new" ,
			//	msg : userNickName + ' has connected.'
			//});
			
			socket.on('chat message', function(msg){
				msg = userNickName + ' : ' + msg;
				insertMsg(msg, function(){
					self.io.to(teamroom).emit('chat message', {
						type : "new" ,
						msg : msg
					});
				});
			});
			
			socket.on('disconnect', function(){
				redis.get(teamroom, function (err, result) {
					result = JSON.parse(result);
					
					result[userID] = undefined;
					redis.set(teamroom, JSON.stringify(result));
					
					self.io.to(teamroom).emit('online list', result);
					//console.log(JSON.stringify(result));
				});
				//self.io.to(teamroom).emit('chat message',{
				//	type : "new" ,
				//	msg : userNickName + ' has disconnected.'
				//});
				socket.leave(teamroom);
			});
				
		});
	
		routes(self);
	};
	


	/**
	 *  Initializes the sample application.
	 */
	self.initialize = function() {
		self.setupVariables();
		self.populateCache();
		self.setupTerminationHandlers();

		// Create the express server and routes.
		self.initializeServer();
	};



	/**
	 *  Start the server (starts up the sample application).
	 */
	self.start = function() {
		//  Start the app on the specific interface (and port).
		self.socketio.listen(self.port, self.ipaddress, function() {
			console.log('%s: Node server started on %s:%d ...',
				Date(Date.now()), self.ipaddress, self.port);
		});
	};

}; /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var EventServerApp = new EventServer();
EventServerApp.initialize();
EventServerApp.start();