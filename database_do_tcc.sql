-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           11.8.2-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para vehicle_info
CREATE DATABASE IF NOT EXISTS `vehicle_info` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `vehicle_info`;

-- Copiando estrutura para tabela vehicle_info.administradores_prf
CREATE TABLE IF NOT EXISTS `administradores_prf` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf` varchar(50) NOT NULL DEFAULT '',
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `data_cadastro` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela vehicle_info.administradores_prf: ~4 rows (aproximadamente)
INSERT INTO `administradores_prf` (`id`, `nome`, `cpf`, `email`, `senha`, `telefone`, `data_cadastro`) VALUES
	(5, 'Dominy Thierry', '528.879.538-00', 'dominy.thierry2007@outlook.com', '$2b$10$miSWaebt.tiubTTec6JgFuVcU39dxvoNQgtIZes/G2iNVMc3Q6OMa', NULL, '2025-09-16 12:30:19'),
	(6, 'LUCAS', '52887953822', 'lucas@gmail.cm', '$2b$10$EgQll2oJ.bYWAefErUXjvuNyfUPsiEynVJguCPVU4wnb6v2s3y1nu', NULL, '2025-09-16 19:18:14'),
	(7, 'Ricardo Barcelos', '000000000000', 'ricardo@gmail.com', '$2b$10$JPm0dtGlJ6EkGQCasyhjm.Z8pkP1ui0AEDxCmC5LNIgffnTMAOsC6', NULL, '2025-09-16 19:26:57'),
	(8, 'ALINE CORDEIRO', '12345678909', 'alinecordeiro@gmail.com', '$2b$10$SMLzhmcyZYsDWRbrUVd1ouvf2fVKFCf5r.BB5JIx0A5bRCfXBGmKu', NULL, '2025-09-18 16:51:06'),
	(9, 'teste testado', '328.879.538-00', 'mongodb@gmail.com', 'b935ea21', NULL, '2025-11-06 16:36:34'),
	(10, 'tots testando', '528.879.338-00', 'dominygame2016@gmail.com', '9e47ca14', NULL, '2025-11-06 18:46:00');

-- Copiando estrutura para tabela vehicle_info.carros
CREATE TABLE IF NOT EXISTS `carros` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `modelo` varchar(100) NOT NULL,
  `ano` int(4) NOT NULL DEFAULT 0,
  `placa` varchar(10) NOT NULL,
  `cor` varchar(50) NOT NULL,
  `RENAVAM` int(11) NOT NULL,
  `tipo_carroceria` varchar(50) NOT NULL,
  `CHASSI` varchar(18) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `placa` (`placa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela vehicle_info.carros: ~0 rows (aproximadamente)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
