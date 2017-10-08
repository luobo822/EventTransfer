DROP TABLE IF EXISTS BifQuestGoods;
CREATE TABLE `BifQuestGoods` (
  `EventID` char(10) NOT NULL,
  `TeamID` char(6) NOT NULL,
  `CircleID` char(6) NOT NULL,
  `GoodsID` char(2) NOT NULL,
  `GoodsName` varchar(50) NOT NULL,
  `GoodsPrice` varchar(10) ,
  `Version` int NOT NULL DEFAULT '0',
  `UpdateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `CreateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`EventID`,`TeamID`,`CircleID`,`GoodsID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;