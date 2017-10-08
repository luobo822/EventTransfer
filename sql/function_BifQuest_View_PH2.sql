DROP PROCEDURE IF EXISTS function_BifQuest_View ;
DELIMITER //
CREATE PROCEDURE function_BifQuest_View( IN eventid char(10), teamid char(6))
BEGIN
###################################################
DELETE FROM `FifQuestMember`
WHERE `FifQuestMember`.`EventID`= eventid
AND `FifQuestMember`.`TeamID` = teamid ;
INSERT INTO `FifQuestMember`
SELECT `BifQuest_View`.`EventID`,
    `BifQuest_View`.`TeamID`,
    '11' AS GroupID,
    `BifQuest_View`.`CircleID`,
    `BifQuest_View`.`CircleLocation`,
    `BifQuest_View`.`CircleName`,
    `BifQuest_View`.`CircleWeb`,
    `BifQuest_View`.`GoodsID`,
    `BifQuest_View`.`GoodsName`,
    `BifQuest_View`.`GoodsPrice`,
	`BifQuest_View`.`RequesterID`,
	`BifQuest_View`.`RequestNum`,
    0 AS Version,
    now() AS UpdateTime,
    now() AS CreateTime
FROM `BifQuest_View`
WHERE `BifQuest_View`.`EventID`= eventid
AND `BifQuest_View`.`TeamID` = teamid
ORDER BY `BifQuest_View`.`EventID`,
	`BifQuest_View`.`TeamID`,
	`BifQuest_View`.`CircleID`,
	`BifQuest_View`.`GoodsID`;
CALL function_BifQuestTask(eventid ,teamid);
####################################################
END;