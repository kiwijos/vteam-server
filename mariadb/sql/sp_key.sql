DROP PROCEDURE IF EXISTS active_api_keys;

DELIMITER ;;

CREATE PROCEDURE active_api_keys()
BEGIN
    SELECT `key`
    FROM api_key
    WHERE `active` = TRUE;
END
;;

DELIMITER ;
