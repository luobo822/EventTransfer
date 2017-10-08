DROP TABLE IF EXISTS BifGroup;
CREATE TABLE BifGroup (
  `EventID` char(10) NOT NULL,
  `TeamID` char(6) NOT NULL,
  `GroupID` char(2) NOT NULL,
  `GroupName` char(24) NOT NULL,
  PRIMARY KEY (`EventID`,`TeamID`,`GroupID`)
)CHARSET=utf8;