SET @cicleID:= 100000;
DROP TABLE IF EXISTS TempBifQuestCircleIF;
CREATE TEMPORARY TABLE TempBifQuestCircleIF
SELECT `BifQuestMemberIF`.`EventID`,
	`BifQuestMemberIF`.`TeamID`,
	`BifQuestMemberIF`.`GroupID`,
    @cicleID:= @cicleID + 1 AS `CircleID`,
	`BifQuestMemberIF`.`CircleLocation`,
	`BifQuestMemberIF`.`CircleName`,
    0 AS `CircileCount`
FROM `BifQuestMemberIF`
GROUP BY `CircleLocation`,`CircleName`
ORDER BY `CircleLocation`,`CircleName`;
##DROP TempBifQuestCircleIF;
##SELECT * FROM TempBifQuestCircleIF;

SELECT `BifQuestMemberIF`.`EventID`,
	`BifQuestMemberIF`.`TeamID`,
	`BifQuestMemberIF`.`GroupID`,
	`TempBifQuestCircleIF`.`CircleID` AS `CircleID`,
	`BifQuestMemberIF`.`CircleLocation`,
	`BifQuestMemberIF`.`CircleName`,
	null As `GoodsID`,
	`BifQuestMemberIF`.`GoodsName`,
	`BifQuestMemberIF`.`GoodsPrice`
FROM `BifQuestMemberIF`,`TempBifQuestCircleIF`
WHERE `BifQuestMemberIF`.`CircleLocation` = `TempBifQuestCircleIF`.`CircleLocation`
AND `BifQuestMemberIF`.`CircleName` = `TempBifQuestCircleIF`.`CircleName`
GROUP BY `CircleLocation`,`CircleName`,`GoodsName`,`GoodsPrice`
ORDER BY `CircleLocation`,`CircleName`,`GoodsName`,`GoodsPrice`