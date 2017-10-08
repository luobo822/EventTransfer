CREATE VIEW `BifQuest_View` AS
SELECT Member.`EventID`,
    Member.`TeamID`,
    Member.`CircleID`,
    Circle.`CircleLocation`,
    Circle.`CircleName`,
    Circle.`CircleWeb`,
    Member.`GoodsID`,
    Goods.`GoodsName`,
    Goods.`GoodsPrice`,
    Member.`RequesterID`,
    Member.`RequestNum`
FROM `BifQuestMember` Member
INNER JOIN `BifQuestGoods` Goods
ON (
	Member.`EventID` = Goods.`EventID`
	AND Member.`TeamID` = Goods.`TeamID`
	AND Member.`CircleID` = Goods.`CircleID`
	AND Member.`GoodsID` = Goods.`GoodsID`
)
INNER JOIN `BifQuestCircle` Circle
ON (
	Member.`EventID` = Circle.`EventID`
	AND Member.`TeamID` = Circle.`TeamID`
	AND Member.`CircleID` = Circle.`CircleID`
);
