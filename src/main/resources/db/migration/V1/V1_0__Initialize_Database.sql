SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

--CREATE SCHEMA IF NOT EXISTS `spidersweb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
--USE `spidersweb` ;

-- -----------------------------------------------------
-- Table `user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NULL,
  `created_on` DATETIME NOT NULL,
  `last_seen` DATETIME NOT NULL,
  `auth_token` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bug_status`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bug_status` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `label` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bug`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bug` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `project` INT UNSIGNED NOT NULL,
  `reporter` INT UNSIGNED NOT NULL,
  `assigned` INT UNSIGNED DEFAULT NULL,
  `subject` VARCHAR(1024) NOT NULL,
  `description` VARCHAR(5000) NULL,
  `created` DATETIME NOT NULL,
  `modified` DATETIME NOT NULL,
  `status` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `bug_reporter_fk_idx` (`reporter` ASC),
  INDEX `bug_assigned_fk_idx` (`assigned` ASC),
  INDEX `bug_project_in` (`project` ASC),
  INDEX `bug_assigned_in` (`assigned` ASC),
  INDEX `bug_status_fk_idx` (`status` ASC),
  CONSTRAINT `bug_reporter_fk`
    FOREIGN KEY (`reporter`)
    REFERENCES `user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `bug_assigned_fk`
    FOREIGN KEY (`assigned`)
    REFERENCES `user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `bug_status_fk`
    FOREIGN KEY (`status`)
    REFERENCES `bug_status` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `created_by` INT UNSIGNED NOT NULL,
  `created_on` TIMESTAMP NOT NULL,
  `key` VARCHAR(45) NOT NULL,
  `status` INT(1) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `comment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `comment` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `contents` VARCHAR(5000) NOT NULL,
  `created_by` INT UNSIGNED NOT NULL,
  `created_on` DATETIME NOT NULL,
  `bug_id` INT UNSIGNED NULL,
  PRIMARY KEY (`id`),
  INDEX `bug_comment_fk_idx` (`bug_id` ASC),
  INDEX `bug_creator_fk_idx` (`created_by` ASC),
  CONSTRAINT `bug_comment_fk`
    FOREIGN KEY (`bug_id`)
    REFERENCES `bug` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `bug_creator_fk`
    FOREIGN KEY (`created_by`)
    REFERENCES `user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `priority`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `priority` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `label` VARCHAR(45) NOT NULL,
  `css_class` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `label`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `label` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `label` VARCHAR(45) NOT NULL,
  `color` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

START TRANSACTION;
USE `spidersweb`;

insert into priority (id,label,css_class) values (1,'Low','low');
insert into priority (id,label,css_class) values (2,'Medium','medium');
insert into priority (id,label,css_class) values (3,'High','high');
INSERT INTO `label` (`id`, `label`, `color`) VALUES (1, 'UI', '1975FF');
INSERT INTO `label` (`id`, `label`, `color`) VALUES (2, 'Styling', '751975');
INSERT INTO `label` (`id`, `label`, `color`) VALUES (3, 'Business', '19A319');
insert into bug_status (id,label) values (1,'Open');
insert into bug_status (id,label) values (2,'Closed');

COMMIT;





