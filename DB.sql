/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


drop table if exists `ACTIVITY_LOG`;
create table `ACTIVITY_LOG` (
  `id` int(11) not null AUTO_INCREMENT,
  `created_at` timestamp not null default current_timestamp,
  `user_name` text,
  `note_title` text,
  `column_title` text,
  `column_to_title` text,
  `change_title` text,
  `type` varchar(6) default null,
  `method` varchar(6) default null,
  primary key (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 default CHARSET=utf8mb4;

drop table if exists `column`;
create table `column` (
  `id` int(11) not null AUTO_INCREMENT,
  `kanban_id` int(11) not null,
  `user_id` int(11) not null,
  `title` text not null,
  `order` tinyint(1) not null,
  primary key (`id`),
  key `kanban_id` (`kanban_id`),
  key `user_id` (`user_id`),
  constraint `column_ibfk_1` foreign key (`kanban_id`) references `KANBAN` (`id`),
  constraint `column_ibfk_2` foreign key (`user_id`) references `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 default CHARSET=utf8mb4;

drop table if exists `KANBAN`;
create table `KANBAN` (
  `id` int(11) not null AUTO_INCREMENT,
  `title` varchar(45) not null,
  primary key (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 default CHARSET=utf8mb4;

drop table if exists `NOTE`;
create table `NOTE` (
  `id` int(11) not null AUTO_INCREMENT,
  `column_id` int(11) not null,
  `user_id` int(11) not null,
  `content` text not null,
  `prev_note_id` int(11) default null,
  `next_note_id` int(11) default null,
  `created_at` timestamp not null default current_timestamp,
  primary key (`id`),
  key `FK_NOTE_user_id_USER_id` (`user_id`),
  key `column_id` (`column_id`),
  constraint `FK_NOTE_user_id_USER_id` foreign key (`user_id`) references `user` (`id`),
  constraint `note_ibfk_1` foreign key (`column_id`) references `column` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 default CHARSET=utf8mb4;

drop table if exists `user`;
create table `user` (
  `id` int(11) not null AUTO_INCREMENT,
  `name` text not null,
  `profile_image` text not null,
  primary key (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 default CHARSET=utf8mb4;

drop table if exists `USER_PERMISSION`;
create table `USER_PERMISSION` (
  `khanban_id` int(11) not null,
  `user_id` int(11) not null,
  `read` tinyint(1) not null,
  `create` tinyint(1) not null,
  `modify` tinyint(1) not null,
  `delete` tinyint(1) not null,
  primary key (`khanban_id`,`user_id`),
  key `FK_USER_PERMISSION_user_id_USER_id` (`user_id`),
  constraint `FK_USER_PERMISSION_user_id_USER_id` foreign key (`user_id`) references `user` (`id`),
  constraint `user_permission_ibfk_1` foreign key (`khanban_id`) references `KANBAN` (`id`)
) ENGINE=InnoDB default CHARSET=utf8mb4;

drop table if exists `USER_TOKEN`;
create table `USER_TOKEN` (
  `id` int(11) not null AUTO_INCREMENT,
  `user_id` int(11) not null,
  `token` text not null,
  `expired_at` timestamp not null default current_timestamp on update current_timestamp,
  primary key (`id`),
  key `FK_USER_TOKEN_user_id_USER_id` (`user_id`),
  constraint `FK_USER_TOKEN_user_id_USER_id` foreign key (`user_id`) references `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 default CHARSET=utf8mb4;



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;