DROP PROCEDURE IF EXISTS function_Team_NullDelete ;
DELIMITER //
CREATE PROCEDURE function_Team_NullDelete( IN eventid char(10), teamid char(6))
BEGIN
###################################################
DELETE FROM `BifQuestGoods`
WHERE concat(`BifQuestGoods`.CircleID,`BifQuestGoods`.GoodsID)
	NOT IN 
    (
		SELECT concat(`BifQuestMember`.CircleID,`BifQuestMember`.GoodsID)
        FROM `BifQuestMember`
		WHERE `BifQuestMember`.`EventID` = `BifQuestGoods`.`EventID`
		AND `BifQuestMember`.`TeamID` = `BifQuestGoods`.`TeamID`
    )
AND `BifQuestGoods`.`EventID` = eventid
AND `BifQuestGoods`.`TeamID` = teamid;
DELETE FROM `BifQuestCircle`
WHERE `BifQuestCircle`.CircleID
	NOT IN 
    (
		SELECT `BifQuestGoods`.CircleID
        FROM `BifQuestGoods`
		WHERE `BifQuestGoods`.`EventID` = `BifQuestCircle`.`EventID`
		AND `BifQuestGoods`.`TeamID` = `BifQuestCircle`.`TeamID`
    )
AND `BifQuestCircle`.`EventID` = eventid
AND `BifQuestCircle`.`TeamID` = teamid;
####################################################
END;