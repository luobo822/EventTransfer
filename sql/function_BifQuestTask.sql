DROP PROCEDURE IF EXISTS function_BifQuestTask ;
DELIMITER //
CREATE PROCEDURE function_BifQuestTask( IN eventid char(10), teamid char(6))
BEGIN
###################################################
DELETE FROM `FifQuestTask`
WHERE `FifQuestTask`.`EventID`= eventid
AND `FifQuestTask`.`TeamID` = teamid;
INSERT INTO `FifQuestTask`
SELECT `BifQuestTask`.`EventID`,
    `BifQuestTask`.`TeamID`,
    `BifQuestTask`.`UserID`,
    `BifQuestTask`.`CircleID`,
    `BifQuestTask`.`Level`,
    1,
    now(),
    now()
FROM `BifQuestTask`
WHERE `BifQuestTask`.`EventID`= eventid
AND `BifQuestTask`.`TeamID` = teamid
ORDER BY `BifQuestTask`.`EventID`,
	`BifQuestTask`.`TeamID`,
	`BifQuestTask`.`UserID`,
	`BifQuestTask`.`CircleID`,
	`BifQuestTask`.`Level`;
####################################################
END;