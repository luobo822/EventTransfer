DROP TABLE IF EXISTS BifCatalogCSV;
CREATE TABLE `BifCatalogCSV` (
  `EventID` char(10) NOT NULL DEFAULT '2015052401',
  `TeamID` char(6) NOT NULL DEFAULT '110001',
  `GroupID` char(2) NOT NULL DEFAULT '11',
  `CircleID` char(6) DEFAULT NULL,
  `CircleLocation` varchar(10) NOT NULL,
  `CircleName` varchar(30) NOT NULL,
  `GoodsID` char(2) DEFAULT NULL,
  `GoodsName` varchar(50) NOT NULL,
  `GoodsPrice` varchar(10) NOT NULL,
  `UserID` char(7) DEFAULT '1000000',
  `UserName` varchar(20) NOT NULL,
  PRIMARY KEY (`EventID`,`GoodsName`,`TeamID`,`GroupID`,`CircleLocation`,`CircleName`,`UserName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
