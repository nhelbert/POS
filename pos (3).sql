-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 30, 2020 at 08:56 AM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pos`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `ID` int(11) NOT NULL,
  `Fullname` varchar(200) NOT NULL,
  `Contact` varchar(200) DEFAULT NULL,
  `Updatedate` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`ID`, `Fullname`, `Contact`, `Updatedate`) VALUES
(1, 'Customer 1', '1', '2020-05-31 17:18:09');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `itemId` int(11) NOT NULL,
  `itemcode` varchar(150) DEFAULT NULL,
  `itemname` varchar(150) DEFAULT NULL,
  `minimumQty` double DEFAULT NULL,
  `actualQty` double DEFAULT NULL,
  `unitid` int(11) DEFAULT NULL,
  `actualprice` double DEFAULT NULL,
  `price` double DEFAULT NULL,
  `supplierId` int(11) DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `addedDate` datetime DEFAULT current_timestamp(),
  `UpdatedDate` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `DeletedDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`itemId`, `itemcode`, `itemname`, `minimumQty`, `actualQty`, `unitid`, `actualprice`, `price`, `supplierId`, `expiryDate`, `addedDate`, `UpdatedDate`, `DeletedDate`) VALUES
(5, '1ww', 'ssss', 1, 0, 1, 1, 1, 1, '2020-06-16', '2020-06-16 20:00:22', '2020-06-16 20:21:38', '2020-06-16 00:00:00'),
(6, '1', '1', 1, 2, 1, 1, 2, 1, '2020-07-26', '2020-07-26 14:47:39', '2020-07-26 14:47:39', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reject`
--

CREATE TABLE `reject` (
  `id` int(11) NOT NULL,
  `itemcode` varchar(250) NOT NULL,
  `type` int(11) NOT NULL,
  `entrydate` datetime NOT NULL DEFAULT current_timestamp(),
  `updateddate` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `qty` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `sale_product`
--

CREATE TABLE `sale_product` (
  `invoiceNo` varchar(50) NOT NULL,
  `itemcode` varchar(150) NOT NULL,
  `qty` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sale_product`
--

INSERT INTO `sale_product` (`invoiceNo`, `itemcode`, `qty`) VALUES
('20200616074713', '1ww', 1),
('20200616080604', '1ww', 1);

-- --------------------------------------------------------

--
-- Table structure for table `sale_transaction`
--

CREATE TABLE `sale_transaction` (
  `invoiceNo` varchar(150) NOT NULL,
  `userId` int(11) NOT NULL,
  `customerId` int(11) DEFAULT NULL,
  `totalPurchase` double NOT NULL,
  `recievedcash` double NOT NULL,
  `change` double NOT NULL,
  `dateEntry` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sale_transaction`
--

INSERT INTO `sale_transaction` (`invoiceNo`, `userId`, `customerId`, `totalPurchase`, `recievedcash`, `change`, `dateEntry`) VALUES
('20200616074713', 1, 1, 1, 10, 9, '2020-06-16 19:47:14'),
('20200616080604', 1, 1, 1, 10, 9, '2020-06-16 20:06:04');

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `supplierId` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `address` varchar(250) NOT NULL,
  `contact` text NOT NULL,
  `entryDate` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedDate` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deletedDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`supplierId`, `name`, `address`, `contact`, `entryDate`, `updatedDate`, `deletedDate`) VALUES
(1, 'supplier 1', 'supplier 1', '1', '2020-05-31 17:15:46', '2020-05-31 17:15:58', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `unitid` int(11) NOT NULL,
  `unitname` varchar(150) NOT NULL,
  `updateddate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `units`
--

INSERT INTO `units` (`unitid`, `unitname`, `updateddate`) VALUES
(1, 'pcs', '2020-02-11 09:29:31'),
(2, 'box', '2020-02-11 09:29:31'),
(3, 'gal', '2020-02-11 09:31:35'),
(4, 'pack', '2020-02-11 09:31:35'),
(5, 'case', '2020-02-11 09:32:31');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `Fname` varchar(150) DEFAULT NULL,
  `Mname` varchar(150) DEFAULT NULL,
  `Lname` varchar(150) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(50) DEFAULT NULL,
  `UserType` int(11) DEFAULT NULL,
  `Branch` int(11) DEFAULT NULL,
  `Login` datetime DEFAULT NULL,
  `Created` datetime DEFAULT current_timestamp(),
  `Updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Deleted` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`ID`, `Fname`, `Mname`, `Lname`, `Email`, `Username`, `Password`, `UserType`, `Branch`, `Login`, `Created`, `Updated`, `Deleted`) VALUES
(1, 'Nhelbert Jhon', 'Barredo', 'Encarnacion', 'Nhel', 'nhel', 'nhel', 1, 1, NULL, '2020-02-09 15:47:16', '2020-05-31 15:33:07', NULL),
(12, 'Demsent', 'Tadifa', 'Sadsad', 'Demsenttadifasadsad', 'Dems', 'dems', 1, 1, NULL, '2020-02-17 17:35:39', '2020-05-31 15:32:46', NULL),
(44, 'sample', 'sample', 'sample', 'sample', 'sample', 'sample', 2, 1, NULL, '2020-03-25 18:18:27', '2020-05-31 15:32:42', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`itemId`);

--
-- Indexes for table `reject`
--
ALTER TABLE `reject`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sale_product`
--
ALTER TABLE `sale_product`
  ADD PRIMARY KEY (`invoiceNo`,`itemcode`);

--
-- Indexes for table `sale_transaction`
--
ALTER TABLE `sale_transaction`
  ADD PRIMARY KEY (`invoiceNo`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`supplierId`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`unitid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`,`Username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `itemId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `reject`
--
ALTER TABLE `reject`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `supplierId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `unitid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
