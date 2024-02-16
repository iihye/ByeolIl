-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: stella
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alarm`
--

DROP TABLE IF EXISTS `alarm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alarm` (
  `alarm_index` bigint NOT NULL AUTO_INCREMENT,
  `alarm_date` datetime(6) DEFAULT NULL,
  `alarm_type` tinyint DEFAULT NULL,
  `board_index` bigint DEFAULT NULL,
  `from_member_index` bigint DEFAULT NULL,
  `to_member_index` bigint DEFAULT NULL,
  PRIMARY KEY (`alarm_index`),
  KEY `FKohxi3mpkbpih8tpe94eq8j2h6` (`board_index`),
  KEY `FKkrve7mmlfaa4fjqwodrkx3p0t` (`from_member_index`),
  KEY `FK4tj8glhn5us8nqa80h244o8nn` (`to_member_index`),
  CONSTRAINT `FK4tj8glhn5us8nqa80h244o8nn` FOREIGN KEY (`to_member_index`) REFERENCES `member` (`member_index`),
  CONSTRAINT `FKkrve7mmlfaa4fjqwodrkx3p0t` FOREIGN KEY (`from_member_index`) REFERENCES `member` (`member_index`),
  CONSTRAINT `FKohxi3mpkbpih8tpe94eq8j2h6` FOREIGN KEY (`board_index`) REFERENCES `board` (`board_index`),
  CONSTRAINT `alarm_chk_1` CHECK ((`alarm_type` between 0 and 2))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alarm`
--

