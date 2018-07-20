
USE kindercash;
DROP TABLE IF EXISTS `savings`;

CREATE TABLE `savings` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `savingsname` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `savings` WRITE;



INSERT INTO `savings` (`id`, `savingsname`)
VALUES
	(2,'Checking Account'),
	(3,'Savings Account - Unallocated'),
	(4,'First Car'),
	(5,'College Fund'),
	(6,'First Home'),
    (7,'Senior Trip'),
    (8, 'Trip to Theme Park');


UNLOCK TABLES;


# Dump of table deposit
# ------------------------------------------------------------

DROP TABLE IF EXISTS `deposit`;

CREATE TABLE `deposit` (
  `uid` int(11) NOT NULL,
  `bid` int(11) NOT NULL,
  `amount` int(11) NOT NULL DEFAULT '0',
  `description` varchar(500) DEFAULT '',
  `dtime` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `deposit` WRITE;


INSERT INTO `deposit` (`uid`, `bid`, `amount`, `description`, `dtime`)
VALUES
	(2,2,1000,'Initial Check','2017-08-14'),
	(2,3,75000,'Order from XYZ','2017-08-15'),
	(2,2,100,'Check after db change','2017-08-14'),
	(2,2,15000,'House Rent','2017-08-14'),
	(2,2,100000,'For Semester Fee','2017-08-15'),
	(2,2,7000,'from home','2017-08-15'),
	(2,4,10000,'Sample','2017-08-16');


UNLOCK TABLES;


# Dump of table mysavings
# ------------------------------------------------------------

DROP TABLE IF EXISTS `mysavings`;

CREATE TABLE `mysavings` (
  `uid` int(11) NOT NULL,
  `bid` int(11) NOT NULL,
  `currentbalance` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`,`bid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `mysavings` WRITE;


INSERT INTO `mysavings` (`uid`, `bid`, `currentbalance`)
VALUES
	(2,2,10100),
	(2,3,75200),
	(2,4,13000);


UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `uid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(250) DEFAULT NULL,
  `email` varchar(250) DEFAULT NULL,
  `password` varchar(500) DEFAULT NULL,
  `checking` int(11) unsigned DEFAULT '0',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `users` WRITE;


INSERT INTO `users` (`uid`, `name`, `email`, `password`, `checking`)
VALUES
	(2,'DJ Turner','DJTurner4U@gmail.com','$2a$10$x5e0Mr.SznqpIeBZIqoXNOmZdC3D6vQu.4BQqGnEmU3d.snUQzHWy',22500);



UNLOCK TABLES;


# Dump of table checking_add
# ------------------------------------------------------------

DROP TABLE IF EXISTS `checking_add`;

CREATE TABLE `checking_add` (
  `uid` int(11) NOT NULL,
  `amount` int(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `dtime` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `checking_add` WRITE;
/*!40000 ALTER TABLE `checking_add` DISABLE KEYS */;

INSERT INTO `checking_add` (`uid`, `amount`, `description`, `dtime`)
VALUES
	(2,1500,'Testing','2018-07-16'),
	(2,500,'Test','2018-07-16'),
	(2,1000,'Test 2','2018-07-16'),
	(2,1000,'Test 3','2018-07-16'),
	(2,1000,'Test 4','2018-07-16'),
	(2,2000,'Testing From Another Page','2018-07-16'),
	(8,10000,'From Auntie DJ','2018-07-20'),
	(2,2000,'Checking new bug fix #FromAccount','2018-07-03');
/*!40000 ALTER TABLE `checking_add` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table checking_spent
# ------------------------------------------------------------

DROP TABLE IF EXISTS `checking_spent`;

CREATE TABLE `checking_spent` (
  `uid` int(11) NOT NULL,
  `amount` int(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `dtime` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `checking_spent` WRITE;
/*!40000 ALTER TABLE `checking_spent` DISABLE KEYS */;

INSERT INTO `checking_spent` (`uid`, `amount`, `description`, `dtime`)
VALUES
	(2,2000,'Candy','2018-07-14'),
	(2,30,'Movies','2018-07-14'),
	(2,970,'Checking','2018-07-14'),
	(2,1500,'Checking From Another Page','2018-07-14');

/*!40000 ALTER TABLE `checking_spent` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table withdraw
# ------------------------------------------------------------

DROP TABLE IF EXISTS `withdraw`;

CREATE TABLE `withdraw` (
  `uid` int(11) NOT NULL,
  `bid` int(11) NOT NULL,
  `amount` int(11) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `checking` tinyint(1) DEFAULT NULL,
  `dtime` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `withdraw` WRITE;
/*!40000 ALTER TABLE `withdraw` DISABLE KEYS */;

INSERT INTO `withdraw` (`uid`, `bid`, `amount`, `description`, `checking`, `dtime`)
VALUES
	(2,3,1000,'Withdraw Check',1,'2018-07-14'),
	(2,2,15000,'Candy',1,'2018-07-14'),
	(2,2,95000,'Movies',0,'2018-07-14'),
	(2,4,2000,'Brother Bday Present',1,'2018-07-14'),
	(2,2,2000,'Checking new bug fix',1,'2018-07-14');

/*!40000 ALTER TABLE `withdraw` ENABLE KEYS */;
UNLOCK TABLES;
