CREATE TABLE `item_price_mappings` (
	`id` text PRIMARY KEY NOT NULL,
	`item_id` text NOT NULL,
	`provider` text NOT NULL,
	`external_type` text NOT NULL,
	`external_key` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "item_price_mappings_external_type_check" CHECK(length("item_price_mappings"."external_type") > 0),
	CONSTRAINT "item_price_mappings_external_key_check" CHECK(length("item_price_mappings"."external_key") > 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `item_price_mappings_item_provider_unique` ON `item_price_mappings` (`item_id`,`provider`);--> statement-breakpoint
CREATE INDEX `item_price_mappings_provider_active_idx` ON `item_price_mappings` (`provider`,`is_active`);--> statement-breakpoint
ALTER TABLE `leagues` ADD `external_name` text NOT NULL DEFAULT '';--> statement-breakpoint
UPDATE `leagues` SET `external_name` = `name` WHERE `external_name` = '';
