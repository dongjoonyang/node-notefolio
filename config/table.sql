/* 테이블 생성 */

-- 작가 정보
CREATE TABLE `author` (
    `id` varchar(11) NOT NULL,
    `password` int(9) NOT NULL,
    PRIMARY KEY (`id`) 
);

-- 메인 카테고리
CREATE TABLE `main_category` (
    `main_id` int primary key auto_increment,
    `main_title` varchar(100) not null
);

-- 서브 카테고리
CREATE TABLE `sub_category` (
    `sub_id` int primary key auto_increment,
    `sub_title` varchar(100) not null,
    `main_id` int not null,
    constraint `fk_main_id` foreign key(`main_id`) references `main_category`(`main_id`)
);

-- 작가 아이템
-- admin 패스워드 설정
INSERT INTO `author` (id, password) VALUES ('admin', '');

-- 메인 카테고리 아이템
INSERT INTO `main_category` (main_title) VALUES ('project');
INSERT INTO `main_category` (main_title) VALUES ('artwork');


/* 게시판 */ 

-- 메인 게시판
CREATE TABLE `board`(
    `idx` int(11) NOT NULL AUTO_INCREMENT,
    `image` varchar(50) NOT NULL,
    `title` varchar(50) NOT NULL,
    `content` mediumtext,
    `regdate` datetime NOT NULL,
    `modidate` datetime NOT NULL,
    `main_id` int(11) NOT NULL,
    `sub_id` int(11) NOT NULL,
    PRIMARY KEY(`IDX`),
    constraint `fk_board_main_id` foreign key(`main_id`) references `main_category`(`main_id`),
    constraint `fk_board_sub_id` foreign key(`sub_id`) references `sub_category`(`sub_id`)
);

-- 메인 게시판 아이템
INSERT INTO `board`(`image`,`title`,`content`,`regdate`,`modidate`,`main_id`,`sub_id`)
VALUES ('image.png','제목','내용','2022-05-01 15:42:00','2022-05-01 15:43:00','1','');