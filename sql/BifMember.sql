DROP TABLE IF EXISTS BifMember;
CREATE TABLE `BifMember` (
  `EventID` char(10) NOT NULL,
  `TeamID` char(6) NOT NULL,
  `GroupID` char(2) NOT NULL,
  `UserID` char(7) NOT NULL,
  `UserPosition` char(15) NOT NULL,
  PRIMARY KEY (`EventID`,`TeamID`,`GroupID`,`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
