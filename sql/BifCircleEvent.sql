DROP TABLE IF EXISTS BifCircleEvent;
CREATE TABLE `BifCircleEvent` (
  `EventID` char(10) NOT NULL,
  `CircleID` char(6) NOT NULL,
  `CircleLocation` varchar(10) NOT NULL,
  `CircleName` varchar(30) NOT NULL,
  `CircleWriter` char(2),
  `ProductListHttp` varchar(100) NOT NULL,
  PRIMARY KEY (`EventID`,`CircleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;