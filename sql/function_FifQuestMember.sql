DROP PROCEDURE IF EXISTS function_FifQuestMember ;
DELIMITER //
CREATE PROCEDURE function_FifQuestMember( IN eventid char(10), teamid char(6))
BEGIN
SET SESSION sql_mode = "STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION";
###################################################
DELETE FROM `FifQuestCircle`
WHERE `FifQuestCircle`.`EventID`= eventid
AND `FifQuestCircle`.`TeamID` = teamid ;
INSERT INTO `FifQuestCircle`
SELECT `FifQuestMember`.`EventID`,
    `FifQuestMember`.`TeamID`,
    `FifQuestMember`.`GroupID`,
    `FifQuestMember`.`CircleID`,
    `FifQuestMember`.`CircleLocation`,
    `FifQuestMember`.`CircleName`,
    `FifQuestMember`.`CircleWeb`,
    'ST' as CircleStatue,
    null as LockerID,
    0 AS Version,
    now() AS UpdateTime,
    now() AS CreateTime
FROM `FifQuestMember`
WHERE `FifQuestMember`.`EventID`= eventid
AND `FifQuestMember`.`TeamID` = teamid
GROUP BY `FifQuestMember`.`CircleID`
ORDER BY `FifQuestMember`.`CircleID`;
###################################################
DELETE FROM `FifQuest`
WHERE `FifQuest`.`EventID`= eventid
AND `FifQuest`.`TeamID` = teamid ;
INSERT INTO FifQuest
SELECT `FifQuestMember`.`EventID`,
    `FifQuestMember`.`TeamID`,
    `FifQuestMember`.`GroupID`,
    `FifQuestMember`.`CircleID`,
    `FifQuestMember`.`CircleLocation`,
    `FifQuestMember`.`CircleName`,
    `FifQuestMember`.`GoodsID`,
    `FifQuestMember`.`GoodsName`,
    `FifQuestMember`.`GoodsPrice`,
	sum(`FifQuestMember`.`RequestNum`) as Num,
    '' as MisstionType,
    'OK' as GoodsStatus,
    0 AS Version,
    now() AS UpdateTime,
    now() AS CreateTime
FROM `FifQuestMember`
WHERE `FifQuestMember`.`EventID`= eventid
AND `FifQuestMember`.`TeamID` = teamid
GROUP BY `FifQuestMember`.`CircleID`,`FifQuestMember`.`GoodsID`
ORDER BY `FifQuestMember`.`CircleID`,`FifQuestMember`.`GoodsID`;
####################################################
END;