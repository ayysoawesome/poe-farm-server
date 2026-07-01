PRAGMA defer_foreign_keys = true;
--> statement-breakpoint
INSERT OR IGNORE INTO `sync_runs` (
	`id`,
	`type`,
	`status`,
	`started_at`,
	`finished_at`,
	`message`,
	`created_at`
) VALUES (
	'migration-legacy-price-set',
	'migration',
	'success',
	0,
	0,
	'Legacy prices and snapshots migrated to synchronized pricing model',
	0
);
--> statement-breakpoint
CREATE TABLE `__migration_divine_price_guard` (
	`is_valid` integer NOT NULL,
	CONSTRAINT "migration_divine_price_guard_check" CHECK (`is_valid` = 1)
);
--> statement-breakpoint
INSERT INTO `__migration_divine_price_guard` (`is_valid`)
SELECT CASE
	WHEN EXISTS (
		SELECT 1
		FROM (
			SELECT `league_id`
			FROM `item_prices`
			UNION
			SELECT `league_id`
			FROM `profit_snapshots`
		) AS snapshot_league
		WHERE NOT EXISTS (
			SELECT 1
			FROM `item_prices`
			WHERE `item_id` = 'divine-orb'
				AND `league_id` = snapshot_league.`league_id`
			AND `chaos_value` > 0
		)
	)
	OR EXISTS (
		SELECT 1
		FROM `profit_snapshots` AS snapshot
		WHERE NOT EXISTS (
			SELECT 1
			FROM `item_prices` AS price
			WHERE price.`item_id` = 'divine-orb'
				AND price.`league_id` = snapshot.`league_id`
				AND price.`chaos_value` > 0
				AND price.`captured_at` <= snapshot.`calculated_at`
		)
	)
	THEN 0
	ELSE 1
END;
--> statement-breakpoint
DROP TABLE `__migration_divine_price_guard`;
--> statement-breakpoint
CREATE TABLE `__migration_entry_component_duplicate_guard` (
	`is_valid` integer NOT NULL,
	CONSTRAINT "migration_entry_component_duplicate_guard_check" CHECK (`is_valid` = 1)
);
--> statement-breakpoint
INSERT INTO `__migration_entry_component_duplicate_guard` (`is_valid`)
SELECT CASE
	WHEN EXISTS (
		SELECT 1
		FROM `boss_entry_costs`
		GROUP BY `boss_id`, `item_id`
		HAVING COUNT(*) > 1
	)
	THEN 0
	ELSE 1
END;
--> statement-breakpoint
DROP TABLE `__migration_entry_component_duplicate_guard`;
--> statement-breakpoint
CREATE TABLE `__migration_boss_drop_duplicate_guard` (
	`is_valid` integer NOT NULL,
	CONSTRAINT "migration_boss_drop_duplicate_guard_check" CHECK (`is_valid` = 1)
);
--> statement-breakpoint
INSERT INTO `__migration_boss_drop_duplicate_guard` (`is_valid`)
SELECT CASE
	WHEN EXISTS (
		SELECT 1
		FROM `boss_drops`
		GROUP BY `boss_id`, `item_id`
		HAVING COUNT(*) > 1
	)
	THEN 0
	ELSE 1
END;
--> statement-breakpoint
DROP TABLE `__migration_boss_drop_duplicate_guard`;
--> statement-breakpoint
CREATE TABLE `__legacy_boss_entry_costs` AS
SELECT
	`id`,
	`boss_id`,
	`item_id`,
	`quantity`,
	`created_at`,
	`updated_at`
FROM `boss_entry_costs`;
--> statement-breakpoint
CREATE TABLE `__legacy_boss_drops` AS
SELECT
	`id`,
	`boss_id`,
	`item_id`,
	`estimated_drop_rate`,
	`notes`,
	`created_at`,
	`updated_at`
FROM `boss_drops`;
--> statement-breakpoint
CREATE TABLE `__legacy_item_prices` AS
SELECT
	`id`,
	`item_id`,
	`league_id`,
	`chaos_value`,
	`source`,
	`captured_at`,
	`created_at`
FROM `item_prices`;
--> statement-breakpoint
CREATE TABLE `__legacy_profit_snapshots` AS
SELECT
	`id`,
	`boss_id`,
	`league_id`,
	`entry_cost_chaos`,
	`expected_return_chaos`,
	`expected_profit_chaos`,
	`roi_percent`,
	`calculated_at`,
	`created_at`
