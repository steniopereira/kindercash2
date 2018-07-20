
CREATE DATABASE kindercash_db;
USE kindercash_db;

CREATE TABLE users(
    id INT NOT NULL AUTO_INCREMENT,
    email float,
    firstname VARCHAR(45) NULL,
    lastname VARCHAR(45) NULL,
    PRIMARY KEY (id)
);

INSERT INTO users (email, firstname, lastname)
VALUES ("daniellejgilmore@gmail.com", "DJ", "Turner");

