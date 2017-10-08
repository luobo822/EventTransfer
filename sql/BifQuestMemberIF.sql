DROP TABLE IF EXISTS BifQuestMemberIF;
CREATE TABLE `BifQuestMemberIF` (
  `IFType` char(3) NOT NULL,
  `EventID` char(10) NOT NULL,
  `TeamID` char(6) NOT NULL,
  `GroupID` char(2) NOT NULL,
  `TempCircleID` char(6) NOT NULL,
  `CircleLocation` varchar(10) NOT NULL,
  `CircleName` varchar(30) NOT NULL,
  `CircleWeb` varchar(120) DEFAULT NULL,
  `TempGoodsID` char(2) DEFAULT NULL,
  `GoodsName` varchar(50) NOT NULL,
  `GoodsPrice` varchar(10) NOT NULL DEFAULT '',
  `RequesterID` char(7) NOT NULL,
  `RequestNum` int(11) NOT NULL,
  `Version` int(11) NOT NULL DEFAULT '0',
  `UpdateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `CreateTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`IFType`,`EventID`,`TeamID`,`GroupID`,`CircleLocation`,`CircleName`,`GoodsName`,`GoodsPrice`,`RequesterID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;