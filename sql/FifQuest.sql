DROP TABLE IF EXISTS FifQuest;
CREATE TABLE `FifQuest` (
  `EventID` char(10) NOT NULL,
  `TeamID` char(6) NOT NULL,
  `GroupID` char(2) NOT NULL,
  `CircleID` char(6) NOT NULL,
  `CircleLocation` varchar(10) NOT NULL,
  `CircleName` varchar(30) NOT NULL,
  `GoodsID` char(2) NOT NULL,
  `GoodsName` varchar(50) NOT NULL,
  `GoodsPrice` varchar(10) NOT NULL,
  `Num` int(11) NOT NULL,
  `MisstionType` char(2) NOT NULL,
  `GoodsStatus` char(2) NOT NULL,
  `Version` int(11) NOT NULL DEFAULT '0',
  `UpdateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `CreateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP',
  PRIMARY KEY (`EventID`,`TeamID`,`GroupID`,`CircleID`,`GoodsID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

