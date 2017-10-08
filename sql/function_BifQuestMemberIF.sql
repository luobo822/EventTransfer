DROP PROCEDURE IF EXISTS function_BifQuestMemberIF ;
DELIMITER //
CREATE PROCEDURE function_BifQuestMemberIF( IN eventid char(10), teamid char(6))
BEGIN
SET SESSION sql_mode = "STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION";
###################################################
DELETE FROM `FifQuestMember`
WHERE `FifQuestMember`.`EventID`= eventid
AND `FifQuestMember`.`TeamID` = teamid ;
INSERT INTO `FifQuestMember`
SELECT `BifQuestMemberIF`.`EventID`,
    `BifQuestMemberIF`.`TeamID`,
    `BifQuestMemberIF`.`GroupID`,
    `BifQuestMemberIF`.`TempCircleID` AS CircleID,
    `BifQuestMemberIF`.`CircleLocation`,
    `BifQuestMemberIF`.`CircleName`,
    `BifQuestMemberIF`.`CircleWeb`,
    `BifQuestMemberIF`.`TempGoodsID` AS GoodsID,
    `BifQuestMemberIF`.`GoodsName`,
    `BifQuestMemberIF`.`GoodsPrice`,
	`BifQuestMemberIF`.`RequesterID`,
	sum(`BifQuestMemberIF`.`RequestNum`) AS RequestNum,
    0 AS Version,
    now() AS UpdateTime,
    now() AS CreateTime
FROM `BifQuestMemberIF`
WHERE `BifQuestMemberIF`.`EventID`= eventid
AND `BifQuestMemberIF`.`TeamID` = teamid
GROUP BY `BifQuestMemberIF`.`TempCircleID`,
	`BifQuestMemberIF`.`TempGoodsID`,
	`BifQuestMemberIF`.`RequesterID`
ORDER BY `BifQuestMemberIF`.`TempCircleID`,
	`BifQuestMemberIF`.`TempGoodsID`,
	`BifQuestMemberIF`.`RequesterID`;
####################################################
END;