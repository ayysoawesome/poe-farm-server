CREATE TABLE `latest_item_prices` (
	`item_id` text NOT NULL,
	`league_id` text NOT NULL,
	`source` text NOT NULL,
	`sync_run_id` text NOT NULL,
	`chaos_value` real NOT NULL,
	`captured_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`item_id`, `league_id`, `source`),
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`league_id`) REFERENCES `leagues`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sync_run_id`) REFERENCES `sync_runs`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "latest_item_prices_chaos_value_check" CHECK(`chaos_value` >= 0)
);
--> statement-breakpoint
CREATE INDEX `latest_item_prices_item_league_idx` ON `latest_item_prices` (`item_id`,`league_id`);
--> statement-breakpoint
CREATE INDEX `latest_item_prices_sync_run_idx` ON `latest_item_prices` (`sync_run_id`);
--> statement-breakpoint
INSERT INTO `latest_item_prices` (
	`item_id`,
	`league_id`,
	`source`,
	`sync_run_id`,
	`chaos_value`,
	`captured_at`,
	`created_at`,
	`updated_at`
)
SELECT
	`item_id`,
	`league_id`,
	`source`,
	`sync_run_id`,
	`chaos_value`,
	`captured_at`,
	`created_at`,
	`created_at`
FROM (
	SELECT
		`item_prices`.*,
		ROW_NUMBER() OVER (
			PARTITION BY `item_id`, `league_id`, `source`
			ORDER BY `captured_at` DESC, `id` DESC
		) AS `row_number`
	FROM `item_prices`
)
WHERE `row_number` = 1;
--> statement-breakpoint
CREATE TABLE `latest_profit_snapshots` (
	`id` text NOT NULL,
	`boss_id` text NOT NULL,
	`league_id` text NOT NULL,
	`sync_run_id` text NOT NULL,
	`entry_cost_chaos` real NOT NULL,
	`expected_return_chaos` real NOT NULL,
	`expected_profit_chaos` real NOT NULL,
	`roi_percent` real NOT NULL,
	`divine_orb_chaos_value` real NOT NULL,
	`is_complete` integer NOT NULL,
	`unknown_drop_count` integer NOT NULL,
	`calculated_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`boss_id`, `league_id`),
	FOREIGN KEY (`boss_id`) REFERENCES `bosses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`league_id`) REFERENCES `leagues`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sync_run_id`) REFERENCES `sync_runs`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "latest_profit_snapshots_divine_orb_chaos_value_check" CHECK(`divine_orb_chaos_value` > 0),
	CONSTRAINT "latest_profit_snapshots_is_complete_check" CHECK(`is_complete` in (0, 1)),
	CONSTRAINT "latest_profit_snapshots_unknown_drop_count_check" CHECK(`unknown_drop_count` >= 0 and `unknown_drop_count` = cast(`unknown_drop_count` as integer))
);
--> statement-breakpoint
CREATE INDEX `latest_profit_snapshots_league_idx` ON `latest_profit_snapshots` (`league_id`);
--> statement-breakpoint
CREATE INDEX `latest_profit_snapshots_sync_run_idx` ON `latest_profit_snapshots` (`sync_run_id`);
--> statement-breakpoint
INSERT INTO `latest_profit_snapshots` (
	`id`,
	`boss_id`,
	`league_id`,
	`sync_run_id`,
	`entry_cost_chaos`,
	`expected_return_chaos`,
	`expected_profit_chaos`,
	`roi_percent`,
	`divine_orb_chaos_value`,
	`is_complete`,
	`unknown_drop_count`,
	`calculated_at`,
	`created_at`,
	`updated_at`
)
SELECT
	`id`,
	`boss_id`,
	`league_id`,
	`sync_run_id`,
	`entry_cost_chaos`,
	`expected_return_chaos`,
	`expected_profit_chaos`,
	`roi_percent`,
	`divine_orb_chaos_value`,
	`is_complete`,
	`unknown_drop_count`,
	`calculated_at`,
	`created_at`,
	`created_at`
FROM (
	SELECT
		`profit_snapshots`.*,
		ROW_NUMBER() OVER (
			PARTITION BY `boss_id`, `league_id`
			ORDER BY `calculated_at` DESC, `id` DESC
		) AS `row_number`
	FROM `profit_snapshots`
)
WHERE `row_number` = 1;
