DROP TABLE IF EXISTS BifUser;
CREATE TABLE BifUser (
  `UserID` char(7) NOT NULL,
  `UserName` char(50) NOT NULL,
  `UserPassWord` char(20) NOT NULL,
  `UserNickName` char(20) NOT NULL,
  PRIMARY KEY (`UserID`)
)CHARSET=utf8;