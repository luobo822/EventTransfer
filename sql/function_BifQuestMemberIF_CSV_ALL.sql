DROP PROCEDURE IF EXISTS function_BifQuestMemberIF_CSV;
DELIMITER //
CREATE PROCEDURE function_BifQuestMemberIF_CSV( IN eventid char(10), teamid char(6), userid char(7))
BEGIN
###################################################
SET @rownum=0;
SET @nullrownum=100001;

DELETE FROM `BifQuestMember`
WHERE `BifQuestMember`.EventID = eventid
AND `BifQuestMember`.TeamID = teamid
AND `BifQuestMember`.RequesterID = userid;

INSERT INTO `BifQuestCircle`
(`EventID`,
`TeamID`,
`CircleID`,
`CircleLocation`,
`CircleName`,
`CircleWeb`,
`CreateTime`)
SELECT `BifQuestMemberIF`.`EventID`,
	`BifQuestMemberIF`.`TeamID`,
	IFNULL(
		(
			SELECT max(`BifQuestCircle`.CircleID) + @rownum:=@rownum+1 FROM `BifQuestCircle`
			WHERE `BifQuestCircle`.EventID = `BifQuestMemberIF`.EventID 
			AND `BifQuestCircle`.TeamID = `BifQuestMemberIF`.TeamID 
		)
	,@nullrownum:=@nullrownum+1),
	`BifQuestMemberIF`.`CircleLocation`,
	`BifQuestMemberIF`.`CircleName`,
	`BifQuestMemberIF`.`CircleWeb`,
	now()
FROM `BifQuestMemberIF`
WHERE `BifQuestMemberIF`.EventID = eventid
AND `BifQuestMemberIF`.TeamID = teamid
AND `BifQuestMemberIF`.RequesterID = userid
AND `BifQuestMemberIF`.IFType = 'CSV'
AND  CONCAT(`BifQuestMemberIF`.`CircleLocation`,`BifQuestMemberIF`.`CircleName`)
	NOT IN
	(
		SELECT CONCAT(`CircleLocation`,`CircleName`)
        FROM `BifQuestCircle`
		WHERE `BifQuestCircle`.EventID = `BifQuestMemberIF`.EventID 
		AND `BifQuestCircle`.TeamID = `BifQuestMemberIF`.TeamID 
	);

UPDATE `BifQuestMemberIF`,`BifQuestCircle`
SET `BifQuestMemberIF`.TempCircleID = `BifQuestCircle`.CircleID
WHERE `BifQuestMemberIF`.`CircleLocation` = `BifQuestCircle`.`CircleLocation`
AND `BifQuestMemberIF`.`CircleName` = `BifQuestCircle`.`CircleName`
AND `BifQuestMemberIF`.EventID = eventid
AND `BifQuestMemberIF`.TeamID = teamid
AND `BifQuestMemberIF`.RequesterID = userid
AND `BifQuestMemberIF`.IFType = 'CSV';

SET @rownum=0;
INSERT INTO `BifQuestGoods`
(`EventID`,
`TeamID`,
`CircleID`,
`GoodsID`,
`GoodsName`,
`GoodsPrice`,
`CreateTime`)
SELECT `BifQuestMemberIF`.`EventID`,
	`BifQuestMemberIF`.`TeamID`,
    `BifQuestMemberIF`.`TempCircleID`,
	IFNULL(
		(
			SELECT max(`BifQuestGoods`.GoodsID) + @rownum:=@rownum+1 FROM `BifQuestGoods`
			WHERE `BifQuestGoods`.EventID = `BifQuestMemberIF`.EventID 
            AND `BifQuestGoods`.TeamID = `BifQuestMemberIF`.TeamID
            AND `BifQuestGoods`.CircleID = `BifQuestMemberIF`.`TempCircleID`
		)
	,'11'),
	`BifQuestMemberIF`.`GoodsName`,
	`BifQuestMemberIF`.`GoodsPrice`,
	now()
FROM `BifQuestMemberIF`
WHERE `BifQuestMemberIF`.EventID = eventid
AND `BifQuestMemberIF`.TeamID = teamid
AND `BifQuestMemberIF`.RequesterID = userid
AND `BifQuestMemberIF`.IFType = 'CSV'
AND  CONCAT(`BifQuestMemberIF`.`GoodsName`,`BifQuestMemberIF`.`GoodsPrice`)
	NOT IN
	(
		SELECT CONCAT(`GoodsName`,`GoodsPrice`)
        FROM `BifQuestGoods`
		WHERE `BifQuestGoods`.EventID = `BifQuestMemberIF`.EventID
		AND `BifQuestGoods`.TeamID = `BifQuestMemberIF`.TeamID
        AND `BifQuestGoods`.CircleID = `BifQuestMemberIF`.TempCircleID
	);

UPDATE `BifQuestMemberIF`,`BifQuestGoods`
SET `BifQuestMemberIF`.TempGoodsID = `BifQuestGoods`.GoodsID
WHERE `BifQuestMemberIF`.`TempCircleID` = `BifQuestGoods`.`CircleID`
AND `BifQuestMemberIF`.`GoodsName`	 = `BifQuestGoods`.`GoodsName`
AND `BifQuestMemberIF`.`GoodsPrice` = `BifQuestGoods`.`GoodsPrice`
AND `BifQuestMemberIF`.EventID = eventid
AND `BifQuestMemberIF`.TeamID = teamid
AND `BifQuestMemberIF`.RequesterID = userid
AND `BifQuestMemberIF`.IFType = 'CSV';

INSERT INTO `BifQuestMember`
(`EventID`,
`TeamID`,
`CircleID`,
`GoodsID`,
`RequesterID`,
`RequestNum`,
`CreateTime`)
SELECT `BifQuestMemberIF`.`EventID`,
	`BifQuestMemberIF`.`TeamID`,
	`BifQuestMemberIF`.`TempCircleID`,
	`BifQuestMemberIF`.`TempGoodsID`,
	`BifQuestMemberIF`.`RequesterID`,
	`BifQuestMemberIF`.`RequestNum`,
	now()
FROM `BifQuestMemberIF`
WHERE `BifQuestMemberIF`.EventID = eventid
AND `BifQuestMemberIF`.TeamID = teamid
AND `BifQuestMemberIF`.RequesterID = userid
AND `BifQuestMemberIF`.IFType = 'CSV'
AND  CONCAT(`BifQuestMemberIF`.`TempCircleID`,`BifQuestMemberIF`.`TempGoodsID`)
	NOT IN
	(
		SELECT CONCAT(`CircleID`,`GoodsID`)
        FROM `BifQuestMember`
		WHERE `BifQuestMember`.EventID = `BifQuestMemberIF`.EventID
		AND `BifQuestMember`.TeamID = `BifQuestMemberIF`.TeamID
		AND `BifQuestMember`.RequesterID = `BifQuestMemberIF`.RequesterID
	);
####################################################
END;