-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 17, 2025 at 11:37 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bayanihan_relief`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`, `name`, `token`, `active`, `last_login`, `created_at`) VALUES
(1, 'admin', '$2a$12$C0zmhAr2szRun0NfVOlMluCBR6orYcnr9OaUcuPh91desJxuBN7Xa', 'System Administrator', '7634c4af19e97ee1cc6835cbab8d3fd0acd577e3ce5b7c774c2dc566475ba6e9', 1, '2025-11-17 22:11:57', '2025-11-17 21:49:27');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

-- --------------------------------------------------------
-- Table: organization
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `organization` (
  `Organization_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Organization_Name` varchar(255) NOT NULL,
  `Organization_Type` varchar(50) NOT NULL,
  `Organization_Status` tinyint(1) DEFAULT 1,
  `Organization_Contact_Person` varchar(100) NOT NULL,
  `Organization_Contact_Person_Position` varchar(100) DEFAULT NULL,
  `Organization_Email` varchar(150) NOT NULL,
  `Organization_Phone` varchar(30) NOT NULL,
  `Organization_Address` text DEFAULT NULL,
  `Organization_Link` varchar(255) DEFAULT NULL,
  `Admin_Notes` text DEFAULT NULL,
  `Organization_Created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`Organization_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: donations (monetary)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `donations` (
  `Donation_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Donor_FirstName` varchar(100) NOT NULL,
  `Donor_LastName` varchar(100) NOT NULL,
  `Donor_Email` varchar(150) NOT NULL,
  `Donor_Phone` varchar(30) DEFAULT NULL,
  `Donor_Message` text DEFAULT NULL,
  `Is_Anonymous` tinyint(1) DEFAULT 0,
  `Donation_Amount` decimal(12,2) NOT NULL,
  `Payment_Method` varchar(50) NOT NULL,
  `Reference_Number` varchar(50) NOT NULL,
  `Receipt_Path` varchar(255) DEFAULT NULL,
  `Status` enum('pending','verified','received','distributed','rejected') DEFAULT 'pending',
  `Donation_Date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`Donation_ID`),
  UNIQUE KEY `Reference_Number` (`Reference_Number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: in_kind_donations
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `in_kind_donations` (
  `Item_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Item_Name` varchar(255) NOT NULL,
  `Item_Category` varchar(50) NOT NULL,
  `Item_Amount` int(11) NOT NULL,
  `Item_Unit` varchar(50) NOT NULL,
  `Item_Donor` varchar(150) NOT NULL,
  `Item_Date` date NOT NULL,
  `Item_Location` varchar(255) DEFAULT NULL,
  `Item_Expiration_Date` date DEFAULT NULL,
  `Item_Status` enum('pending','verified','stored','allocated','distributed') DEFAULT 'pending',
  `Notes` text DEFAULT NULL,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`Item_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: distributions
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `distributions` (
  `Distribution_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Refferences` varchar(50) NOT NULL,
  `Location` varchar(255) NOT NULL,
  `TIME_DATE` date NOT NULL,
  `Beneficiaries` int(11) NOT NULL DEFAULT 0,
  `Team_Leader` varchar(100) NOT NULL,
  `Status` enum('pending','ongoing','completed','cancelled') DEFAULT 'pending',
  `Money_minimum_limit` decimal(12,2) DEFAULT 0.00,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`Distribution_ID`),
  UNIQUE KEY `Refferences` (`Refferences`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