LOCK TABLES `alarm` WRITE;
/*!40000 ALTER TABLE `alarm` DISABLE KEYS */;
INSERT INTO `alarm` VALUES (1,'2024-02-16 11:18:41.429776',0,NULL,1,2),(2,'2024-02-16 11:51:20.788989',1,2,2,1);
/*!40000 ALTER TABLE `alarm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alarm_check`
--

DROP TABLE IF EXISTS `alarm_check`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alarm_check` (
  `alarm_check_index` bigint NOT NULL AUTO_INCREMENT,
  `alarm_index` bigint DEFAULT NULL,
  PRIMARY KEY (`alarm_check_index`),
  KEY `FK6nwjfmc31hab65c1htujj7vb1` (`alarm_index`),
  CONSTRAINT `FK6nwjfmc31hab65c1htujj7vb1` FOREIGN KEY (`alarm_index`) REFERENCES `alarm` (`alarm_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alarm_check`
--

LOCK TABLES `alarm_check` WRITE;
/*!40000 ALTER TABLE `alarm_check` DISABLE KEYS */;
/*!40000 ALTER TABLE `alarm_check` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `board`
--

DROP TABLE IF EXISTS `board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `board` (
  `board_index` bigint NOT NULL AUTO_INCREMENT,
  `board_access` enum('OPEN','NOOPEN','PARTOPEN') DEFAULT 'OPEN',
  `board_content` varchar(500) NOT NULL,
  `delete_yn` enum('Y','N') DEFAULT 'N',
  `board_input_date` date DEFAULT NULL,
  `board_location` bigint DEFAULT NULL,
  `board_regtime` datetime(6) DEFAULT NULL,
  `board_update_date` datetime(6) DEFAULT NULL,
  `member_index` bigint NOT NULL,
  PRIMARY KEY (`board_index`),
  KEY `FK7poy9231gegi5hdp3u9li0owp` (`member_index`),
  CONSTRAINT `FK7poy9231gegi5hdp3u9li0owp` FOREIGN KEY (`member_index`) REFERENCES `member` (`member_index`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `board`
--

LOCK TABLES `board` WRITE;
/*!40000 ALTER TABLE `board` DISABLE KEYS */;
INSERT INTO `board` VALUES (1,'OPEN','2월1일일기예요','N','2024-02-16',200,'2024-02-16 11:18:17.422322','2024-02-16 11:51:41.945096',1),(2,'NOOPEN','오늘의 일기','N','2024-02-16',201,'2024-02-16 11:18:26.061210','2024-02-16 11:53:37.693613',1),(3,'NOOPEN','일기얌','N','2024-02-16',202,'2024-02-16 11:18:33.132752','2024-02-16 11:51:47.558984',1),(4,'OPEN','테스트','N','2024-02-08',181,'2024-02-16 11:51:07.357566','2024-02-16 11:51:07.357566',2),(5,'OPEN','설날','N','2024-02-17',180,'2024-02-16 11:51:13.076055','2024-02-16 11:51:13.076055',2);
/*!40000 ALTER TABLE `board` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `comment_index` bigint NOT NULL AUTO_INCREMENT,
  `comment_content` varchar(200) DEFAULT NULL,
  `comment_regdate` datetime(6) DEFAULT NULL,
  `board_index` bigint DEFAULT NULL,
  `member_index` bigint DEFAULT NULL,
  PRIMARY KEY (`comment_index`),
  KEY `FKtb60jgysdpm9bvme4p9jop0mi` (`board_index`),
  KEY `FK3i10uugjx63ock3wgjasc6wf` (`member_index`),
  CONSTRAINT `FK3i10uugjx63ock3wgjasc6wf` FOREIGN KEY (`member_index`) REFERENCES `member` (`member_index`),
  CONSTRAINT `FKtb60jgysdpm9bvme4p9jop0mi` FOREIGN KEY (`board_index`) REFERENCES `board` (`board_index`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (1,'댓글입니다','2024-02-16 11:51:20.783024',2,2);
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follow`
--

DROP TABLE IF EXISTS `follow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follow` (
  `follow_index` bigint NOT NULL AUTO_INCREMENT,
  `from_member_index` bigint DEFAULT NULL,
  `to_member_index` bigint DEFAULT NULL,
  PRIMARY KEY (`follow_index`),
  UNIQUE KEY `UK53mx4wmmsjsk3usblex5lmuoc` (`to_member_index`,`from_member_index`),
  KEY `FK6ppp2uucixpjamloi57gb2e36` (`from_member_index`),
  CONSTRAINT `FK6ppp2uucixpjamloi57gb2e36` FOREIGN KEY (`from_member_index`) REFERENCES `member` (`member_index`),
  CONSTRAINT `FKn7l5hu2vuv10btqcihp69plhp` FOREIGN KEY (`to_member_index`) REFERENCES `member` (`member_index`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follow`
--

LOCK TABLES `follow` WRITE;
/*!40000 ALTER TABLE `follow` DISABLE KEYS */;
INSERT INTO `follow` VALUES (1,1,2);
/*!40000 ALTER TABLE `follow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hash`
--

DROP TABLE IF EXISTS `hash`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hash` (
  `hash_index` bigint NOT NULL AUTO_INCREMENT,
  `hash_content` varchar(20) NOT NULL,
  `board_index` bigint DEFAULT NULL,
  `member_index` bigint DEFAULT NULL,
  PRIMARY KEY (`hash_index`),
  KEY `FKldlnlqv26vwq95k049avlsqe4` (`board_index`),
  KEY `FKks3f7mitkpnijvto5ydfw0uve` (`member_index`),
  CONSTRAINT `FKks3f7mitkpnijvto5ydfw0uve` FOREIGN KEY (`member_index`) REFERENCES `member` (`member_index`),
  CONSTRAINT `FKldlnlqv26vwq95k049avlsqe4` FOREIGN KEY (`board_index`) REFERENCES `board` (`board_index`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hash`
--

LOCK TABLES `hash` WRITE;
/*!40000 ALTER TABLE `hash` DISABLE KEYS */;
INSERT INTO `hash` VALUES (3,'일기',3,1),(4,'해시',3,1),(5,'태그테스트',2,1);
/*!40000 ALTER TABLE `hash` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `heart`
--

DROP TABLE IF EXISTS `heart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `heart` (
  `heart_index` bigint NOT NULL AUTO_INCREMENT,
  `heart_regdate` date DEFAULT NULL,
  `board_index` bigint DEFAULT NULL,
  `member_index` bigint DEFAULT NULL,
  PRIMARY KEY (`heart_index`),
  UNIQUE KEY `UniqueHeartSet` (`board_index`,`member_index`),
  KEY `FK4r2h3t254qv0tia29q3o9hlga` (`member_index`),
  CONSTRAINT `FK4r2h3t254qv0tia29q3o9hlga` FOREIGN KEY (`member_index`) REFERENCES `member` (`member_index`),
  CONSTRAINT `FK7gwyd806lneyjq62h96ed8rmh` FOREIGN KEY (`board_index`) REFERENCES `board` (`board_index`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `heart`
--

LOCK TABLES `heart` WRITE;
/*!40000 ALTER TABLE `heart` DISABLE KEYS */;
INSERT INTO `heart` VALUES (3,'2024-02-16',5,1),(4,'2024-02-16',4,1),(7,'2024-02-16',3,1),(8,'2024-02-16',1,1),(9,'2024-02-16',2,1);
/*!40000 ALTER TABLE `heart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media` (
  `media_index` bigint NOT NULL AUTO_INCREMENT,
  `media_location` varchar(100) NOT NULL,
  `board_index` bigint DEFAULT NULL,
  PRIMARY KEY (`media_index`),
  KEY `FK8niwac6opnk42whhn17142ykb` (`board_index`),
  CONSTRAINT `FK8niwac6opnk42whhn17142ykb` FOREIGN KEY (`board_index`) REFERENCES `board` (`board_index`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
INSERT INTO `media` VALUES (2,'https://ssafy-stella-bucket.s3.ap-northeast-2.amazonaws.com/5e0c5f6f-09a4-49af-8198-9f6194bd750b.png',1);
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `member_index` bigint NOT NULL AUTO_INCREMENT,
  `member_alarm_status` enum('ACCEPT','DECLINE') DEFAULT 'ACCEPT',
  `member_ban_date` date DEFAULT NULL,
  `member_birth` date DEFAULT NULL,
  `member_delete_date` date DEFAULT NULL,
  `member_deleteyn` enum('Y','N') DEFAULT 'N',
  `member_email` varchar(255) DEFAULT NULL,
  `member_id` varchar(255) NOT NULL,
  `member_name` varchar(255) DEFAULT NULL,
  `member_nickname` varchar(255) DEFAULT NULL,
  `member_pass` varchar(255) DEFAULT NULL,
  `member_platform` varchar(255) NOT NULL,
  `member_radio_status` enum('OLD','OLDER','OLDEST') DEFAULT 'OLDEST',
  `member_refresh_token` varchar(255) DEFAULT NULL,
  `member_reg_date` date DEFAULT NULL,
  `member_role` enum('USER','ADMIN','BAN') DEFAULT 'USER',
  PRIMARY KEY (`member_index`),
  UNIQUE KEY `UniqueIdandPlatform` (`member_id`,`member_platform`),
  UNIQUE KEY `UK_3orqjaukiw2b73e2gw8rer4rq` (`member_email`),
  UNIQUE KEY `UK_j0kdf0m8cdj4uy6l7ntpgxrlo` (`member_nickname`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (0,'ACCEPT',NULL,'2000-12-09',NULL,'N','blodybyblody@gmail.com','admin','admin','admin','228728dd-3039-3450-8e1c-4e9fadd9f991','origin','OLDEST','eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MDgwNTU2Njl9._E1HeqK_r6udgj5stxtemml7xNtDMao8g29H1YymdFA','2024-02-16','ADMIN'),(1,'ACCEPT',NULL,'2000-12-09',NULL,'N','abc@gmail.com','iihye','이혜진','혜찐','228728dd-3039-3450-8e1c-4e9fadd9f991','origin','OLDEST','eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MDgwNTU0OTB9.3-oIvyG8uxywyBOf2tcYj8Ao8w41kzPX1Ef_glZcjUI','2024-02-16','USER'),(2,'ACCEPT',NULL,'2000-12-09',NULL,'N','abcd@gmail.com','test','김테스트','테스트','228728dd-3039-3450-8e1c-4e9fadd9f991','origin','OLDEST','eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MDgwNTU0NTR9.G3VYb92FXFHsuqo1YaN9_zw2y9xd18hZ1sDavMnfjKc','2024-02-16','USER');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `multi_comment`
--

DROP TABLE IF EXISTS `multi_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `multi_comment` (
  `multicomment_index` bigint NOT NULL AUTO_INCREMENT,
  `multicomment_content` varchar(200) DEFAULT NULL,
  `multicomment_regdate` datetime(6) DEFAULT NULL,
  `comment_index` bigint DEFAULT NULL,
  `member_index` bigint DEFAULT NULL,
  PRIMARY KEY (`multicomment_index`),
  KEY `FK61otwqew6idmgj174reyxwr1l` (`comment_index`),
  KEY `FKfrs1pn37v8123m5d8r23tppk7` (`member_index`),
  CONSTRAINT `FK61otwqew6idmgj174reyxwr1l` FOREIGN KEY (`comment_index`) REFERENCES `comment` (`comment_index`),
  CONSTRAINT `FKfrs1pn37v8123m5d8r23tppk7` FOREIGN KEY (`member_index`) REFERENCES `member` (`member_index`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `multi_comment`
--

LOCK TABLES `multi_comment` WRITE;
/*!40000 ALTER TABLE `multi_comment` DISABLE KEYS */;
INSERT INTO `multi_comment` VALUES (1,'답글이양','2024-02-16 11:51:56.146506',1,1);
/*!40000 ALTER TABLE `multi_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opinion`
--

DROP TABLE IF EXISTS `opinion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `opinion` (
  `opinion_index` bigint NOT NULL AUTO_INCREMENT,
  `opinion_text` varchar(255) DEFAULT NULL,
  `member_index` bigint DEFAULT NULL,
  PRIMARY KEY (`opinion_index`),
  KEY `FK5lqrwtnjbiikv4xwp15srdm4t` (`member_index`),
  CONSTRAINT `FK5lqrwtnjbiikv4xwp15srdm4t` FOREIGN KEY (`member_index`) REFERENCES `member` (`member_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opinion`
--

LOCK TABLES `opinion` WRITE;
/*!40000 ALTER TABLE `opinion` DISABLE KEYS */;
/*!40000 ALTER TABLE `opinion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `radio`
--

DROP TABLE IF EXISTS `radio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `radio` (
  `radio_index` bigint NOT NULL AUTO_INCREMENT,
  `board_index` bigint DEFAULT NULL,
  `from_member_index` bigint DEFAULT NULL,
  `to_member_index` bigint DEFAULT NULL,
  PRIMARY KEY (`radio_index`),
  KEY `FK1nah2oj032h8enyi3hyd52ocu` (`board_index`),
  KEY `FKtq5f2m608yf3vot0p4tli8tjh` (`from_member_index`),
  KEY `FKqrgoxb0upurdmtp98n5c5rmxx` (`to_member_index`),
  CONSTRAINT `FK1nah2oj032h8enyi3hyd52ocu` FOREIGN KEY (`board_index`) REFERENCES `board` (`board_index`),
  CONSTRAINT `FKqrgoxb0upurdmtp98n5c5rmxx` FOREIGN KEY (`to_member_index`) REFERENCES `member` (`member_index`),
  CONSTRAINT `FKtq5f2m608yf3vot0p4tli8tjh` FOREIGN KEY (`from_member_index`) REFERENCES `member` (`member_index`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `radio`
--

LOCK TABLES `radio` WRITE;
/*!40000 ALTER TABLE `radio` DISABLE KEYS */;
INSERT INTO `radio` VALUES (1,2,1,0);
/*!40000 ALTER TABLE `radio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report` (
  `report_index` bigint NOT NULL AUTO_INCREMENT,
  `report_content` varchar(100) DEFAULT NULL,
  `report_regdate` date DEFAULT NULL,
  `board_index` bigint DEFAULT NULL,
  `member_index` bigint DEFAULT NULL,
  PRIMARY KEY (`report_index`),
  UNIQUE KEY `UniqueReportSet` (`board_index`,`member_index`),
  KEY `FK2xjsxo7rey23l648x51jfqj4q` (`member_index`),
  CONSTRAINT `FK2xjsxo7rey23l648x51jfqj4q` FOREIGN KEY (`member_index`) REFERENCES `member` (`member_index`),
  CONSTRAINT `FKbg33y5dj9r8qrlqa8ux86t0nf` FOREIGN KEY (`board_index`) REFERENCES `board` (`board_index`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report`
--

LOCK TABLES `report` WRITE;
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
INSERT INTO `report` VALUES (1,'신고합니다','2024-02-16',1,1);
/*!40000 ALTER TABLE `report` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-16 11:56:26
