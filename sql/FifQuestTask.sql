DROP TABLE IF EXISTS FifQuestTask;
CREATE TABLE `FifQuestTask` (
  `EventID` char(10) NOT NULL,
  `TeamID` char(6) NOT NULL,
  `UserID` char(7) NOT NULL,
  `CircleID` char(6) NOT NULL,
  `Level` int(1) NOT NULL,
  `Version` int(11) NOT NULL DEFAULT '0',
  `UpdateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `CreateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`EventID`,`TeamID`,`UserID`,`CircleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
