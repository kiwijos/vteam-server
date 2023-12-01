-- DROP DATABASE IF EXISTS `bikes`;
-- CREATE DATABASE `bikes`;
USE `bikes`;

source ./sql/ddl.sql;
source ./sql/insert-local.sql;
source ./sql/view.sql;
source ./sql/functions.sql;
source ./sql/sp_payment.sql;
source ./sql/sp_user.sql;
source ./sql/sp_emp.sql;
source ./sql/sp_trip.sql;
source ./sql/sp_bike.sql;
source ./sql/sp_city.sql;

