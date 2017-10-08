DROP TABLE IF EXISTS FifQuestMember;
CREATE TABLE `FifQuestMember` (
  `EventID` char(10) NOT NULL,
  `TeamID` char(6) NOT NULL,
  `GroupID` char(2) NOT NULL,
  `CircleID` char(6) NOT NULL,
  `CircleLocation` varchar(10) NOT NULL,
  `CircleName` varchar(30) NOT NULL,
  `CircleWeb` varchar(120) DEFAULT NULL,
  `GoodsID` char(2) NOT NULL,
  `GoodsName` varchar(50) NOT NULL,
  `GoodsPrice` varchar(10) DEFAULT NULL,
  `RequesterID` char(7) NOT NULL,
  `RequestNum` int(11) NOT NULL,
  `Version` int(11) NOT NULL DEFAULT '0',
  `UpdateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `CreateTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`EventID`,`TeamID`,`GroupID`,`CircleID`,`GoodsID`,`RequesterID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
