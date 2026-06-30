import { z } from "zod";

import { itemCategorySchema } from "../schemas/item.schema";

const idSchema = z.string().trim().min(1);

const curatedItemSchema = z
  .object({
    id: idSchema,
    name: z.string().trim().min(1),
    category: itemCategorySchema,
    iconUrl: z.string().trim().min(1).nullable().optional(),
    tradeUrl: z.string().trim().min(1).nullable().optional(),
    externalType: z.string().trim().min(1).optional(),
    externalKey: z.string().trim().min(1).optional(),
    poeNinjaType: z.string().trim().min(1).optional(),
    poeNinjaKey: z.string().trim().min(1).optional(),
    priceProvider: z.enum(["poe_ninja", "poe_public_stash", "manual"]).optional()
  })
  .transform((item, context) => {
    const externalType = item.externalType ?? item.poeNinjaType;
    const externalKey = item.externalKey ?? item.poeNinjaKey;
    if (externalType === undefined) {
      context.addIssue({
        code: "custom",
        path: ["externalType"],
        message: "externalType is required"
      });
      return z.NEVER;
    }
    if (externalKey === undefined) {
      context.addIssue({
        code: "custom",
        path: ["externalKey"],
        message: "externalKey is required"
      });
      return z.NEVER;
    }
    return {
      id: item.id,
      name: item.name,
      category: item.category,
      iconUrl: item.iconUrl,
      tradeUrl: item.tradeUrl,
      externalType,
      externalKey,
      priceProvider: item.priceProvider
    };
  });

const curatedBossSchema = z.object({
  id: idSchema,
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  description: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  entryComponents: z
    .array(
      z.object({
        itemId: idSchema,
        quantity: z.number().positive()
      })
    )
    .min(1),
  drops: z.array(
    z.object({
      itemId: idSchema,
      dropRate: z.number().min(0).max(1).nullable(),
      dropGroupId: idSchema.nullable().optional(),
      dropGroupType: z.enum(["one_of"]).nullable().optional(),
      notes: z.string().nullable().optional()
    }).superRefine((drop, context) => {
      const hasGroupId = drop.dropGroupId != null;
      const hasGroupType = drop.dropGroupType != null;
      if (hasGroupId !== hasGroupType) {
        context.addIssue({
          code: "custom",
          message: "dropGroupId and dropGroupType must be provided together"
        });
      }
    })
  )
});

export const curatedDataSchema = z.object({
  items: z.array(curatedItemSchema).min(1),
  bosses: z.array(curatedBossSchema)
});

const curatedItemsFileSchema = z.array(curatedItemSchema).min(1);
const curatedBossesFileSchema = z.array(curatedBossSchema);

export type CuratedData = z.infer<typeof curatedDataSchema>;
export type CuratedItemsFile = z.infer<typeof curatedItemsFileSchema>;
export type CuratedBossesFile = z.infer<typeof curatedBossesFileSchema>;

const sqlString = (value: string | null | undefined): string =>
  value == null ? "NULL" : `'${value.replaceAll("'", "''")}'`;

const sqlNumber = (value: number | null): string =>
  value === null ? "NULL" : String(value);

const assertUnique = (
  values: readonly string[],
  label: string
): void => {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      throw new Error(`Duplicate ${label}: ${value}`);
    }
    seen.add(value);
  }
};

const validateReferences = (data: CuratedData): void => {
  const itemIds = new Set(data.items.map((item) => item.id));
  for (const boss of data.bosses) {
    assertUnique(
      boss.entryComponents.map((component) => component.itemId),
      `entry component item for boss ${boss.id}`
    );
    assertUnique(
      boss.drops.map((drop) => drop.itemId),
      `drop item for boss ${boss.id}`
    );
    for (const component of boss.entryComponents) {
      if (!itemIds.has(component.itemId)) {
        throw new Error(
          `Boss ${boss.id} entry component references missing item ${component.itemId}`
        );
      }
    }
    for (const drop of boss.drops) {
      if (!itemIds.has(drop.itemId)) {
        throw new Error(`Boss ${boss.id} drop references missing item ${drop.itemId}`);
      }
    }
  }
};

export const parseCuratedData = (input: unknown): CuratedData => {
  const data = curatedDataSchema.parse(input);
  assertUnique(
    data.items.map((item) => item.id),
    "item id"
  );
  assertUnique(
    data.bosses.map((boss) => boss.id),
    "boss id"
  );
  assertUnique(
    data.bosses.map((boss) => boss.slug),
    "boss slug"
  );
  validateReferences(data);
  return data;
};

export const combineCuratedDataFiles = (input: {
  items: unknown;
  bosses: unknown;
}): CuratedData =>
  parseCuratedData({
    items: curatedItemsFileSchema.parse(input.items),
    bosses: curatedBossesFileSchema.parse(input.bosses)
  });

export const buildCuratedSql = (input: unknown, timestamp = Date.now()): string => {
  const data = parseCuratedData(input);
  const statements: string[] = ["PRAGMA foreign_keys = ON"];

  for (const item of data.items) {
    const priceProvider = item.priceProvider ?? "poe_ninja";
    statements.push(
      `INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        ${sqlString(item.id)},
        ${sqlString(item.name)},
        ${sqlString(item.category)},
        ${sqlString(item.iconUrl)},
        ${sqlString(item.tradeUrl)},
        ${timestamp},
        ${timestamp}
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at`,
      `INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        ${sqlString(`curated-${priceProvider}-${item.id}`)},
        ${sqlString(item.id)},
        ${sqlString(priceProvider)},
        ${sqlString(item.externalType)},
        ${sqlString(item.externalKey)},
        1,
        ${timestamp},
        ${timestamp}
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at`
    );
  }

  for (const boss of data.bosses) {
    statements.push(
      `INSERT INTO bosses (
        id, name, slug, description, is_active, created_at, updated_at
      ) VALUES (
        ${sqlString(boss.id)},
        ${sqlString(boss.name)},
        ${sqlString(boss.slug)},
        ${sqlString(boss.description)},
        ${boss.isActive === false ? 0 : 1},
        ${timestamp},
        ${timestamp}
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        slug = excluded.slug,
        description = excluded.description,
        is_active = excluded.is_active,
        updated_at = excluded.updated_at`,
      `DELETE FROM boss_entry_components WHERE boss_id = ${sqlString(boss.id)}`,
      `DELETE FROM boss_drops WHERE boss_id = ${sqlString(boss.id)}`
    );

    for (const component of boss.entryComponents) {
      statements.push(
        `INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          ${sqlString(`curated-entry-${boss.id}-${component.itemId}`)},
          ${sqlString(boss.id)},
          ${sqlString(component.itemId)},
          ${component.quantity},
          ${timestamp},
          ${timestamp}
        )`
      );
    }

    for (const drop of boss.drops) {
      statements.push(
        `INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          ${sqlString(`curated-drop-${boss.id}-${drop.itemId}`)},
          ${sqlString(boss.id)},
          ${sqlString(drop.itemId)},
          ${sqlNumber(drop.dropRate)},
          ${sqlString(drop.dropGroupId)},
          ${sqlString(drop.dropGroupType)},
          ${sqlString(drop.notes)},
          ${timestamp},
          ${timestamp}
        )`
      );
    }
  }

  return `${statements.map((statement) => `${statement};`).join("\n")}\n`;
};
