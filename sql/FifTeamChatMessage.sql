DROP TABLE IF EXISTS FifTeamChatMessage;
CREATE TABLE FifTeamChatMessage (
  `EventID` char(10) NOT NULL,
  `TeamID` char(6) NOT NULL,
  `MessageID` int(11) NOT NULL,
  `Message` char(150) ,
  `Version` int(11) NOT NULL DEFAULT '0',
  `UpdateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `CreateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`EventID`,`TeamID`,`MessageID`)
)CHARSET=utf8;