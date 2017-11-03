DROP TABLE IF EXISTS BifMissionGroupDetail;
CREATE TABLE BifMissionGroupDetail (
  `EventID` char(10) NOT NULL,
  `TeamID` char(6) NOT NULL,
  `MissionGroupID` char(3) NOT NULL,
  `DetailID` char(3) NOT NULL,
  `CircleID` char(6) NOT NULL,
  `Level` char(2) NOT NULL,
  `Version` int(11) NOT NULL DEFAULT '0',
  `UpdateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `CreateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`EventID`,`TeamID`,`MissionGroupID`,`DetailID`)
)CHARSET=utf8;