FROM `profit_snapshots`;
--> statement-breakpoint
DROP TABLE `profit_snapshots`;
--> statement-breakpoint
DROP TABLE `item_prices`;
--> statement-breakpoint
DROP TABLE `boss_drops`;
--> statement-breakpoint
DROP TABLE `boss_entry_costs`;
--> statement-breakpoint
CREATE TABLE `__new_items` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`icon_url` text,
	`trade_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT "items_category_check" CHECK(`category` in ('currency', 'fragment', 'divination_card', 'equipment', 'gem', 'map', 'other'))
);
--> statement-breakpoint
INSERT INTO `__new_items` (
	`id`,
	`name`,
	`category`,
	`icon_url`,
	`trade_url`,
	`created_at`,
	`updated_at`
)
SELECT
	`id`,
	`name`,
	CASE WHEN `category` = 'unique' THEN 'equipment' ELSE `category` END,
	`icon_url`,
	`trade_url`,
	`created_at`,
	`updated_at`
FROM `items`;
--> statement-breakpoint
DROP TABLE `items`;
--> statement-breakpoint
ALTER TABLE `__new_items` RENAME TO `items`;
--> statement-breakpoint
CREATE TABLE `__new_bosses` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_bosses` (
	`id`,
	`name`,
	`slug`,
	`description`,
	`is_active`,
	`created_at`,
	`updated_at`
)
SELECT
	`id`,
	`name`,
	`slug`,
	`description`,
	`is_active`,
	`created_at`,
	`updated_at`
FROM `bosses`;
--> statement-breakpoint
DROP TABLE `bosses`;
--> statement-breakpoint
ALTER TABLE `__new_bosses` RENAME TO `bosses`;
--> statement-breakpoint
CREATE UNIQUE INDEX `bosses_slug_unique` ON `bosses` (`slug`);
--> statement-breakpoint
CREATE TABLE `boss_entry_components` (
	`id` text PRIMARY KEY NOT NULL,
	`boss_id` text NOT NULL,
	`item_id` text NOT NULL,
	`quantity` real NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`boss_id`) REFERENCES `bosses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "boss_entry_components_quantity_check" CHECK(`quantity` > 0)
);
--> statement-breakpoint
INSERT INTO `boss_entry_components` (
	`id`,
	`boss_id`,
	`item_id`,
	`quantity`,
	`created_at`,
	`updated_at`
)
SELECT
	`id`,
	`boss_id`,
	`item_id`,
	`quantity`,
	`created_at`,
	`updated_at`
FROM `__legacy_boss_entry_costs`;
--> statement-breakpoint
DROP TABLE `__legacy_boss_entry_costs`;
--> statement-breakpoint
CREATE UNIQUE INDEX `boss_entry_components_boss_item_unique`
	ON `boss_entry_components` (`boss_id`, `item_id`);
--> statement-breakpoint
CREATE INDEX `boss_entry_components_item_idx`
	ON `boss_entry_components` (`item_id`);
--> statement-breakpoint
CREATE TABLE `__new_boss_drops` (
	`id` text PRIMARY KEY NOT NULL,
	`boss_id` text NOT NULL,
	`item_id` text NOT NULL,
	`drop_rate` real,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`boss_id`) REFERENCES `bosses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "boss_drops_rate_check" CHECK(`drop_rate` is null or (`drop_rate` >= 0 and `drop_rate` <= 1))
);
--> statement-breakpoint
INSERT INTO `__new_boss_drops` (
	`id`,
	`boss_id`,
	`item_id`,
	`drop_rate`,
	`notes`,
	`created_at`,
	`updated_at`
)
SELECT
	`id`,
	`boss_id`,
	`item_id`,
	`estimated_drop_rate`,
	`notes`,
	`created_at`,
	`updated_at`
FROM `__legacy_boss_drops`;
--> statement-breakpoint
DROP TABLE `__legacy_boss_drops`;
--> statement-breakpoint
ALTER TABLE `__new_boss_drops` RENAME TO `boss_drops`;
--> statement-breakpoint
CREATE UNIQUE INDEX `boss_drops_boss_item_unique`
	ON `boss_drops` (`boss_id`, `item_id`);
