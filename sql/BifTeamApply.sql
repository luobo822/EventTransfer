DROP TABLE IF EXISTS BifTeamApply;
CREATE TABLE `BifTeamApply` (
  `EventID` char(10) NOT NULL,
  `TeamID` char(6) NOT NULL,
  `UserID` char(7) NOT NULL,
  `ApproverID` char(7),
  `Status` char(2) NOT NULL,
  `Version` int(11) NOT NULL DEFAULT '0',
  `UpdateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `CreateTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`EventID`,`TeamID`,`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
