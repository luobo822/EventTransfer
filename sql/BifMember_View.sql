CREATE VIEW `BifMember_View` AS
SELECT `BifMember`.`EventID`,
	`BifEvent`.`EventName`,
	`BifEvent`.`EventIsAlive`,
    `BifMember`.`TeamID`,
	`BifTeam`.`TeamName`,
    `BifMember`.`GroupID`,
    `BifGroup`.`GroupName`,
    `BifMember`.`UserID`,
    `BifUser`.`UserNickName`,
    `BifMember`.`UserPosition`
FROM `BifMember`
INNER JOIN `BifGroup`
ON (
	`BifMember`.`EventID` = `BifGroup`.`EventID`
    AND `BifMember`.`TeamID` = `BifGroup`.`TeamID`
    AND `BifMember`.`GroupID` = `BifGroup`.`GroupID`
)
INNER JOIN `BifTeam`
ON (
	`BifMember`.`EventID` = `BifTeam`.`EventID`
    AND `BifMember`.`TeamID` = `BifTeam`.`TeamID`
)
INNER JOIN `BifEvent`
ON (
	`BifMember`.`EventID` = `BifEvent`.`EventID`
)
INNER JOIN `BifUser`
ON (
	`BifMember`.`UserID` = `BifUser`.`UserID`
);