-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 27, 2026 at 01:00 AM
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
-- Database: `crbs`
--

-- --------------------------------------------------------

--
-- Table structure for table `blacklisted_tokens`
--

CREATE TABLE `blacklisted_tokens` (
  `id` int(11) NOT NULL,
  `tokenHash` varchar(64) NOT NULL,
  `expiresAt` datetime NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blacklisted_tokens`
--

INSERT INTO `blacklisted_tokens` (`id`, `tokenHash`, `expiresAt`, `createdAt`) VALUES
(1, '8e53d3c3cd4023e32e225deabf93ab14e77f31cc8ee5800dcd901943ec871bb9', '2026-06-26 05:28:59', '2026-06-25 05:29:28'),
(2, '37e6734f828e090dc79f4ea6f87a9333592607e4365eb04bd5af376b52e21a27', '2026-06-26 05:30:12', '2026-06-25 14:38:13'),
(3, '3c069fb6d9a968fc7d70029ab8428486c79225592a0b39883f9abcfee735b1e2', '2026-06-26 14:39:03', '2026-06-25 14:51:06'),
(4, 'cea6be60389725428f36a3865522802120db522496c6573342582e6b8da92679', '2026-06-26 14:51:13', '2026-06-25 14:55:40'),
(5, '057b4dce4ddf12552cef05356bc16da31888b602d9c955b6174627dad39a51d7', '2026-06-26 14:55:56', '2026-06-25 15:20:01'),
(6, '6140ab2b24f7666e0c31471a84a5f7fe4ac654f3a1abd3c8014736692d187482', '2026-06-26 15:20:11', '2026-06-25 15:26:19'),
(7, '1318eb04ba68426e798a8cc983951a0873efde0564e2a914bb9353a421ba700b', '2026-06-26 15:30:58', '2026-06-25 19:07:23'),
(8, '6b059c0140ddb020029e093a08a3822c9b4dba980028b756c6ba13d3618ccc5e', '2026-06-26 19:21:50', '2026-06-25 19:22:10'),
(9, '07ef149ba103df68202a7b196ab834687b211fb1a01a5d3127e6ab1c7ff576bb', '2026-06-26 19:22:23', '2026-06-25 19:23:28'),
(10, '331b9f0c1987997f280b5fc9f8a084b1f876c067a07f429a6093bc3309434a48', '2026-06-26 19:23:31', '2026-06-25 19:23:46'),
(11, '2e9c14e9ce5e4f886f77b45ed8b5bad19ab8aa046846838263dd44d0878ccc7a', '2026-06-26 19:23:50', '2026-06-25 19:30:26'),
(12, '22ee40b5a6353d596704c0ecb92baf4ce69a857f2d0eba6d79ee7ec466ece5f5', '2026-06-26 19:30:35', '2026-06-25 19:52:48'),
(13, 'a7d4159f278ef2225bd46c466da101d9b827e14edaa1b4c8bbfdec49f5318a7f', '2026-06-26 19:53:23', '2026-06-25 19:54:23'),
(14, 'adb9b6d9c9e5b3368a38c53de020631d8e659e0a3148f7e5d88808f28b077d2c', '2026-06-26 19:54:34', '2026-06-25 22:56:28'),
(15, '85b241f426776b726624f7282471e812414ba16ae08404756d365a7785027336', '2026-06-26 22:56:31', '2026-06-25 22:56:54'),
(16, '5028dacb1412a71421d74fb4dc4441d156633cbfe5b5810e8581c52c0a08c5db', '2026-06-26 22:56:57', '2026-06-25 23:20:02'),
(17, 'c5a52d068a06531faabed89a8affc13cc10cbb2f217561bf75ebea617fddfbba', '2026-06-26 23:20:12', '2026-06-25 23:21:23'),
(18, 'cbe54cb7e45cf4082918aa16e4148641f520524151c27602c145075709ad7058', '2026-06-26 23:22:05', '2026-06-25 23:31:29'),
(19, '48fbb6bb037bd2c70d5dd5de5f86acbb5b3210c8c9e578d2b1e144af9ac29631', '2026-06-26 23:31:31', '2026-06-26 22:27:19'),
(20, 'f17b2941df14b3d37a78badc74f2d0adb0b17bfae6d060ed2e3e7e1daa8cd59b', '2026-06-27 22:51:04', '2026-06-26 22:51:55'),
(21, '2860c176f483be723e21f98934ba600e8d7f6c1edb02c757663d3a922a23ea00', '2026-06-27 22:51:59', '2026-06-26 22:52:50'),
(22, 'a03c39a83e39e9c06faf9b4d6a032d506f64b21562b795807d6cf220347ed70c', '2026-06-27 22:52:53', '2026-06-26 22:53:12'),
(23, '33b84059174faf0d13f63e907f6666eabb0ba96aa6d7d6b622fb2f26520909af', '2026-06-27 22:53:24', '2026-06-26 22:56:10'),
(24, 'a54a63fa44d4479a1c1bbc31fd51afd0b3e66fbf11c02e67c27ee1c900c01815', '2026-06-27 22:56:13', '2026-06-26 23:33:30'),
(25, 'd973321e0810c5449a7970437e755c36be3169a01f3301e1692cea615770e675', '2026-06-27 23:33:35', '2026-06-26 23:33:58'),
(26, 'ce48fa7f702867feb6128086a0c62c8af067fd7d15e3c8d16c987ce6221f8517', '2026-06-27 23:34:10', '2026-06-26 23:34:22'),
(27, '9bfb87bc8c5d824a89fd1b15e554d701bd06a56b83612e9799ea04af0398ca29', '2026-06-27 23:34:26', '2026-06-26 23:37:01'),
(28, '8b7cef395968d9a12ddb61ba1736566d4166958db666d5e0673093659801749d', '2026-06-27 23:37:03', '2026-06-26 23:40:06'),
(29, '7e0f3ae9524dd6ef7128ad6c64f26cedb8c3ddb04ac11314feeb5f05378c91b3', '2026-06-27 23:40:10', '2026-06-27 05:15:05'),
(30, '0a4d4e767f95bc929a8ce418880855ce0bf642f6087debd23348b003853a638d', '2026-06-28 05:15:07', '2026-06-27 05:15:46'),
(31, 'b194bfd01491e858c8d813db69dc3ac82c7cac93c4283acd6610bcb4118fe305', '2026-06-28 05:15:58', '2026-06-27 05:22:55'),
(32, '33f517b6d0f53c489043d6da90d33628ad57912c59d01ee32e5adfac932f4159', '2026-06-28 05:23:00', '2026-06-27 05:42:56'),
(33, '1f8f7bb5af2805e7d9faea0b6a56313dfa8770a8ca0b7176abce24aba1651e39', '2026-06-28 05:43:00', '2026-06-27 05:43:22'),
(34, '4c0b07b67f5f90a7953fc2b2c3c9f13e445fecba7a675a90998f8fac7a97d442', '2026-06-28 05:43:33', '2026-06-27 05:44:23'),
(35, 'ca1a13c63e4133085bbc3262b2503bb472b1075e3d2e9c70c82bc0620ead9aa3', '2026-06-28 05:44:28', '2026-06-27 06:10:05'),
(36, '439a13953eb06cf647871b6fa966a2f0bec3392cb58fdda2d0fdab41ba264278', '2026-06-28 06:10:29', '2026-06-27 06:13:26'),
(37, 'c80c80222a43722ed7810d382437bf65cd9610de89aaa9315f5752c17dac3ea4', '2026-06-28 06:13:30', '2026-06-27 06:13:34');

-- --------------------------------------------------------

--
-- Table structure for table `bookingpolicy`
--

CREATE TABLE `bookingpolicy` (
  `policyID` int(11) NOT NULL,
  `maxAdvanceDays` int(11) NOT NULL,
  `minimumNotice` varchar(50) NOT NULL,
  `maximumDuration` varchar(50) NOT NULL,
  `cancellationDeadline` varchar(100) NOT NULL,
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookingpolicy`
--

INSERT INTO `bookingpolicy` (`policyID`, `maxAdvanceDays`, `minimumNotice`, `maximumDuration`, `cancellationDeadline`, `updatedAt`) VALUES
(1, 10, '20 hours', '13 hours', '12 hours before booking', '2026-06-27 05:42:01');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `bookingID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `resourceID` int(11) NOT NULL,
  `startDateTime` datetime NOT NULL,
  `endDateTime` datetime NOT NULL,
  `status` enum('Pending','Confirmed','Cancelled','Rejected','Completed') NOT NULL DEFAULT 'Pending',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`bookingID`, `userID`, `resourceID`, `startDateTime`, `endDateTime`, `status`, `createdAt`) VALUES
(1, 5, 1, '2026-06-30 10:00:00', '2026-06-30 12:00:00', 'Rejected', '2026-06-25 14:54:07'),
(16, 6, 2, '2026-07-01 19:48:00', '2026-07-01 23:46:00', 'Confirmed', '2026-06-25 19:46:36'),
(17, 6, 3, '2026-06-25 20:51:00', '2026-06-25 00:50:00', 'Pending', '2026-06-25 19:51:03'),
(18, 2, 6, '2026-06-05 22:53:00', '2026-06-05 12:52:00', 'Confirmed', '2026-06-26 22:52:29'),
(19, 7, 1, '2026-06-10 22:55:00', '2026-06-10 22:59:00', 'Pending', '2026-06-26 22:54:36'),
(20, 2, 5, '2026-06-30 13:40:00', '2026-06-30 14:40:00', 'Cancelled', '2026-06-26 23:40:30'),
(21, 2, 2, '2026-06-27 06:36:00', '2026-06-27 07:36:00', 'Pending', '2026-06-27 05:36:27'),
(22, 2, 5, '2026-06-30 06:36:00', '2026-06-30 08:37:00', 'Pending', '2026-06-27 05:37:02');

-- --------------------------------------------------------

--
-- Table structure for table `booking_approvals`
--

CREATE TABLE `booking_approvals` (
  `approvalID` int(11) NOT NULL,
  `bookingID` int(11) NOT NULL,
  `approvedBy` int(11) NOT NULL,
  `approvalStatus` enum('Approved','Rejected','Pending') NOT NULL DEFAULT 'Pending',
  `remarks` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `policylog`
--

CREATE TABLE `policylog` (
  `logID` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `updatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `policy_logs`
--

CREATE TABLE `policy_logs` (
  `logID` int(11) NOT NULL,
  `changedBy` int(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `changedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `policy_logs`
--

INSERT INTO `policy_logs` (`logID`, `changedBy`, `description`, `changedAt`) VALUES
(1, 1, 'Booking policy updated.', '2026-06-26 22:26:47'),
(2, 1, 'Booking policy updated.', '2026-06-26 22:51:21');

-- --------------------------------------------------------

--
-- Table structure for table `resources`
--

CREATE TABLE `resources` (
  `resourceID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `status` enum('Available','Maintenance','Inactive') DEFAULT 'Available',
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resources`
--

INSERT INTO `resources` (`resourceID`, `name`, `type`, `location`, `capacity`, `status`, `createdAt`) VALUES
(1, 'Computer Lab 1', 'Lab', 'Block A', 40, 'Available', '2026-06-25 14:50:21'),
(2, 'Computer Lab 2', 'AV', 'Block B', 35, 'Inactive', '2026-06-25 14:50:21'),
(4, 'Lecture Hall A', 'Hall', 'Main Building', 120, 'Maintenance', '2026-06-25 14:50:21'),
(5, 'Asyraf Room', 'Room', 'FCI Building', 12, 'Available', '2026-06-25 20:01:12'),
(6, 'Jasonnn Lab', 'Lab', 'FCI Building', 15, 'Available', '2026-06-25 20:21:30'),
(8, 'finnese AV(updated)', 'AV', 'FOM', 20, 'Available', '2026-06-25 23:19:30');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `role` enum('Student','FacultyStaff','ResourceManager','Admin') NOT NULL DEFAULT 'Student',
  `department` varchar(255) DEFAULT NULL,
  `campusId` varchar(50) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `name`, `email`, `passwordHash`, `role`, `department`, `campusId`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'System Admin', 'admin@mmu.edu.my', '$2a$12$LJ3m4ys3Lg3YOCwKkC1CYuGhlYOBMGCWCj3GOrHoDAzM0lQJ0Nh7e', 'Admin', 'Administration', NULL, 1, '2026-06-25 04:11:58', '2026-06-25 04:11:58'),
(2, 'Asyraf', 'asy@gmail.com', '$2b$12$t3xvOP8bt3xlmvpDODo7suWVmMcNBlNQF3LqOSXf50Dbc5GUDAazW', 'Student', 'adsasd', '252Uc25344', 1, '2026-06-25 05:05:08', '2026-06-25 05:05:08'),
(3, 'Asyraf', 'asy04@gmail.com', '$2b$12$estrdq/Yf3l17EUTA83wOu29840uhs1L41XTJq77ScDsFntlohTfq', 'Admin', 'adsasd', '252Uc25344', 1, '2026-06-25 05:05:47', '2026-06-25 05:05:47'),
(4, 'MUHAMMAD KHAIR ASYRAF', 'nickasyraf04@gmail.com', '$2b$12$zb0MFstqAYN3NYrAe0bFnOCqoalkxgJPjtK57WeMJyta0f8fZLKQ6', 'Student', 'FACULTY OF COMPUTING', '252UC25344', 1, '2026-06-25 05:29:59', '2026-06-25 05:29:59'),
(5, 'Admin', 'adminmanagement@mmu.edu.my', '$2b$12$8fyi44XH4BTkuY3hYCiHlevMH2E3f9aXF1TCc54NyKuhOYML/N6Xa', 'Admin', 'faculty of management', '1221205150', 1, '2026-06-25 14:38:52', '2026-06-25 14:38:52'),
(6, 'aiman', 'aim@gmail.com', '$2b$12$EpJLHcUnUWiWJG6w6B2JTOXIrNTqCV/wYcdCIUgzmT2lIs/NQDtLi', 'Student', 'FACULTY OF COMPUTING', '21123212', 1, '2026-06-25 19:22:17', '2026-06-25 19:22:17'),
(7, 'umar', 'uma@gmail.com', '$2b$12$frUJZWlbysSN2BOrI0WIzehtVOFTdttnGwE8xOTkm/KwswyaBo8f2', 'FacultyStaff', 'FACULTY OF MEDIA', '231231231', 1, '2026-06-25 19:53:16', '2026-06-25 19:53:16'),
(8, 'Jason Ginga', 'jason@gmail.com', '$2b$12$xuVfKE.yECIzpllSqBt.KuYxs/DctnvXyqSc2iBR0cmSyhLydz.Yy', 'Student', 'FACULTY OF COMPUTING', '2456789011', 1, '2026-06-27 06:14:00', '2026-06-27 06:14:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blacklisted_tokens`
--
ALTER TABLE `blacklisted_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tokenHash` (`tokenHash`),
  ADD KEY `idx_tokenHash` (`tokenHash`);

--
-- Indexes for table `bookingpolicy`
--
ALTER TABLE `bookingpolicy`
  ADD PRIMARY KEY (`policyID`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`bookingID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `booking_approvals`
--
ALTER TABLE `booking_approvals`
  ADD PRIMARY KEY (`approvalID`),
  ADD KEY `bookingID` (`bookingID`),
  ADD KEY `approvedBy` (`approvedBy`);

--
-- Indexes for table `policylog`
--
ALTER TABLE `policylog`
  ADD PRIMARY KEY (`logID`);

--
-- Indexes for table `policy_logs`
--
ALTER TABLE `policy_logs`
  ADD PRIMARY KEY (`logID`);

--
-- Indexes for table `resources`
--
ALTER TABLE `resources`
  ADD PRIMARY KEY (`resourceID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blacklisted_tokens`
--
ALTER TABLE `blacklisted_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `bookingpolicy`
--
ALTER TABLE `bookingpolicy`
  MODIFY `policyID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `bookingID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `booking_approvals`
--
ALTER TABLE `booking_approvals`
  MODIFY `approvalID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `policylog`
--
ALTER TABLE `policylog`
  MODIFY `logID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `policy_logs`
--
ALTER TABLE `policy_logs`
  MODIFY `logID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `resources`
--
ALTER TABLE `resources`
  MODIFY `resourceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `booking_approvals`
--
ALTER TABLE `booking_approvals`
  ADD CONSTRAINT `booking_approvals_ibfk_1` FOREIGN KEY (`bookingID`) REFERENCES `bookings` (`bookingID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `booking_approvals_ibfk_2` FOREIGN KEY (`approvedBy`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
