CREATE VIEW `FifQuestTask_View` AS
SELECT `FifQuestTask`.`EventID`,
    `FifQuestTask`.`TeamID`,
    `FifQuestTask`.`UserID`,
    u1.`UserNickName`,
    `FifQuestTask`.`Level`,
    `FifQuestTask`.`CircleID`,
    `FifQuestCircle`.`CircleLocation`,
    `FifQuestCircle`.`CircleName`,
    `FifQuestCircle`.`CircleWeb`,
    `FifQuestMember`.`GoodsID`,
    `FifQuestMember`.`GoodsName`,
    `FifQuestMember`.`GoodsPrice`,
    `FifQuestMember`.`RequesterID`,
    u2.`UserNickName` AS RequesterName,
    `FifQuestMember`.`RequestNum`
FROM `FifQuestTask`
INNER JOIN `FifQuestCircle`
ON (
	`FifQuestTask`.`EventID` = `FifQuestCircle`.`EventID`
    AND `FifQuestTask`.`TeamID` = `FifQuestCircle`.`TeamID`
    AND `FifQuestTask`.`CircleID` = `FifQuestCircle`.`CircleID`
)
INNER JOIN `FifQuestMember`
ON (
	`FifQuestTask`.`EventID` = `FifQuestMember`.`EventID`
    AND `FifQuestTask`.`TeamID` = `FifQuestMember`.`TeamID`
    AND `FifQuestTask`.`CircleID` = `FifQuestMember`.`CircleID`
)
INNER JOIN `BifUser` u1
ON `FifQuestTask`.`UserID` = u1.`UserID`
INNER JOIN `BifUser` u2
ON `FifQuestMember`.`RequesterID` = u2.`UserID`
ORDER BY `FifQuestTask`.`EventID`,
	`FifQuestTask`.`TeamID`,
    `FifQuestTask`.`UserID`,
    `FifQuestTask`.`Level`,
    `FifQuestTask`.`CircleID`,
    `FifQuestMember`.`GoodsID`,
    `FifQuestMember`.`RequesterID`;
