-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
<<<<<<< HEAD
-- Час створення: Лис 23 2026 р., 11:00
=======
-- Час створення: Лис 18 2026 р., 15:59
>>>>>>> 253f8137faede680710e0c0a9a6bfda5b4a91c1d
-- Версія сервера: 10.4.32-MariaDB
-- Версія PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
<<<<<<< HEAD
-- База даних: ` kniznica_db`
=======
-- База даних: `kniznica_db`
>>>>>>> 253f8137faede680710e0c0a9a6bfda5b4a91c1d
--

-- --------------------------------------------------------

--
-- Структура таблиці `knihy`
--

CREATE TABLE `knihy` (
  `id` int(11) NOT NULL,
  `nazov` varchar(150) NOT NULL,
  `autor` varchar(120) NOT NULL,
  `rok` int(11) NOT NULL,
  `cena` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп даних таблиці `knihy`
--

INSERT INTO `knihy` (`id`, `nazov`, `autor`, `rok`, `cena`) VALUES
(3, 'Duna', 'Herbert', 1996, 9.90),
(4, 'Pride and Prejudice', 'Jane Austen', 1970, 10.01),
(5, 'To Kill a Mockingbird', 'Harper Lee', 1930, 12.10),
(7, 'The Call of the Wild', 'Jack London', 1903, 7.21),
(8, 'Verity', 'Colleen Hoover', 2020, 100.00);

<<<<<<< HEAD
-- --------------------------------------------------------

--
-- Структура таблиці `pouzivatelia`
--

CREATE TABLE `pouzivatelia` (
  `id` int(11) NOT NULL,
  `meno` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `heslo_hash` varchar(255) NOT NULL,
  `vytvoreny` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп даних таблиці `pouzivatelia`
--

INSERT INTO `pouzivatelia` (`id`, `meno`, `email`, `heslo_hash`, `vytvoreny`) VALUES
(3, 'vlad', 'dddd@gmail.com', '$2b$10$OyBVPKaw2UchsdLruFmYo.YlyZ422vnkzWs7ICmWRQwO4y7BHbZ/2', '2026-11-23 09:51:34');

=======
>>>>>>> 253f8137faede680710e0c0a9a6bfda5b4a91c1d
--
-- Індекси збережених таблиць
--

--
-- Індекси таблиці `knihy`
--
ALTER TABLE `knihy`
  ADD PRIMARY KEY (`id`);

--
<<<<<<< HEAD
-- Індекси таблиці `pouzivatelia`
--
ALTER TABLE `pouzivatelia`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
=======
>>>>>>> 253f8137faede680710e0c0a9a6bfda5b4a91c1d
-- AUTO_INCREMENT для збережених таблиць
--

--
-- AUTO_INCREMENT для таблиці `knihy`
--
ALTER TABLE `knihy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
<<<<<<< HEAD

--
-- AUTO_INCREMENT для таблиці `pouzivatelia`
--
ALTER TABLE `pouzivatelia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
=======
>>>>>>> 253f8137faede680710e0c0a9a6bfda5b4a91c1d
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
