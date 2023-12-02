DROP PROCEDURE IF EXISTS user_search;
DROP PROCEDURE IF EXISTS all_users;
DROP PROCEDURE IF EXISTS all_users_pag;
DROP PROCEDURE IF EXISTS upd_user_status;
DROP PROCEDURE IF EXISTS upd_user_email;
DROP PROCEDURE IF EXISTS new_user;
DROP PROCEDURE IF EXISTS login_user;


DELIMITER ;;

CREATE PROCEDURE new_user(
    u_email VARCHAR(100),
    c_nr VARCHAR(100),
    c_type INT
)
BEGIN
    INSERT INTO `user` (email, card_nr, card_type)
    VALUES(u_email, c_nr, c_type);

    SELECT id, email
    FROM `user`
    WHERE email = u_email;
END
;;

CREATE PROCEDURE login_user(
    u_email VARCHAR(100)
)
BEGIN
    SELECT id, email
    FROM `user`
    WHERE email = u_email;
END
;;

CREATE PROCEDURE upd_user_status(
    u_id INT,
    u_active BOOLEAN
)
BEGIN
    UPDATE `user`
    SET `active` = u_active
    WHERE id = u_id;

    SELECT
        `id`,
        `email`,
        `balance`,
        `active`
    FROM
        `user`
    WHERE `id` = u_id
    ;
END
;;

CREATE PROCEDURE upd_user_email(
    u_id INT,
    u_email VARCHAR(100)
)
BEGIN
    UPDATE `user`
    SET `email` = u_email
    WHERE id = u_id;

    SELECT
        `id`,
        `email`,
        `balance`,
        `active`
    FROM
        `user`
    WHERE `id` = u_id
    ;
END
;;

CREATE PROCEDURE user_search(
    a_what VARCHAR(100)
)
BEGIN
    SELECT
        `id`,
        `email`,
        `balance`,
        `active`
    FROM
        `user`
    WHERE `id` LIKE a_what
    OR `email` LIKE a_what
    ;
END
;;

CREATE PROCEDURE all_users()
BEGIN
    SELECT
        `id`,
        `email`,
        `balance`,
        `active`
    FROM
        `user`
    ;
END
;;

CREATE PROCEDURE all_users_pag(
    a_offset INT,
    a_limit INT
)
BEGIN
    SELECT
        `id`,
        `email`,
        `balance`,
        `active`
    FROM
        `user`
    LIMIT a_limit
    OFFSET a_offset
    ;
END
;;

DELIMITER ;

