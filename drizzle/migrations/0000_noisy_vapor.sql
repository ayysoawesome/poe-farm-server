CREATE TABLE `boss_drops` (
	`id` text PRIMARY KEY NOT NULL,
	`boss_id` text NOT NULL,
	`item_id` text NOT NULL,
	`estimated_drop_rate` real NOT NULL,
	`min_quantity` real DEFAULT 1 NOT NULL,
	`max_quantity` real DEFAULT 1 NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`boss_id`) REFERENCES `bosses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `boss_entry_costs` (
	`id` text PRIMARY KEY NOT NULL,
	`boss_id` text NOT NULL,
	`item_id` text NOT NULL,
	`quantity` real NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`boss_id`) REFERENCES `bosses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `bosses` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`is_uber` integer DEFAULT false NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bosses_slug_unique` ON `bosses` (`slug`);--> statement-breakpoint
CREATE TABLE `item_prices` (
	`id` text PRIMARY KEY NOT NULL,
	`item_id` text NOT NULL,
	`league_id` text NOT NULL,
	`chaos_value` real NOT NULL,
	`divine_value` real,
	`source` text NOT NULL,
	`captured_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`league_id`) REFERENCES `leagues`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `item_prices_item_league_captured_idx` ON `item_prices` (`item_id`,`league_id`,`captured_at`);--> statement-breakpoint
CREATE INDEX `item_prices_league_captured_idx` ON `item_prices` (`league_id`,`captured_at`);--> statement-breakpoint
CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`icon_url` text,
	`trade_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `leagues` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profit_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`boss_id` text NOT NULL,
	`league_id` text NOT NULL,
	`entry_cost_chaos` real NOT NULL,
	`expected_return_chaos` real NOT NULL,
	`expected_profit_chaos` real NOT NULL,
	`roi_percent` real NOT NULL,
	`calculated_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`boss_id`) REFERENCES `bosses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`league_id`) REFERENCES `leagues`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `profit_snapshots_boss_league_calculated_idx` ON `profit_snapshots` (`boss_id`,`league_id`,`calculated_at`);--> statement-breakpoint
CREATE INDEX `profit_snapshots_league_calculated_idx` ON `profit_snapshots` (`league_id`,`calculated_at`);--> statement-breakpoint
CREATE TABLE `sync_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`status` text NOT NULL,
	`started_at` integer NOT NULL,
	`finished_at` integer,
	`message` text,
	`created_at` integer NOT NULL
);
