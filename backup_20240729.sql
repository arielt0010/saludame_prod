-- MySQL dump 10.13  Distrib 5.7.44, for Win64 (x86_64)
--
-- Host: localhost    Database: saludame_prod
-- ------------------------------------------------------
-- Server version	5.7.44-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `saludame_prod`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `saludame_prod` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `saludame_prod`;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cliente` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `apellidos` varchar(250) DEFAULT NULL,
  `carnetIdentidad` int(11) DEFAULT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `colegio` varchar(150) DEFAULT NULL,
  `curso` varchar(3) DEFAULT NULL,
  `tipoAsegurado` varchar(45) DEFAULT NULL,
  `uid_fk1` int(11) DEFAULT NULL,
  PRIMARY KEY (`cid`),
  KEY `uid_fk_idx` (`uid_fk1`),
  CONSTRAINT `uid_fk1` FOREIGN KEY (`uid_fk1`) REFERENCES `usuario` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,'Ariel','Tellez Torrico',9667582,'2000-06-27','Marista','S6B','Asegurado',2),(2,'Juan','Tellez Perez',13456,'2003-04-24','Bertoluso','S6B','Asegurado',2);
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `datos_observaciones`
--

DROP TABLE IF EXISTS `datos_observaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `datos_observaciones` (
  `did` int(11) NOT NULL AUTO_INCREMENT,
  `fechaAtendido` datetime DEFAULT NULL,
  `diagnostico` varchar(300) DEFAULT NULL,
  `tratamiento` varchar(300) DEFAULT NULL,
  `observaciones` varchar(300) DEFAULT NULL,
  `datosObservacionescol` varchar(45) DEFAULT NULL,
  `lid_fk1` int(11) DEFAULT NULL,
  `uid_fk3` int(11) DEFAULT NULL,
  `cid_fk2` int(11) DEFAULT NULL,
  PRIMARY KEY (`did`),
  KEY `cid_fk2_idx` (`cid_fk2`),
  KEY `uid_fk3_idx` (`uid_fk3`),
  KEY `lid_fk1_idx` (`lid_fk1`),
  CONSTRAINT `cid_fk2` FOREIGN KEY (`cid_fk2`) REFERENCES `cliente` (`cid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `lid_fk1` FOREIGN KEY (`lid_fk1`) REFERENCES `libro_observaciones` (`lid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `uid_fk3` FOREIGN KEY (`uid_fk3`) REFERENCES `usuario` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datos_observaciones`
--

LOCK TABLES `datos_observaciones` WRITE;
/*!40000 ALTER TABLE `datos_observaciones` DISABLE KEYS */;
INSERT INTO `datos_observaciones` VALUES (3,'2024-06-27 00:00:00','Conjuntivitis','Dexametasona','Guardar reposo y tomar el medicamento cada 8 horas',NULL,2,29,2);
/*!40000 ALTER TABLE `datos_observaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `libro_observaciones`
--

DROP TABLE IF EXISTS `libro_observaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `libro_observaciones` (
  `lid` int(11) NOT NULL AUTO_INCREMENT,
  `colegio` varchar(150) DEFAULT NULL,
  `gestion` int(4) DEFAULT NULL,
  `mes` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`lid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `libro_observaciones`
--

LOCK TABLES `libro_observaciones` WRITE;
/*!40000 ALTER TABLE `libro_observaciones` DISABLE KEYS */;
INSERT INTO `libro_observaciones` VALUES (1,'Marista',2024,'enero'),(2,'Bertoluso',2024,'enero');
/*!40000 ALTER TABLE `libro_observaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pagos` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `gestion` int(4) DEFAULT NULL,
  `fechaPago` datetime DEFAULT NULL,
  `formaPago` varchar(45) DEFAULT NULL,
  `monto` int(11) DEFAULT NULL,
  `fechaAgregado` datetime DEFAULT NULL,
  `comprobantePago` varchar(255) DEFAULT NULL,
  `cid_fk1` int(11) DEFAULT NULL,
  `uid_fk2` int(11) DEFAULT NULL,
  PRIMARY KEY (`pid`),
  KEY `cid_fk_idx` (`cid_fk1`),
  KEY `uid_fk_idx` (`uid_fk2`),
  CONSTRAINT `cid_fk1` FOREIGN KEY (`cid_fk1`) REFERENCES `cliente` (`cid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `uid_fk2` FOREIGN KEY (`uid_fk2`) REFERENCES `usuario` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
INSERT INTO `pagos` VALUES (1,2024,'2024-01-01 00:00:00','Transferencia',200,'2024-07-23 22:57:17','http://localhost:8081',1,2),(2,2024,'2024-01-01 00:00:00','Efectivo',300,'2024-07-23 23:07:14','http://localhost:8081',2,2),(3,2023,'2024-01-01 00:00:00','Efectivo',300,'2024-07-23 23:08:09','http://localhost:8081',2,2),(4,2022,'2024-01-01 00:00:00','Efectivo',300,'2024-07-23 23:08:13','http://localhost:8081',2,2),(7,2024,'2024-07-05 00:00:00','Efectivo',500,'2024-07-29 13:59:50',NULL,1,NULL),(8,2025,'2024-07-02 00:00:00','Efectivo',600,'2024-07-29 14:00:38',NULL,1,NULL),(9,2027,'2024-07-03 00:00:00','Efectivo',400,'2024-07-29 14:01:58',NULL,1,NULL),(10,2027,'2024-07-03 00:00:00','Efectivo',400,'2024-07-29 14:02:10',NULL,1,NULL),(11,2025,'2024-07-12 00:00:00','Efectivo',400,'2024-07-29 14:05:52',NULL,1,NULL),(12,2027,'2024-07-01 00:00:00','Efectivo',999,'2024-07-29 14:07:21',NULL,1,33);
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rol` (
  `rid` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`rid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'Administrador'),(2,'Gerente'),(3,'Medico'),(4,'Secretaria');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(90) DEFAULT NULL,
  `usuario` varchar(45) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rid_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`),
  KEY `rid_fk_idx` (`rid_fk`),
  CONSTRAINT `rid_fk` FOREIGN KEY (`rid_fk`) REFERENCES `rol` (`rid`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Admin','admin','admin',1),(2,'admin2','admin2','$2b$10$5K4iB8RsouZEMCpBFr1Ms.E7y86pLNBSIef9gJhPflciRfeL1NB4m',1),(25,'cuco','cuco','$2a$10$7ggBuj/fR7svn2YVQ9jA5uJdt2/1koRZj952eBGiQNz.U0ZWi3hWy',1),(26,'ariel','ariel','$2b$10$U2qgRRsfY38EZrX/EPjM2eZa9BUUxHZz2mgGibmGDsY6bafyosK6e',1),(27,'test','test','$2b$10$AsrBF/dPcJE46jS8lyNQiefqyT9rZDQwqsE60ElJFs9BpY8aAeT/C',1),(28,'test3','test3','$2b$10$PLN69BUp33bTh971iWAxFeVzSE4pcJWvzhAl4Ek6CnaMoxeweFCZ2',1),(29,'Gary Vasquez','vasquezg','$2b$10$k9//0mkBE.bOEWkP.WYrIeiDzNywjtErNtpAFkMijk2hWvgduluCi',3),(33,'dru','dru','$2b$10$VpExQegvYYw.hlnqkmwzuesXnxkgtDN4FjCTTgRbdQTgbbaZ.bZa.',4);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-29 14:20:17
