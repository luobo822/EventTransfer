DROP TABLE IF EXISTS FifTransferLog;
CREATE TABLE `FifTransferLog` (
  `MessageNo` bigint(20) NOT NULL AUTO_INCREMENT,
  `Status` char(2) NOT NULL,
  `UserID` char(7) NOT NULL,
  `UserName` varchar(20) NOT NULL,
  `EventID` char(10) NOT NULL,
  `CircleID` char(6) NOT NULL,
  `CircleLocation` varchar(10) NOT NULL,
  `CircleName` varchar(30) NOT NULL,
  `GoodsID` char(2) NOT NULL,
  `GoodsName` varchar(20) NOT NULL,
  `Num` int(11) NOT NULL,
  `GoodsStatus` char(2) NOT NULL,
  `UpdatePrice` int(11) DEFAULT NULL,
  `Info` varchar(40) DEFAULT NULL,
  `DeleteFlag` char(1) DEFAULT 'N',
  PRIMARY KEY (`MessageNo`)
) ENGINE=InnoDB AUTO_INCREMENT=2015051600001 DEFAULT CHARSET=utf8;
#DELETE FROM `FifTask`;#
UPDATE `FifQuestCircle` SET `CircleStatus` = 'ST';
UPDATE `FifQuest` SET `GoodsStatus` = 'OK';