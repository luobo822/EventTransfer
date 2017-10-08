DROP TABLE IF EXISTS BifQuestMember;
CREATE TABLE `BifQuestMember` (
  `EventID` char(10) NOT NULL,
  `TeamID` char(6) NOT NULL,
  `CircleID` char(6) NOT NULL,
  `GoodsID` char(2) NOT NULL,
  `RequesterID` char(7) NOT NULL,
  `RequestNum` int(11) NOT NULL,
  `Version` tinyint(3) NOT NULL DEFAULT '0',
  `UpdateTime` timestamp NOT NULL DEFAULT '0000-00-00 00\:00\:00' ON UPDATE CURRENT_TIMESTAMP,
  `CreateTime` timestamp NOT NULL DEFAULT '0000-00-00 00\:00\:00',
  PRIMARY KEY (`EventID`,`TeamID`,`CircleID`,`GoodsID`,`RequesterID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;