--> statement-breakpoint
CREATE INDEX `boss_drops_item_idx` ON `boss_drops` (`item_id`);
--> statement-breakpoint
CREATE TABLE `__new_item_prices` (
	`id` text PRIMARY KEY NOT NULL,
	`item_id` text NOT NULL,
	`league_id` text NOT NULL,
	`sync_run_id` text NOT NULL,
	`chaos_value` real NOT NULL,
	`source` text NOT NULL,
	`captured_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`league_id`) REFERENCES `leagues`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sync_run_id`) REFERENCES `sync_runs`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "item_prices_chaos_value_check" CHECK(`chaos_value` >= 0)
);
--> statement-breakpoint
INSERT INTO `__new_item_prices` (
	`id`,
	`item_id`,
	`league_id`,
	`sync_run_id`,
	`chaos_value`,
	`source`,
	`captured_at`,
	`created_at`
)
SELECT
	`id`,
	`item_id`,
	`league_id`,
	'migration-legacy-price-set',
	`chaos_value`,
	`source`,
	`captured_at`,
	`created_at`
FROM `__legacy_item_prices`;
--> statement-breakpoint
DROP TABLE `__legacy_item_prices`;
--> statement-breakpoint
ALTER TABLE `__new_item_prices` RENAME TO `item_prices`;
--> statement-breakpoint
CREATE INDEX `item_prices_item_league_captured_id_idx`
	ON `item_prices` (`item_id`, `league_id`, `captured_at`, `id`);
--> statement-breakpoint
CREATE INDEX `item_prices_league_captured_idx`
	ON `item_prices` (`league_id`, `captured_at`);
--> statement-breakpoint
CREATE INDEX `item_prices_sync_run_item_league_idx`
	ON `item_prices` (`sync_run_id`, `item_id`, `league_id`);
--> statement-breakpoint
CREATE TABLE `__new_profit_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
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
	FOREIGN KEY (`boss_id`) REFERENCES `bosses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`league_id`) REFERENCES `leagues`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sync_run_id`) REFERENCES `sync_runs`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "profit_snapshots_divine_orb_chaos_value_check" CHECK(`divine_orb_chaos_value` > 0),
	CONSTRAINT "profit_snapshots_is_complete_check" CHECK(`is_complete` in (0, 1)),
	CONSTRAINT "profit_snapshots_unknown_drop_count_check" CHECK(
		`unknown_drop_count` >= 0
		AND `unknown_drop_count` = CAST(`unknown_drop_count` AS INTEGER)
	)
);
--> statement-breakpoint
INSERT INTO `__new_profit_snapshots` (
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
	`created_at`
)
SELECT
	snapshot.`id`,
	snapshot.`boss_id`,
	snapshot.`league_id`,
	'migration-legacy-price-set',
	snapshot.`entry_cost_chaos`,
	snapshot.`expected_return_chaos`,
	snapshot.`expected_profit_chaos`,
	snapshot.`roi_percent`,
	(
		SELECT price.`chaos_value`
		FROM `item_prices` AS price
		WHERE price.`item_id` = 'divine-orb'
			AND price.`league_id` = snapshot.`league_id`
			AND price.`chaos_value` > 0
			AND price.`captured_at` <= snapshot.`calculated_at`
		ORDER BY price.`captured_at` DESC, price.`id` DESC
		LIMIT 1
	),
	1,
	0,
	snapshot.`calculated_at`,
	snapshot.`created_at`
FROM `__legacy_profit_snapshots` AS snapshot;
--> statement-breakpoint
DROP TABLE `__legacy_profit_snapshots`;
--> statement-breakpoint
ALTER TABLE `__new_profit_snapshots` RENAME TO `profit_snapshots`;
--> statement-breakpoint
CREATE INDEX `profit_snapshots_boss_league_calculated_idx`
	ON `profit_snapshots` (`boss_id`, `league_id`, `calculated_at`);
--> statement-breakpoint
CREATE INDEX `profit_snapshots_league_calculated_idx`
	ON `profit_snapshots` (`league_id`, `calculated_at`);
--> statement-breakpoint
CREATE INDEX `profit_snapshots_sync_run_idx`
	ON `profit_snapshots` (`sync_run_id`);
