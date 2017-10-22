DROP TABLE IF EXISTS BifMissionGroup;
CREATE TABLE BifMissionGroup (
  `EventID` char(10) NOT NULL,
  `TeamID` char(6) NOT NULL,
  `MissionGroupID` char(6) NOT NULL,
  `MissionGroupName` char(24) NOT NULL,
  `MissionGroupType` char(20) NOT NULL,
  `UserID` char(7) NOT NULL,
  `Version` int(11) NOT NULL DEFAULT '0',
  `UpdateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `CreateTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`EventID`,`TeamID`,`MissionGroupID`)
)CHARSET=utf8;