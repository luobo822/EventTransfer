DROP PROCEDURE IF EXISTS function_CreateNewTeam ;
DELIMITER //
CREATE PROCEDURE function_CreateNewTeam( IN eventid char(10),
	teamname char(50),
    groupname char(24),
    userid CHAR(7))
BEGIN
###################################################
DECLARE TempTeamID CHAR(6) DEFAULT '100000';

SELECT
    IFNULL(max(`BifTeam`.`TeamID`) + 1,'100000') INTO TempTeamID
FROM
	`BifTeam`
WHERE `BifTeam`.`EventID` = eventid;

INSERT INTO `BifTeam`
(`EventID`,
`TeamID`,
`TeamName`)
VALUES
(eventid,
TempTeamID,
teamname);

INSERT INTO `BifGroup`
(`EventID`,
`TeamID`,
`GroupID`,
`GroupName`)
VALUES
(eventid,
TempTeamID,
'11',
groupname);

INSERT INTO `BifMember`
(`EventID`,
`TeamID`,
`GroupID`,
`UserID`,
`UserPosition`)
VALUES
(eventid,
TempTeamID,
'11',
userid,
'Owner');
####################################################
END;