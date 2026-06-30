CREATE TABLE `manual_item_prices` (
	`id` text PRIMARY KEY NOT NULL,
	`item_id` text NOT NULL,
	`league_id` text NOT NULL,
	`chaos_value` real NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`league_id`) REFERENCES `leagues`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "manual_item_prices_chaos_value_check" CHECK(`manual_item_prices`.`chaos_value` >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `manual_item_prices_item_league_unique` ON `manual_item_prices` (`item_id`,`league_id`);
--> statement-breakpoint
CREATE INDEX `manual_item_prices_league_idx` ON `manual_item_prices` (`league_id`);
