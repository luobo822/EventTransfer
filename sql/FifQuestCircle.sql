DROP TABLE IF EXISTS FifQuestCircle;
CREATE TABLE `FifQuestCircle` (
  `EventID` char(10) NOT NULL,
  `TeamID` char(6) NOT NULL,
  `GroupID` char(2) NOT NULL,
  `CircleID` char(6) NOT NULL,
  `CircleLocation` varchar(10) NOT NULL,
  `CircleName` varchar(30) NOT NULL,
  `CircleWeb` varchar(120) DEFAULT NULL,
  `CircleStatus` char(2) NOT NULL DEFAULT 'ST',
  `LockerID` char(7),
  `Version` int(11) NOT NULL DEFAULT '0',
  `UpdateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `CreateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`EventID`,`TeamID`,`GroupID`,`CircleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;