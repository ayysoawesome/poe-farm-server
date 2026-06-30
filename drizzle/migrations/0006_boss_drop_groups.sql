ALTER TABLE `boss_drops` ADD `drop_group_id` text;--> statement-breakpoint
ALTER TABLE `boss_drops` ADD `drop_group_type` text;--> statement-breakpoint
CREATE INDEX `boss_drops_group_idx` ON `boss_drops` (`boss_id`,`drop_group_id`);--> statement-breakpoint
CREATE TRIGGER `boss_drops_group_insert_check`
BEFORE INSERT ON `boss_drops`
WHEN NOT (
  (`NEW`.`drop_group_id` IS NULL AND `NEW`.`drop_group_type` IS NULL)
  OR (`NEW`.`drop_group_id` IS NOT NULL AND length(`NEW`.`drop_group_id`) > 0 AND `NEW`.`drop_group_type` IS NOT NULL AND `NEW`.`drop_group_type` = 'one_of')
)
BEGIN
  SELECT RAISE(ABORT, 'boss_drops_group_type_check');
END;--> statement-breakpoint
CREATE TRIGGER `boss_drops_group_update_check`
BEFORE UPDATE ON `boss_drops`
WHEN NOT (
  (`NEW`.`drop_group_id` IS NULL AND `NEW`.`drop_group_type` IS NULL)
  OR (`NEW`.`drop_group_id` IS NOT NULL AND length(`NEW`.`drop_group_id`) > 0 AND `NEW`.`drop_group_type` IS NOT NULL AND `NEW`.`drop_group_type` = 'one_of')
)
BEGIN
  SELECT RAISE(ABORT, 'boss_drops_group_type_check');
END;
