DROP TABLE IF EXISTS BifCircleEventGoods;
CREATE TABLE BifCircleEventGoods(
  `EventID` char(10) NOT NULL,
  `CircleID` char(6) NOT NULL,
  `GoodsID` char(2) NOT NULL,
  `GoodsName` varchar(20) NOT NULL,
  `GoodsPrice` varchar(10) NOT NULL,
  PRIMARY KEY (`EventID`,`CircleID`,`GoodsID`)
)CHARSET=utf8;