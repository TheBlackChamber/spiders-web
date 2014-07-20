ALTER TABLE bug ADD COLUMN priority INT UNSIGNED;
ALTER TABLE bug ADD FOREIGN KEY (priority) REFERENCES priority(id);

CREATE TABLE IF NOT EXISTS `bug_label` (
  `bug_id` INT UNSIGNED NOT NULL,
  `label_id` INT UNSIGNED NOT NULL,
  CONSTRAINT `bl_bug_id_fk`
    FOREIGN KEY (`bug_id`)
    REFERENCES `bug` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `bl_label_id_fk`
    FOREIGN KEY (`label_id`)
    REFERENCES `label` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;