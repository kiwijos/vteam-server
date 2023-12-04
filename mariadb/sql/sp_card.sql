DROP PROCEDURE IF EXISTS card_types;
DROP PROCEDURE IF EXISTS user_card;
DROP PROCEDURE IF EXISTS upd_user_card;

DELIMITER ;;


CREATE PROCEDURE card_types()
BEGIN
    SELECT
        *
    FROM
        `card`
    ;
END
;;

CREATE PROCEDURE user_card(
    u_id INT
)
BEGIN
    SELECT
        card_nr,
        card_type,
        card.name AS card_type_descr
    FROM
        `user`
    JOIN `card`
    ON user.card_type = card.id
    WHERE
        user.id = u_id
    ;
END
;;

CREATE PROCEDURE upd_user_card(
    u_id INT,
    c_nr VARCHAR(100),
    c_type INT
)
BEGIN
    UPDATE `user`
    SET
        card_nr = c_nr,
        card_type = c_type
    WHERE
        user.id = u_id
    ;

    CALL user_card(u_id);
END
;;

DELIMITER ;