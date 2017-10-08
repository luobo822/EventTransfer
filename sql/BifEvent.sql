DROP TABLE IF EXISTS BifEvent;
CREATE TABLE BifEvent (
  `EventID` char(10) NOT NULL,
  `EventName` char(45) NOT NULL,
  `EventOpenTime` char(10),
  `EventCloseTime` char(10),
  `EventLocation` char(50),
  `EventIsAlive` char(1),
  PRIMARY KEY (`EventID`)
)CHARSET=utf8;