###################################
####需求用户名整合性确认 BifCatalogCSV
###################################
SELECT `EventID`,
    `TeamID`,
    `GroupID`,
    `CircleID`,
    `CircleLocation`,
    `CircleName`,
    `GoodsID`,
    `GoodsName`,
    `GoodsPrice`,
    `UserID`,
    `UserName`
FROM `BifCatalogCSV`
WHERE `BifCatalogCSV`.`UserName` not in (
	SELECT `UserInfo`.`userNickName`
    FROM `test`.`UserInfo`
    WHERE `UserInfo`.`userNickName` != "") ;
###################################
####需求用户名整合性确认 FifQuestMember
###################################
SELECT `EventID`,
    `TeamID`,
    `GroupID`,
    `CircleID`,
    `CircleLocation`,
    `CircleName`,
    `GoodsID`,
    `GoodsName`,
    `GoodsPrice`,
    `UserID`,
    `UserName`
FROM `FifQuestMember`
WHERE `FifQuestMember`.`UserName` not in (
	SELECT `UserInfo`.`userNickName`
    FROM `test`.`UserInfo`
    WHERE `UserInfo`.`userNickName` != "") ;
