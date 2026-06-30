PRAGMA defer_foreign_keys = true;
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
	`category`,
	`icon_url`,
	`trade_url`,
	`created_at`,
	`updated_at`
FROM `items`;
--> statement-breakpoint
DROP TABLE `items`;
--> statement-breakpoint
ALTER TABLE `__new_items` RENAME TO `items`;
