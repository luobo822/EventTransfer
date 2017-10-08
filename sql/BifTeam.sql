DROP TABLE IF EXISTS BifTeam;
CREATE TABLE `BifTeam` (
  `EventID` char(10) NOT NULL,
  `TeamID` char(6) NOT NULL,
  `TeamName` char(50) NOT NULL,
  `QuestLock` char(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`EventID`,`TeamID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;