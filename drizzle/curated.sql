PRAGMA foreign_keys = ON;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'a-fate-worse-than-death',
        'A Fate Worse Than Death',
        'divination_card',
        'https://web.poecdn.com/image/Art/2DItems/Divination/InventoryIcon.png?scale=1&w=1&h=1',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-a-fate-worse-than-death',
        'a-fate-worse-than-death',
        'poe_ninja',
        'DivinationCard',
        'A Fate Worse Than Death',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'annihilation-support',
        'Annihilation Support',
        'gem',
        'https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L09ibGl0ZXJhdGlvblN1cHBvcnQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MSwiZ2UiOnRydWV9XQ/b8374aaed8/ObliterationSupport.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-annihilation-support',
        'annihilation-support',
        'poe_ninja',
        'SkillGem',
        'Annihilation Support',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'annihilations-approach',
        'Annihilation''s Approach',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9Cb290cy9VYmVyU2VhcmluZ0V4YXJjaEJvb3QiLCJ3IjoyLCJoIjoyLCJzY2FsZSI6MX1d/705e9f657f/UberSearingExarchBoot.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-annihilations-approach',
        'annihilations-approach',
        'poe_ninja',
        'UniqueArmour',
        'Annihilation''s Approach',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'archive-reliquary-key',
        'Archive Reliquary Key',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9TZWFyaW5nRXhhcmNoRm9pbCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/bb895c1f5d/SearingExarchFoil.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-archive-reliquary-key',
        'archive-reliquary-key',
        'poe_ninja',
        'Fragment',
        'Archive Reliquary Key',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'arns-anguish',
        'Arn''s Anguish',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQmVsdHMvQWx0Q2hhcmdlU3RyIiwidyI6MiwiaCI6MSwic2NhbGUiOjF9XQ/c07eed602e/AltChargeStr.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-arns-anguish',
        'arns-anguish',
        'poe_ninja',
        'UniqueAccessory',
        'Arn''s Anguish',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'ashes-of-the-stars',
        'Ashes of the Stars',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQW11bGV0cy9NYXN0ZXJPZkdlbXMiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/f6497cbdfe/MasterOfGems.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-ashes-of-the-stars',
        'ashes-of-the-stars',
        'poe_ninja',
        'UniqueAccessory',
        'Ashes of the Stars',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'blazing-fragment',
        'Blazing Fragment',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9VYmVyQm9zc0tleVNlYXJpbmdFeGFyY2giLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/a005e1a684/UberBossKeySearingExarch.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-blazing-fragment',
        'blazing-fragment',
        'poe_ninja',
        'Fragment',
        'Blazing Fragment',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'auspicious-ambitions',
        'Auspicious Ambitions',
        'divination_card',
        'https://web.poecdn.com/image/Art/2DItems/Divination/InventoryIcon.png?scale=1&w=1&h=1',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-auspicious-ambitions',
        'auspicious-ambitions',
        'poe_ninja',
        'DivinationCard',
        'Auspicious Ambitions',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'awakened-enhance-support',
        'Awakened Enhance Support',
        'gem',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1N1cHBvcnRQbHVzL2VuaGFuY2VwbHVzIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/d3de7b3bd1/enhanceplus.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-awakened-enhance-support',
        'awakened-enhance-support',
        'poe_ninja',
        'SkillGem',
        'Awakened Enhance Support',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'awakened-enlighten-support',
        'Awakened Enlighten Support',
        'gem',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1N1cHBvcnRQbHVzL0VubGlnaHRlbnBsdXMiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/7ec7d0544d/Enlightenplus.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-awakened-enlighten-support',
        'awakened-enlighten-support',
        'poe_ninja',
        'SkillGem',
        'Awakened Enlighten Support',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'awakened-multistrike',
        'Awakened Multistrike Support',
        'gem',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1N1cHBvcnRQbHVzL011bHRpcGxlQXR0YWNrc1BsdXMiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/c32ddc2121/MultipleAttacksPlus.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-awakened-multistrike',
        'awakened-multistrike',
        'poe_ninja',
        'SkillGem',
        'Awakened Multistrike Support',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'awakeners-orb',
        'Awakener''s Orb',
        'currency',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvVHJhbnNmZXJPcmIiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/6db384ea6e/TransferOrb.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-awakeners-orb',
        'awakeners-orb',
        'poe_ninja',
        'Currency',
        'Awakener''s Orb',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'call-of-the-void',
        'Call of the Void',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvUmluZ3MvRnJvc3RHbGF6ZWRFeWVSaW5nIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/e10b85c4f1/FrostGlazedEyeRing.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-call-of-the-void',
        'call-of-the-void',
        'poe_ninja',
        'UniqueAccessory',
        'Call of the Void',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'chaos-orb',
        'Chaos Orb',
        'currency',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lSZXJvbGxSYXJlIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/d119a0d734/CurrencyRerollRare.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-chaos-orb',
        'chaos-orb',
        'poe_ninja',
        'Currency',
        'Chaos Orb',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'cosmic-reliquary-key',
        'Cosmic Reliquary Key',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9TaGFwZXJGb2lsIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/71325272ad/ShaperFoil.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-cosmic-reliquary-key',
        'cosmic-reliquary-key',
        'poe_ninja',
        'Fragment',
        'Cosmic Reliquary Key',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'crown-of-the-inward-eye',
        'Crown of the Inward Eye',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9IZWxtZXRzL0Nyb3duT2ZUaGVJbndhcmRFeWUiLCJ3IjoyLCJoIjoyLCJzY2FsZSI6MX1d/fdb20856e4/CrownOfTheInwardEye.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-crown-of-the-inward-eye',
        'crown-of-the-inward-eye',
        'poe_ninja',
        'UniqueArmour',
        'Crown of the Inward Eye',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'crystallised-omniscience',
        'Crystallised Omniscience',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQW11bGV0cy9Bc2NlbmRhbmNlQW11bGV0IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/60368620d5/AscendanceAmulet.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-crystallised-omniscience',
        'crystallised-omniscience',
        'poe_ninja',
        'UniqueAccessory',
        'Crystallised Omniscience',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'curio-of-absorption',
        'Curio of Absorption',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQW11bGV0cy9QaW5uYWNsZUZyYWdtZW50RXhhcmNoIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/0da90fe2d1/PinnacleFragmentExarch.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-curio-of-absorption',
        'curio-of-absorption',
        'poe_ninja',
        'Fragment',
        'Curio of Absorption',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'curio-of-consumption',
        'Curio of Consumption',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQW11bGV0cy9QaW5uYWNsZUZyYWdtZW50RWF0ZXIiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/a386f18599/PinnacleFragmentEater.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-curio-of-consumption',
        'curio-of-consumption',
        'poe_ninja',
        'Fragment',
        'Curio of Consumption',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'curio-of-decay',
        'Curio of Decay',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQW11bGV0cy9QaW5uYWNsZUZyYWdtZW50RWxkZXIiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/40544dbcfb/PinnacleFragmentElder.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-curio-of-decay',
        'curio-of-decay',
        'poe_ninja',
        'Fragment',
        'Curio of Decay',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'curio-of-potential',
        'Curio of Potential',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQW11bGV0cy9QaW5uYWNsZUZyYWdtZW50TWF2ZW4iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/53c751ef5d/PinnacleFragmentMaven.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-curio-of-potential',
        'curio-of-potential',
        'poe_ninja',
        'Fragment',
        'Curio of Potential',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'dawnbreaker',
        'Dawnbreaker',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9TaGllbGRzL1N1cGVyaGVhdGVkU2hpZWxkIiwidyI6MiwiaCI6NCwic2NhbGUiOjF9XQ/59e3552a9b/SuperheatedShield.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-dawnbreaker',
        'dawnbreaker',
        'poe_ninja',
        'UniqueArmour',
        'Dawnbreaker',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'dawnstrider',
        'Dawnstrider',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9Cb290cy9JbmZlY3Rpb3VzQ29uc3RydWN0IiwidyI6MiwiaCI6Miwic2NhbGUiOjF9XQ/bf1cb0a5b4/InfectiousConstruct.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-dawnstrider',
        'dawnstrider',
        'poe_ninja',
        'UniqueArmour',
        'Dawnstrider',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'decaying-reliquary-key',
        'Decaying Reliquary Key',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9FbGRlckZvaWwiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/2c6d5b7eb2/ElderFoil.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-decaying-reliquary-key',
        'decaying-reliquary-key',
        'poe_ninja',
        'Fragment',
        'Decaying Reliquary Key',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'devouring-fragment',
        'Devouring Fragment',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9VYmVyQm9zc0tleUVhdGVyT2ZXb3JsZHMiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/935c580d4c/UberBossKeyEaterOfWorlds.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-devouring-fragment',
        'devouring-fragment',
        'poe_ninja',
        'Fragment',
        'Devouring Fragment',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'disintegrator',
        'Disintegrator',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvV2VhcG9ucy9Ud29IYW5kV2VhcG9ucy9TdGF2ZXMvRWxkZXJTdGFmZiIsInciOjIsImgiOjQsInNjYWxlIjoxfV0/4d2bfda95c/ElderStaff.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-disintegrator',
        'disintegrator',
        'poe_ninja',
        'UniqueWeapon',
        'Disintegrator',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'dissolution-of-the-flesh',
        'Dissolution of the Flesh',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvSmV3ZWxzL1Jlc2VydmVkQmxvb2RKZXdlbCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/1a4688f335/ReservedBloodJewel.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-dissolution-of-the-flesh',
        'dissolution-of-the-flesh',
        'poe_ninja',
        'UniqueJewel',
        'Dissolution of the Flesh',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'divine-orb',
        'Divine Orb',
        'currency',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lNb2RWYWx1ZXMiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/e1a54ff97d/CurrencyModValues.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-divine-orb',
        'divine-orb',
        'poe_ninja',
        'Currency',
        'Divine Orb',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'doppelg-nger-guise',
        'DoppelgГ¤nger Guise',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9Cb2R5QXJtb3Vycy9Db2xsZWN0b3JzR2FyYkRpZmYiLCJ3IjoyLCJoIjozLCJzY2FsZSI6MX1d/eb8a6d36ef/CollectorsGarbDiff.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-doppelg-nger-guise',
        'doppelg-nger-guise',
        'poe_ninja',
        'UniqueArmour',
        'DoppelgГ¤nger Guise',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'dying-sun',
        'Dying Sun',
        'equipment',
        'https://web.poecdn.com/gen/image/WzksMTQseyJmIjoiMkRJdGVtcy9GbGFza3MvU2hhcGVyc0ZsYXNrIiwidyI6MSwiaCI6Miwic2NhbGUiOjEsImxldmVsIjoxfV0/c6e2f8118d/ShapersFlask.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-dying-sun',
        'dying-sun',
        'poe_ninja',
        'UniqueFlask',
        'Dying Sun',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'echoes-of-creation',
        'Echoes of Creation',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9IZWxtZXRzL1RoZVR3aXN0aW5nU2NyZWFtIiwidyI6MiwiaCI6Miwic2NhbGUiOjF9XQ/4815fa0fc8/TheTwistingScream.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-echoes-of-creation',
        'echoes-of-creation',
        'poe_ninja',
        'UniqueArmour',
        'Echoes of Creation',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'echoforge',
        'Echoforge',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvV2VhcG9ucy9Ud29IYW5kV2VhcG9ucy9Ud29IYW5kU3dvcmRzL0Nvc21pY0ZvcmdlIiwidyI6MiwiaCI6NCwic2NhbGUiOjF9XQ/df82c06267/CosmicForge.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-echoforge',
        'echoforge',
        'poe_ninja',
        'UniqueWeapon',
        'Echoforge',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'eclipse-support',
        'Eclipse Support',
        'gem',
        'https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0VjbGlwc2UiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MSwiZ2UiOnRydWV9XQ/01d4f8b241/Eclipse.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-eclipse-support',
        'eclipse-support',
        'poe_ninja',
        'SkillGem',
        'Eclipse Support',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'elders-exalted-orb',
        'Elder''s Exalted Orb',
        'currency',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2VjcmV0c29mdGhlQXRsYXMvRWxkZXJFeGFsdGVkT3JiIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/233ff3fef0/ElderExaltedOrb.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-elders-exalted-orb',
        'elders-exalted-orb',
        'poe_ninja',
        'Currency',
        'Elder''s Exalted Orb',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'eldritch-chaos-orb',
        'Eldritch Chaos Orb',
        'currency',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvRWxkcml0Y2hDaGFvc09yYiIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/afdc1d40be/EldritchChaosOrb.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-eldritch-chaos-orb',
        'eldritch-chaos-orb',
        'poe_ninja',
        'Currency',
        'Eldritch Chaos Orb',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'eldritch-exalted-orb',
        'Eldritch Exalted Orb',
        'currency',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvRWxkcml0Y2hFeGFsdGVkT3JiIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/56026bffa3/EldritchExaltedOrb.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-eldritch-exalted-orb',
        'eldritch-exalted-orb',
        'poe_ninja',
        'Currency',
        'Eldritch Exalted Orb',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'eldritch-orb-of-annulment',
        'Eldritch Orb of Annulment',
        'currency',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvRWxkcml0Y2hBbm51bG1lbnRPcmIiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/cd03411d81/EldritchAnnulmentOrb.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-eldritch-orb-of-annulment',
        'eldritch-orb-of-annulment',
        'poe_ninja',
        'Currency',
        'Eldritch Orb of Annulment',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'entropic-devastation',
        'Entropic Devastation',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9HbG92ZXMvVWJlclNoYXBlckdsb3ZlcyIsInciOjIsImgiOjIsInNjYWxlIjoxfV0/50bd7171bf/UberShaperGloves.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-entropic-devastation',
        'entropic-devastation',
        'poe_ninja',
        'UniqueArmour',
        'Entropic Devastation',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'exceptional-eldritch-ember',
        'Exceptional Eldritch Ember',
        'currency',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ2xlYW5zaW5nRmlyZU9yYlJhbms0IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/920113641f/CleansingFireOrbRank4.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-exceptional-eldritch-ember',
        'exceptional-eldritch-ember',
        'poe_ninja',
        'Currency',
        'Exceptional Eldritch Ember',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'exceptional-eldritch-ichor',
        'Exceptional Eldritch Ichor',
        'currency',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvVGFuZ2xlT3JiUmFuazQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/c1205e2c0a/TangleOrbRank4.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-exceptional-eldritch-ichor',
        'exceptional-eldritch-ichor',
        'poe_ninja',
        'Currency',
        'Exceptional Eldritch Ichor',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'forbidden-flame',
        'Forbidden Flame',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvSmV3ZWxzL1B1enpsZVBpZWNlSmV3ZWxfQ2xlYW5zaW5nRmlyZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/ddfe57ac90/PuzzlePieceJewel_CleansingFire.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-forbidden-flame',
        'forbidden-flame',
        'poe_ninja',
        'UniqueJewel',
        'Forbidden Flame',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'forbidden-flesh',
        'Forbidden Flesh',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvSmV3ZWxzL1B1enpsZVBpZWNlSmV3ZWxfR3JlYXRUYW5nbGUiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/9035b9ffd4/PuzzlePieceJewel_GreatTangle.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-forbidden-flesh',
        'forbidden-flesh',
        'poe_ninja',
        'UniqueJewel',
        'Forbidden Flesh',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'fragment-chimera',
        'Fragment of the Chimera',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9BdGxhc01hcHMvRnJhZ21lbnRDaGltZXJhIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/df51d0bd7a/FragmentChimera.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-fragment-chimera',
        'fragment-chimera',
        'poe_ninja',
        'Fragment',
        'Fragment of the Chimera',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'fragment-hydra',
        'Fragment of the Hydra',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9BdGxhc01hcHMvRnJhZ21lbnRIeWRyYSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/16cec8bced/FragmentHydra.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-fragment-hydra',
        'fragment-hydra',
        'poe_ninja',
        'Fragment',
        'Fragment of the Hydra',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'fragment-minotaur',
        'Fragment of the Minotaur',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9BdGxhc01hcHMvRnJhZ21lbnRNaW5vdGF1ciIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/a6307f6cc9/FragmentMinotaur.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-fragment-minotaur',
        'fragment-minotaur',
        'poe_ninja',
        'Fragment',
        'Fragment of the Minotaur',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'fragment-phoenix',
        'Fragment of the Phoenix',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9BdGxhc01hcHMvRnJhZ21lbnRQaG9lbml4IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/bf64bb03f8/FragmentPhoenix.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-fragment-phoenix',
        'fragment-phoenix',
        'poe_ninja',
        'Fragment',
        'Fragment of the Phoenix',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'grace-of-the-goddess',
        'Grace of the Goddess',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvV2VhcG9ucy9PbmVIYW5kV2VhcG9ucy9XYW5kcy9VYmVyTWF2ZW5XYW5kIiwidyI6MSwiaCI6Mywic2NhbGUiOjF9XQ/1e06b23a5b/UberMavenWand.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-grace-of-the-goddess',
        'grace-of-the-goddess',
        'poe_ninja',
        'UniqueArmour',
        'Grace of the Goddess',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'gluttony-support',
        'Gluttony Support',
        'gem',
        'https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0dsdXR0b255U3VwcG9ydCIsInciOjEsImgiOjEsInNjYWxlIjoxLCJnZSI6dHJ1ZX1d/50841b2e02/GluttonySupport.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-gluttony-support',
        'gluttony-support',
        'poe_ninja',
        'SkillGem',
        'Gluttony Support',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'gravens-secret',
        'Graven''s Secret',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQmVsdHMvQWx0Q2hhcmdlSW50IiwidyI6MiwiaCI6MSwic2NhbGUiOjF9XQ/1300aed2ac/AltChargeInt.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-gravens-secret',
        'gravens-secret',
        'poe_ninja',
        'UniqueAccessory',
        'Graven''s Secret',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'hands-of-the-high-templar',
        'Hands of the High Templar',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9HbG92ZXMvSGFuZHNPZlRoZUhpZ2hUZW1wbGFyIiwidyI6MiwiaCI6Miwic2NhbGUiOjF9XQ/239b2df5cf/HandsOfTheHighTemplar.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-hands-of-the-high-templar',
        'hands-of-the-high-templar',
        'poe_ninja',
        'UniqueArmour',
        'Hands of the High Templar',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'impossible-escape',
        'Impossible Escape',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvSmV3ZWxzL01pbmRib3JlUGVhcmwiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/367683a1bb/MindborePearl.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-impossible-escape',
        'impossible-escape',
        'poe_ninja',
        'UniqueJewel',
        'Impossible Escape',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'incandescent-invitation',
        'Incandescent Invitation',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvUXVlc3RJdGVtcy9DbGVhbnNpbmdGaXJlT3JiUXVlc3Q1IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/e6f9234053/CleansingFireOrbQuest5.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-incandescent-invitation',
        'incandescent-invitation',
        'poe_ninja',
        'Invitation',
        'Incandescent Invitation',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'impresence-chaos',
        'Impresence (Chaos)',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQW11bGV0cy9FbGRlckNoYW9zIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/fae9c0f072/ElderChaos.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-impresence-chaos',
        'impresence-chaos',
        'poe_ninja',
        'UniqueAccessory',
        'impresence-chaos-onyx-amulet',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'impresence-physical',
        'Impresence (Physical)',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQW11bGV0cy9FbGRlclBoeXNpY2FsIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/b41e1bdcc9/ElderPhysical.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-impresence-physical',
        'impresence-physical',
        'poe_ninja',
        'UniqueAccessory',
        'impresence-physical-onyx-amulet',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'impresence-cold',
        'Impresence (Cold)',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQW11bGV0cy9FbGRlckNvbGQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/157b678ffb/ElderCold.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-impresence-cold',
        'impresence-cold',
        'poe_ninja',
        'UniqueAccessory',
        'impresence-cold-onyx-amulet',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'impresence-lightning',
        'Impresence (Lightning)',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQW11bGV0cy9FbGRlckxpZ2h0bmluZyIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/371ac0eb40/ElderLightning.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-impresence-lightning',
        'impresence-lightning',
        'poe_ninja',
        'UniqueAccessory',
        'impresence-lightning-onyx-amulet',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'impresence-fire',
        'Impresence (Fire)',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQW11bGV0cy9FbGRlckZpcmUiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/b863d024fe/ElderFire.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-impresence-fire',
        'impresence-fire',
        'poe_ninja',
        'UniqueAccessory',
        'impresence-fire-onyx-amulet',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'indigon',
        'Indigon',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9IZWxtZXRzL1ViZXJFbGRlckhlbG1ldCIsInciOjIsImgiOjIsInNjYWxlIjoxfV0/005bcc2179/UberElderHelmet.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-indigon',
        'indigon',
        'poe_ninja',
        'UniqueArmour',
        'Indigon',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'inextricable-fate',
        'Inextricable Fate',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9Cb290cy9WaW5lZ3Jhc3BCb290c1VuaXF1ZSIsInciOjIsImgiOjIsInNjYWxlIjoxfV0/4f56e4bdb0/VinegraspBootsUnique.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-inextricable-fate',
        'inextricable-fate',
        'poe_ninja',
        'UniqueArmour',
        'Inextricable Fate',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'invert-the-rules-support',
        'Invert the Rules Support',
        'gem',
        'https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0ludmVydHRoZVJ1bGVzIiwidyI6MSwiaCI6MSwic2NhbGUiOjEsImdlIjp0cnVlfV0/0f08d4a859/InverttheRules.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-invert-the-rules-support',
        'invert-the-rules-support',
        'poe_ninja',
        'SkillGem',
        'Invert the Rules Support',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'legacy-of-fury',
        'Legacy of Fury',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9Cb290cy9TY29yY2hlZEVhcnRoIiwidyI6MiwiaCI6Miwic2NhbGUiOjF9XQ/fda63f7588/ScorchedEarth.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-legacy-of-fury',
        'legacy-of-fury',
        'poe_ninja',
        'UniqueArmour',
        'Legacy of Fury',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'mark-of-the-elder',
        'Mark of the Elder',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvUmluZ3MvVWJlckVsZGVyUmluZyIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/d211f75615/UberElderRing.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-mark-of-the-elder',
        'mark-of-the-elder',
        'poe_ninja',
        'UniqueAccessory',
        'Mark of the Elder',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'mark-of-the-shaper',
        'Mark of the Shaper',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvUmluZ3MvVWJlclNoYXBlclJpbmciLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/302889cfca/UberShaperRing.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-mark-of-the-shaper',
        'mark-of-the-shaper',
        'poe_ninja',
        'UniqueAccessory',
        'Mark of the Shaper',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'mavens-writ',
        'Maven''s Writ',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQXRsYXMvTWF2ZW5LZXkiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/ad4c12144c/MavenKey.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-mavens-writ',
        'mavens-writ',
        'poe_ninja',
        'Fragment',
        'Maven''s Writ',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'melding-of-the-flesh',
        'Melding of the Flesh',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvSmV3ZWxzL0VudGFuZ2xlZEVsZW1lbnRzSmV3ZWwiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/781ab651c4/EntangledElementsJewel.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-melding-of-the-flesh',
        'melding-of-the-flesh',
        'poe_ninja',
        'UniqueJewel',
        'Melding of the Flesh',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'nimis',
        'Nimis',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvUmluZ3MvVWJlckVhdGVyb2ZXb3JsZHMiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/6dbfb1baea/UberEaterofWorlds.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-nimis',
        'nimis',
        'poe_ninja',
        'UniqueAccessory',
        'Nimis',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'olesyas-delight',
        'Olesya''s Delight',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQmVsdHMvQWx0Q2hhcmdlRGV4IiwidyI6MiwiaCI6MSwic2NhbGUiOjEsInJlbGljIjowfV0/5f83eaba26/AltChargeDex.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-olesyas-delight',
        'olesyas-delight',
        'poe_ninja',
        'UniqueAccessory',
        'Olesya''s Delight',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'overheat-support',
        'Overheat Support',
        'gem',
        'https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L092ZXJoZWF0U3VwcG9ydCIsInciOjEsImgiOjEsInNjYWxlIjoxLCJnZSI6dHJ1ZX1d/b74bfe9994/OverheatSupport.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-overheat-support',
        'overheat-support',
        'poe_ninja',
        'SkillGem',
        'Overheat Support',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'orb-dominance',
        'Orb of Dominance',
        'currency',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvTWF2ZW5PcmIiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/8396ed7d8d/MavenOrb.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-orb-dominance',
        'orb-dominance',
        'poe_ninja',
        'Currency',
        'Orb of Dominance',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'orb-of-conflict',
        'Orb of Conflict',
        'currency',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ29uZmxpY3RPcmJSYW5rMSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/e1919976c3/ConflictOrbRank1.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-orb-of-conflict',
        'orb-of-conflict',
        'poe_ninja',
        'Currency',
        'Orb of Conflict',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'oriaths-end',
        'Oriath''s End',
        'equipment',
        'https://web.poecdn.com/gen/image/WzksMTQseyJmIjoiMkRJdGVtcy9GbGFza3MvVWJlclNpcnVzRmxhc2siLCJ3IjoxLCJoIjoyLCJzY2FsZSI6MSwibGV2ZWwiOjF9XQ/8758d70627/UberSirusFlask.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-oriaths-end',
        'oriaths-end',
        'poe_ninja',
        'UniqueFlask',
        'Oriath''s End',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'oubliette-reliquary-key',
        'Oubliette Reliquary Key',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9TaXJ1c0ZvaWwiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/7e611a9eb0/SirusFoil.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-oubliette-reliquary-key',
        'oubliette-reliquary-key',
        'poe_ninja',
        'Fragment',
        'Oubliette Reliquary Key',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'progenesis',
        'Progenesis',
        'equipment',
        'https://web.poecdn.com/gen/image/WzksMTQseyJmIjoiMkRJdGVtcy9GbGFza3MvVWJlck1hdmVuRmxhc2siLCJ3IjoxLCJoIjoyLCJzY2FsZSI6MSwibGV2ZWwiOjEsImZpIjp0cnVlfV0/1883213ee8/UberMavenFlask.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-progenesis',
        'progenesis',
        'poe_ninja',
        'UniqueFlask',
        'Progenesis',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'ravenous-passion',
        'Ravenous Passion',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9IZWxtZXRzL1ViZXJFYXRlcm9mV29ybGRzSGVsbWV0IiwidyI6MiwiaCI6Miwic2NhbGUiOjF9XQ/2215119a51/UberEaterofWorldsHelmet.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-ravenous-passion',
        'ravenous-passion',
        'poe_ninja',
        'UniqueArmour',
        'Ravenous Passion',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'shapers-exalted-orb',
        'Shaper''s Exalted Orb',
        'currency',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2VjcmV0c29mdGhlQXRsYXMvU2hhcGVyRXhhbHRlZE9yYiIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/ca4ad1f9eb/ShaperExaltedOrb.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-shapers-exalted-orb',
        'shapers-exalted-orb',
        'poe_ninja',
        'Currency',
        'Shaper''s Exalted Orb',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'shapers-touch',
        'Shaper''s Touch',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9HbG92ZXMvU2hhcGVyc0dsb3ZlcyIsInciOjIsImgiOjIsInNjYWxlIjoxfV0/633aead741/ShapersGloves.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-shapers-touch',
        'shapers-touch',
        'poe_ninja',
        'UniqueArmour',
        'Shaper''s Touch',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'screaming-invitation',
        'Screaming Invitation',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvUXVlc3RJdGVtcy9UYW5nbGVkT3JiUXVlc3Q1IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/75de691c2b/TangledOrbQuest5.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-screaming-invitation',
        'screaming-invitation',
        'poe_ninja',
        'Invitation',
        'Screaming Invitation',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'shiny-reliquary-key',
        'Shiny Reliquary Key',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9NYXZlbkZvaWwiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/114c341a3c/MavenFoil.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-shiny-reliquary-key',
        'shiny-reliquary-key',
        'poe_ninja',
        'Fragment',
        'Shiny Reliquary Key',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'solstice-vigil',
        'Solstice Vigil',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQW11bGV0cy9TaGFwZXJzUHJlc2VuY2UiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/57d45e4009/ShapersPresence.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-solstice-vigil',
        'solstice-vigil',
        'poe_ninja',
        'UniqueAccessory',
        'Solstice Vigil',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'soul-ascension',
        'Soul Ascension',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9HbG92ZXMvU291bEFzY2Vuc2lvbiIsInciOjIsImgiOjIsInNjYWxlIjoxLCJyZWxpYyI6MH1d/1a968d4cec/SoulAscension.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-soul-ascension',
        'soul-ascension',
        'poe_ninja',
        'UniqueArmour',
        'Soul Ascension',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'starforge',
        'Starforge',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvV2VhcG9ucy9Ud29IYW5kV2VhcG9ucy9Ud29IYW5kU3dvcmRzL1N0YXJmb3JnZSIsInciOjIsImgiOjQsInNjYWxlIjoxfV0/86b81685e1/Starforge.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-starforge',
        'starforge',
        'poe_ninja',
        'UniqueWeapon',
        'Starforge',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'sublime-vision',
        'Sublime Vision',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvSmV3ZWxzL1N1YmxpbWVWaXNpb24iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/ecd19a7f80/SublimeVision.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-sublime-vision',
        'sublime-vision',
        'poe_ninja',
        'UniqueJewel',
        'Sublime Vision',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'the-annihilating-light',
        'The Annihilating Light',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvV2VhcG9ucy9Ud29IYW5kV2VhcG9ucy9TdGF2ZXMvSW50cmVwaWR1c0RvbG9yZW0iLCJ3IjoyLCJoIjo0LCJzY2FsZSI6MSwicmVsaWMiOjV9XQ/2d2a309c80/IntrepidusDolorem.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-the-annihilating-light',
        'the-annihilating-light',
        'poe_ninja',
        'UniqueWeapon',
        'The Annihilating Light',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'the-burden-of-truth',
        'The Burden of Truth',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQmVsdHMvU2lydXNCZWx0IiwidyI6MiwiaCI6MSwic2NhbGUiOjF9XQ/757f213691/SirusBelt.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-the-burden-of-truth',
        'the-burden-of-truth',
        'poe_ninja',
        'UniqueAccessory',
        'The Burden of Truth',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'the-celestial-brace',
        'The Celestial Brace',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9HbG92ZXMvVWJlclNlYXJpbmdFeGFyY2hHbG92ZXMiLCJ3IjoyLCJoIjoyLCJzY2FsZSI6MX1d/47d365fea7/UberSearingExarchGloves.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-the-celestial-brace',
        'the-celestial-brace',
        'poe_ninja',
        'UniqueArmour',
        'The Celestial Brace',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'the-devourer-of-minds',
        'The Devourer of Minds',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9IZWxtZXRzL1ViZXJFbGRlckhlbG0iLCJ3IjoyLCJoIjoyLCJzY2FsZSI6MX1d/1b4e79354b/UberElderHelm.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-the-devourer-of-minds',
        'the-devourer-of-minds',
        'poe_ninja',
        'UniqueArmour',
        'The Devourer of Minds',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'the-eternity-shroud',
        'The Eternity Shroud',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9Cb2R5QXJtb3Vycy9NYW50bGVPZkRpc21hbnRsaW5nIiwidyI6MiwiaCI6Mywic2NhbGUiOjF9XQ/166d15bbe2/MantleOfDismantling.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-the-eternity-shroud',
        'the-eternity-shroud',
        'poe_ninja',
        'UniqueArmour',
        'The Eternity Shroud',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'the-gluttonous-tide',
        'The Gluttonous Tide',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvV2VhcG9ucy9Ud29IYW5kV2VhcG9ucy9Cb3dzL0ZyZW56aWVkVGVudGFjbGVzIiwidyI6MiwiaCI6NCwic2NhbGUiOjF9XQ/6dc3218af0/FrenziedTentacles.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-the-gluttonous-tide',
        'the-gluttonous-tide',
        'poe_ninja',
        'UniqueWeapon',
        'The Gluttonous Tide',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'the-saviour',
        'The Saviour',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvV2VhcG9ucy9PbmVIYW5kV2VhcG9ucy9PbmVIYW5kU3dvcmRzL01pcmFnZUJsYWRlIiwidyI6MiwiaCI6Mywic2NhbGUiOjEsInJlbGljIjo3fV0/cddb35c052/MirageBlade.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-the-saviour',
        'the-saviour',
        'poe_ninja',
        'UniqueWeapon',
        'The Saviour',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'the-tempest-rising',
        'The Tempest Rising',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9Cb290cy9VYmVyU2lydXNCb290cyIsInciOjIsImgiOjIsInNjYWxlIjoxfV0/587f0ef638/UberSirusBoots.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-the-tempest-rising',
        'the-tempest-rising',
        'poe_ninja',
        'UniqueArmour',
        'The Tempest Rising',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'the-tides-of-time',
        'The Tides of Time',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQmVsdHMvVWJlclNoYXBlckJlbHQiLCJ3IjoyLCJoIjoxLCJzY2FsZSI6MX1d/7a326845e7/UberShaperBelt.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-the-tides-of-time',
        'the-tides-of-time',
        'poe_ninja',
        'UniqueAccessory',
        'The Tides of Time',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'thread-of-hope',
        'Thread of Hope',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvSmV3ZWxzL0Nvbm5lY3RlZEpld2VsIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/1d2c1f698a/ConnectedJewel.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-thread-of-hope',
        'thread-of-hope',
        'poe_ninja',
        'UniqueJewel',
        'Thread of Hope',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'viridis-veil',
        'Viridi''s Veil',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9IZWxtZXRzL0NvbnN0cmljdGluZ0Nyb3duIiwidyI6MiwiaCI6Miwic2NhbGUiOjF9XQ/04ee655ca5/ConstrictingCrown.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-viridis-veil',
        'viridis-veil',
        'poe_ninja',
        'UniqueArmour',
        'Viridi''s Veil',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'visceral-reliquary-key',
        'Visceral Reliquary Key',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9FYXRlck9mV29ybGRzRm9pbCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/b57140936b/EaterOfWorldsFoil.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-visceral-reliquary-key',
        'visceral-reliquary-key',
        'poe_ninja',
        'Fragment',
        'Visceral Reliquary Key',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'void-of-the-elements',
        'Void of the Elements',
        'divination_card',
        'https://web.poecdn.com/image/Art/2DItems/Divination/InventoryIcon.png?scale=1&w=1&h=1',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-void-of-the-elements',
        'void-of-the-elements',
        'poe_ninja',
        'DivinationCard',
        'Void of the Elements',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'voidfletcher',
        'Voidfletcher',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvUXVpdmVycy9FbGRhclF1aXZlciIsInciOjIsImgiOjMsInNjYWxlIjoxfV0/5b04f2a291/EldarQuiver.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-voidfletcher',
        'voidfletcher',
        'poe_ninja',
        'UniqueArmour',
        'Voidfletcher',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'voidforge',
        'Voidforge',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvV2VhcG9ucy9Ud29IYW5kV2VhcG9ucy9Ud29IYW5kU3dvcmRzL1N0YXJmb3JnZSIsInciOjIsImgiOjQsInNjYWxlIjoxfV0/86b81685e1/Starforge.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-voidforge',
        'voidforge',
        'poe_ninja',
        'UniqueWeapon',
        'Voidforge',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'voidwalker',
        'Voidwalker',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9Cb290cy9Dcm9zc2luZ1RoZVZvaWQiLCJ3IjoyLCJoIjoyLCJzY2FsZSI6MX1d/f3747eb0f4/CrossingTheVoid.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-voidwalker',
        'voidwalker',
        'poe_ninja',
        'UniqueArmour',
        'Voidwalker',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'al-hezmin-crest',
        'Al-Hezmin''s Crest',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9IdW50ZXJGcmFnbWVudCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/4a1c79a0f7/HunterFragment.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-al-hezmin-crest',
        'al-hezmin-crest',
        'poe_ninja',
        'Fragment',
        'Al-Hezmin''s Crest',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'awakening-fragment',
        'Awakening Fragment',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9VYmVyQm9zc0tleVNpcnVzIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/2d2c405857/UberBossKeySirus.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-awakening-fragment',
        'awakening-fragment',
        'poe_ninja',
        'Fragment',
        'Awakening Fragment',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'awakened-empower-support',
        'Awakened Empower Support',
        'gem',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1N1cHBvcnRQbHVzL0VtcG93ZXJQbHVzIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/eb0e6f91ed/EmpowerPlus.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-awakened-empower-support',
        'awakened-empower-support',
        'poe_ninja',
        'SkillGem',
        'Awakened Empower Support',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'barans-crest',
        'Baran''s Crest',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9DcnVzYWRlckZyYWdtZW50IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/83e0f167f2/CrusaderFragment.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-barans-crest',
        'barans-crest',
        'poe_ninja',
        'Fragment',
        'Baran''s Crest',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'blasphemers-grasp',
        'Blasphemer''s Grasp',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9HbG92ZXMvRWxkZXJHbG92ZXMiLCJ3IjoyLCJoIjoyLCJzY2FsZSI6MX1d/dda114f6f9/ElderGloves.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-blasphemers-grasp',
        'blasphemers-grasp',
        'poe_ninja',
        'UniqueArmour',
        'Blasphemer''s Grasp',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'cooldown-recovery-support',
        'Cooldown Recovery Support',
        'gem',
        'https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0Nvb2xkb3duUmVjb3ZlcnkiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MSwiZ2UiOnRydWV9XQ/21c017b506/CooldownRecovery.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-cooldown-recovery-support',
        'cooldown-recovery-support',
        'poe_ninja',
        'SkillGem',
        'Cooldown Recovery Support',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'cosmic-fragment',
        'Cosmic Fragment',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9VYmVyQm9zc0tleVNoYXBlciIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/d5ef574938/UberBossKeyShaper.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-cosmic-fragment',
        'cosmic-fragment',
        'poe_ninja',
        'Fragment',
        'Cosmic Fragment',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'cyclopean-coil',
        'Cyclopean Coil',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQmVsdHMvRWxkZXJCZWx0IiwidyI6MiwiaCI6MSwic2NhbGUiOjF9XQ/f565e25e57/ElderBelt.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-cyclopean-coil',
        'cyclopean-coil',
        'poe_ninja',
        'UniqueAccessory',
        'Cyclopean Coil',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'decaying-fragment',
        'Decaying Fragment',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9VYmVyQm9zc0tleUVsZGVyIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/dffa4053b9/UberBossKeyElder.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-decaying-fragment',
        'decaying-fragment',
        'poe_ninja',
        'Fragment',
        'Decaying Fragment',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'droxs-crest',
        'Drox''s Crest',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9XYXJsb3JkRnJhZ21lbnQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/863882aba2/WarlordFragment.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-droxs-crest',
        'droxs-crest',
        'poe_ninja',
        'Fragment',
        'Drox''s Crest',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'eldritch-blasphemy-support',
        'Eldritch Blasphemy Support',
        'gem',
        'https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0F1cmlmeSIsInciOjEsImgiOjEsInNjYWxlIjoxLCJnZSI6dHJ1ZX1d/35e0f624bb/Aurify.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-eldritch-blasphemy-support',
        'eldritch-blasphemy-support',
        'poe_ninja',
        'SkillGem',
        'Eldritch Blasphemy Support',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'fragment-of-constriction',
        'Fragment of Constriction',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9BdGxhc01hcEd1YXJkaWFuSG9seSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/ade615a113/AtlasMapGuardianHoly.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-fragment-of-constriction',
        'fragment-of-constriction',
        'poe_ninja',
        'Fragment',
        'Fragment of Constriction',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'fragment-of-emptiness',
        'Fragment of Emptiness',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9VYmVyRWxkZXIwMiIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/ced2590995/UberElder02.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-fragment-of-emptiness',
        'fragment-of-emptiness',
        'poe_ninja',
        'Fragment',
        'Fragment of Emptiness',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'fragment-of-enslavement',
        'Fragment of Enslavement',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9BdGxhc01hcEd1YXJkaWFuRmlyZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/6327dee00e/AtlasMapGuardianFire.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-fragment-of-enslavement',
        'fragment-of-enslavement',
        'poe_ninja',
        'Fragment',
        'Fragment of Enslavement',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'fragment-of-eradication',
        'Fragment of Eradication',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9BdGxhc01hcEd1YXJkaWFuTGlnaHRuaW5nIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/22a9d1257c/AtlasMapGuardianLightning.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-fragment-of-eradication',
        'fragment-of-eradication',
        'poe_ninja',
        'Fragment',
        'Fragment of Eradication',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'fragment-of-knowledge',
        'Fragment of Knowledge',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9VYmVyRWxkZXIwNCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/4a2bab8955/UberElder04.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-fragment-of-knowledge',
        'fragment-of-knowledge',
        'poe_ninja',
        'Fragment',
        'Fragment of Knowledge',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'fragment-of-purification',
        'Fragment of Purification',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9BdGxhc01hcEd1YXJkaWFuQ2hhb3MiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/767832e457/AtlasMapGuardianChaos.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-fragment-of-purification',
        'fragment-of-purification',
        'poe_ninja',
        'Fragment',
        'Fragment of Purification',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'fragment-of-shape',
        'Fragment of Shape',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9VYmVyRWxkZXIwMyIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/dd71531c9f/UberElder03.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-fragment-of-shape',
        'fragment-of-shape',
        'poe_ninja',
        'Fragment',
        'Fragment of Shape',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'fragment-of-terror',
        'Fragment of Terror',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9VYmVyRWxkZXIwMSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/061cd63c5e/UberElder01.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-fragment-of-terror',
        'fragment-of-terror',
        'poe_ninja',
        'Fragment',
        'Fragment of Terror',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'hopeshredder',
        'Hopeshredder',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvV2VhcG9ucy9Ud29IYW5kV2VhcG9ucy9Cb3dzL0VsZGVyQm93IiwidyI6MiwiaCI6NCwic2NhbGUiOjF9XQ/537ee088f0/ElderBow.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-hopeshredder',
        'hopeshredder',
        'poe_ninja',
        'UniqueWeapon',
        'Hopeshredder',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'nebuloch',
        'Nebuloch',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvV2VhcG9ucy9PbmVIYW5kV2VhcG9ucy9PbmVIYW5kTWFjZXMvRWxkZXJNYWNlIiwidyI6MiwiaCI6Mywic2NhbGUiOjF9XQ/f381b102f8/ElderMace.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-nebuloch',
        'nebuloch',
        'poe_ninja',
        'UniqueWeapon',
        'Nebuloch',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'reality-fragment',
        'Reality Fragment',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9VYmVyQm9zc0tleU1hdmVuIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/1876f58c4b/UberBossKeyMaven.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-reality-fragment',
        'reality-fragment',
        'poe_ninja',
        'Fragment',
        'Reality Fragment',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'shimmeron',
        'Shimmeron',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvV2VhcG9ucy9PbmVIYW5kV2VhcG9ucy9XYW5kcy9FbGRlcldhbmQiLCJ3IjoxLCJoIjozLCJzY2FsZSI6MX1d/f941d5c543/ElderWand.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-shimmeron',
        'shimmeron',
        'poe_ninja',
        'UniqueWeapon',
        'Shimmeron',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'veritanias-crest',
        'Veritania''s Crest',
        'fragment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9SZWRlZW1lckZyYWdtZW50IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/5416c38a70/RedeemerFragment.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-veritanias-crest',
        'veritanias-crest',
        'poe_ninja',
        'Fragment',
        'Veritania''s Crest',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'void-shockwave-support',
        'Void Shockwave Support',
        'gem',
        'https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1Nob2Nrd2F2ZSIsInciOjEsImgiOjEsInNjYWxlIjoxLCJnZSI6dHJ1ZX1d/d342aa7321/Shockwave.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-void-shockwave-support',
        'void-shockwave-support',
        'poe_ninja',
        'SkillGem',
        'Void Shockwave Support',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'voidstorm-support',
        'Voidstorm Support',
        'gem',
        'https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1ZvaWRzdG9ybSIsInciOjEsImgiOjEsInNjYWxlIjoxLCJnZSI6dHJ1ZX1d/81b02defec/Voidstorm.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-poe_ninja-voidstorm-support',
        'voidstorm-support',
        'poe_ninja',
        'SkillGem',
        'Voidstorm Support',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'watchers-eye-unidentified-ilvl-85',
        'Watcher''s Eye (Unidentified, ilvl 85)',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvSmV3ZWxzL0VsZGVySmV3ZWwiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/278c673716/ElderJewel.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-manual-watchers-eye-unidentified-ilvl-85',
        'watchers-eye-unidentified-ilvl-85',
        'manual',
        'Manual',
        'watchers-eye-unidentified-ilvl-85',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO items (
        id, name, category, icon_url, trade_url, created_at, updated_at
      ) VALUES (
        'watchers-eye-unidentified-ilvl-86-plus',
        'Watcher''s Eye (Unidentified, ilvl 86+)',
        'equipment',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvSmV3ZWxzL0VsZGVySmV3ZWwiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/278c673716/ElderJewel.png',
        NULL,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        icon_url = excluded.icon_url,
        trade_url = excluded.trade_url,
        updated_at = excluded.updated_at;
INSERT INTO item_price_mappings (
        id, item_id, provider, external_type, external_key, is_active, created_at, updated_at
      ) VALUES (
        'curated-manual-watchers-eye-unidentified-ilvl-86-plus',
        'watchers-eye-unidentified-ilvl-86-plus',
        'manual',
        'Manual',
        'watchers-eye-unidentified-ilvl-86-plus',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(item_id, provider) DO UPDATE SET
        external_type = excluded.external_type,
        external_key = excluded.external_key,
        is_active = 1,
        updated_at = excluded.updated_at;
INSERT INTO bosses (
        id, name, slug, description, icon_url, is_active, created_at, updated_at
      ) VALUES (
        'eater-of-worlds',
        'Eater of Worlds',
        'eater-of-worlds',
        'The Eater of Worlds pinnacle encounter.',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvUXVlc3RJdGVtcy9UYW5nbGVkT3JiUXVlc3Q1IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/75de691c2b/TangledOrbQuest5.png',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        slug = excluded.slug,
        description = excluded.description,
        icon_url = excluded.icon_url,
        is_active = excluded.is_active,
        updated_at = excluded.updated_at;
DELETE FROM boss_entry_components WHERE boss_id = 'eater-of-worlds';
DELETE FROM boss_drops WHERE boss_id = 'eater-of-worlds';
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-eater-of-worlds-screaming-invitation',
          'eater-of-worlds',
          'screaming-invitation',
          1,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-eater-of-worlds-gluttony-support',
          'eater-of-worlds',
          'gluttony-support',
          NULL,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Eater_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-eater-of-worlds-eldritch-chaos-orb',
          'eater-of-worlds',
          'eldritch-chaos-orb',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Eater_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-eater-of-worlds-eldritch-exalted-orb',
          'eater-of-worlds',
          'eldritch-exalted-orb',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Eater_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-eater-of-worlds-eldritch-orb-of-annulment',
          'eater-of-worlds',
          'eldritch-orb-of-annulment',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Eater_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-eater-of-worlds-exceptional-eldritch-ichor',
          'eater-of-worlds',
          'exceptional-eldritch-ichor',
          0.15,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Eater_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-eater-of-worlds-inextricable-fate',
          'eater-of-worlds',
          'inextricable-fate',
          0.55,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Eater_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-eater-of-worlds-melding-of-the-flesh',
          'eater-of-worlds',
          'melding-of-the-flesh',
          0.02,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Eater_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-eater-of-worlds-the-gluttonous-tide',
          'eater-of-worlds',
          'the-gluttonous-tide',
          0.43,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Eater_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO bosses (
        id, name, slug, description, icon_url, is_active, created_at, updated_at
      ) VALUES (
        'uber-eater-of-worlds',
        'Uber Eater of Worlds',
        'uber-eater-of-worlds',
        'The Uber Eater of Worlds pinnacle encounter.',
        'https://web.poecdn.com/gen/image/WzI4LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9VYmVyQm9zc0tleUVhdGVyT2ZXb3JsZHMiLCJzY2FsZSI6MX1d/6022aa0897/UberBossKeyEaterOfWorlds.png',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        slug = excluded.slug,
        description = excluded.description,
        icon_url = excluded.icon_url,
        is_active = excluded.is_active,
        updated_at = excluded.updated_at;
DELETE FROM boss_entry_components WHERE boss_id = 'uber-eater-of-worlds';
DELETE FROM boss_drops WHERE boss_id = 'uber-eater-of-worlds';
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-uber-eater-of-worlds-devouring-fragment',
          'uber-eater-of-worlds',
          'devouring-fragment',
          4,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-eater-of-worlds-gluttony-support',
          'uber-eater-of-worlds',
          'gluttony-support',
          NULL,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Eater_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-eater-of-worlds-ashes-of-the-stars',
          'uber-eater-of-worlds',
          'ashes-of-the-stars',
          0.3,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Eater_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-eater-of-worlds-curio-of-consumption',
          'uber-eater-of-worlds',
          'curio-of-consumption',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Eater_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-eater-of-worlds-eldritch-chaos-orb',
          'uber-eater-of-worlds',
          'eldritch-chaos-orb',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Eater_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-eater-of-worlds-eldritch-exalted-orb',
          'uber-eater-of-worlds',
          'eldritch-exalted-orb',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Eater_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-eater-of-worlds-eldritch-orb-of-annulment',
          'uber-eater-of-worlds',
          'eldritch-orb-of-annulment',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Eater_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-eater-of-worlds-exceptional-eldritch-ichor',
          'uber-eater-of-worlds',
          'exceptional-eldritch-ichor',
          0.15,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Eater_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-eater-of-worlds-forbidden-flesh',
          'uber-eater-of-worlds',
          'forbidden-flesh',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Eater_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-eater-of-worlds-nimis',
          'uber-eater-of-worlds',
          'nimis',
          0.02,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Eater_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-eater-of-worlds-ravenous-passion',
          'uber-eater-of-worlds',
          'ravenous-passion',
          0.68,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Eater_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-eater-of-worlds-visceral-reliquary-key',
          'uber-eater-of-worlds',
          'visceral-reliquary-key',
          0.01,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Eater_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO bosses (
        id, name, slug, description, icon_url, is_active, created_at, updated_at
      ) VALUES (
        'exarch',
        'Exarch',
        'exarch',
        'The Searing Exarch pinnacle encounter.',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvUXVlc3RJdGVtcy9DbGVhbnNpbmdGaXJlT3JiUXVlc3Q1IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/e6f9234053/CleansingFireOrbQuest5.png',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        slug = excluded.slug,
        description = excluded.description,
        icon_url = excluded.icon_url,
        is_active = excluded.is_active,
        updated_at = excluded.updated_at;
DELETE FROM boss_entry_components WHERE boss_id = 'exarch';
DELETE FROM boss_drops WHERE boss_id = 'exarch';
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-exarch-incandescent-invitation',
          'exarch',
          'incandescent-invitation',
          1,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-exarch-overheat-support',
          'exarch',
          'overheat-support',
          NULL,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Eater_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-exarch-auspicious-ambitions',
          'exarch',
          'auspicious-ambitions',
          0.01,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-exarch-dawnbreaker',
          'exarch',
          'dawnbreaker',
          0.63,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-exarch-dawnstrider',
          'exarch',
          'dawnstrider',
          0.35,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-exarch-dissolution-of-the-flesh',
          'exarch',
          'dissolution-of-the-flesh',
          0.02,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-exarch-eldritch-chaos-orb',
          'exarch',
          'eldritch-chaos-orb',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-exarch-eldritch-exalted-orb',
          'exarch',
          'eldritch-exalted-orb',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-exarch-eldritch-orb-of-annulment',
          'exarch',
          'eldritch-orb-of-annulment',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-exarch-exceptional-eldritch-ember',
          'exarch',
          'exceptional-eldritch-ember',
          0.15,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-exarch-forbidden-flame',
          'exarch',
          'forbidden-flame',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-exarch-the-annihilating-light',
          'exarch',
          'the-annihilating-light',
          0.455,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-exarch-the-celestial-brace',
          'exarch',
          'the-celestial-brace',
          0.015,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO bosses (
        id, name, slug, description, icon_url, is_active, created_at, updated_at
      ) VALUES (
        'uber-exarch',
        'Uber Exarch',
        'uber-exarch',
        'The Uber Searing Exarch pinnacle encounter.',
        'https://web.poecdn.com/gen/image/WzI4LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9VYmVyQm9zc0tleVNlYXJpbmdFeGFyY2giLCJzY2FsZSI6MX1d/cc2f3bce1b/UberBossKeySearingExarch.png',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        slug = excluded.slug,
        description = excluded.description,
        icon_url = excluded.icon_url,
        is_active = excluded.is_active,
        updated_at = excluded.updated_at;
DELETE FROM boss_entry_components WHERE boss_id = 'uber-exarch';
DELETE FROM boss_drops WHERE boss_id = 'uber-exarch';
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-uber-exarch-blazing-fragment',
          'uber-exarch',
          'blazing-fragment',
          4,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-exarch-overheat-support',
          'uber-exarch',
          'overheat-support',
          NULL,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Eater_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-exarch-annihilations-approach',
          'uber-exarch',
          'annihilations-approach',
          0.29,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-exarch-archive-reliquary-key',
          'uber-exarch',
          'archive-reliquary-key',
          0.015,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-exarch-auspicious-ambitions',
          'uber-exarch',
          'auspicious-ambitions',
          0.01,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-exarch-crystallised-omniscience',
          'uber-exarch',
          'crystallised-omniscience',
          0.24,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-exarch-curio-of-absorption',
          'uber-exarch',
          'curio-of-absorption',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-exarch-eldritch-chaos-orb',
          'uber-exarch',
          'eldritch-chaos-orb',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-exarch-eldritch-exalted-orb',
          'uber-exarch',
          'eldritch-exalted-orb',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-exarch-eldritch-orb-of-annulment',
          'uber-exarch',
          'eldritch-orb-of-annulment',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-exarch-exceptional-eldritch-ember',
          'uber-exarch',
          'exceptional-eldritch-ember',
          0.15,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-exarch-forbidden-flame',
          'uber-exarch',
          'forbidden-flame',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-exarch-the-annihilating-light',
          'uber-exarch',
          'the-annihilating-light',
          0.455,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-exarch-the-celestial-brace',
          'uber-exarch',
          'the-celestial-brace',
          0.015,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Searing_Exarch',
          1782925058841,
          1782925058841
        );
INSERT INTO bosses (
        id, name, slug, description, icon_url, is_active, created_at, updated_at
      ) VALUES (
        'maven',
        'Maven',
        'maven',
        'The Maven pinnacle encounter.',
        'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQXRsYXMvTWF2ZW5LZXkiLCJzY2FsZSI6MX1d/40683e487b/MavenKey.png',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        slug = excluded.slug,
        description = excluded.description,
        icon_url = excluded.icon_url,
        is_active = excluded.is_active,
        updated_at = excluded.updated_at;
DELETE FROM boss_entry_components WHERE boss_id = 'maven';
DELETE FROM boss_drops WHERE boss_id = 'maven';
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-maven-mavens-writ',
          'maven',
          'mavens-writ',
          1,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-maven-arns-anguish',
          'maven',
          'arns-anguish',
          0.17,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Maven',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-maven-auspicious-ambitions',
          'maven',
          'auspicious-ambitions',
          0.0005,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Maven',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-maven-doppelg-nger-guise',
          'maven',
          'doppelg-nger-guise',
          0.07,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Maven',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-maven-echoforge',
          'maven',
          'echoforge',
          0.01,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Maven',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-maven-gravens-secret',
          'maven',
          'gravens-secret',
          0.17,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Maven',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-maven-invert-the-rules-support',
          'maven',
          'invert-the-rules-support',
          0.1,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Maven',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-maven-legacy-of-fury',
          'maven',
          'legacy-of-fury',
          0.41,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Maven',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-maven-olesyas-delight',
          'maven',
          'olesyas-delight',
          0.17,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Maven',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-maven-orb-of-conflict',
          'maven',
          'orb-of-conflict',
          0.32,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Maven',
          1782925058841,
          1782925058841
        );
INSERT INTO bosses (
        id, name, slug, description, icon_url, is_active, created_at, updated_at
      ) VALUES (
        'uber-maven',
        'Uber Maven',
        'uber-maven',
        'The Uber Maven encounter.',
        'https://web.poecdn.com/gen/image/WzI4LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9VYmVyQm9zc0tleU1hdmVuIiwic2NhbGUiOjF9XQ/20e155ad7d/UberBossKeyMaven.png',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        slug = excluded.slug,
        description = excluded.description,
        icon_url = excluded.icon_url,
        is_active = excluded.is_active,
        updated_at = excluded.updated_at;
DELETE FROM boss_entry_components WHERE boss_id = 'uber-maven';
DELETE FROM boss_drops WHERE boss_id = 'uber-maven';
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-uber-maven-reality-fragment',
          'uber-maven',
          'reality-fragment',
          4,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-maven-auspicious-ambitions',
          'uber-maven',
          'auspicious-ambitions',
          0.0005,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Maven',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-maven-awakened-enhance-support',
          'uber-maven',
          'awakened-enhance-support',
          0.01,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Maven',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-maven-awakened-enlighten-support',
          'uber-maven',
          'awakened-enlighten-support',
          0.005,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Maven',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-maven-awakened-empower-support',
          'uber-maven',
          'awakened-empower-support',
          0.006,
          NULL,
          NULL,
          'Mock MVP rate',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-maven-curio-of-potential',
          'uber-maven',
          'curio-of-potential',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Maven',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-maven-eclipse-support',
          'uber-maven',
          'eclipse-support',
          0.02,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Maven',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-maven-grace-of-the-goddess',
          'uber-maven',
          'grace-of-the-goddess',
          0.14,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Maven',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-maven-impossible-escape',
          'uber-maven',
          'impossible-escape',
          0.315,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Maven',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-maven-invert-the-rules-support',
          'uber-maven',
          'invert-the-rules-support',
          0.1,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Maven',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-maven-orb-of-conflict',
          'uber-maven',
          'orb-of-conflict',
          0.32,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Maven',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-maven-progenesis',
          'uber-maven',
          'progenesis',
          0.025,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Maven',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-maven-shiny-reliquary-key',
          'uber-maven',
          'shiny-reliquary-key',
          0.007,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Maven',
          1782925058841,
          1782925058841
        );
INSERT INTO bosses (
        id, name, slug, description, icon_url, is_active, created_at, updated_at
      ) VALUES (
        'shaper',
        'Shaper',
        'shaper',
        'The Shaper pinnacle encounter.',
        'https://www.poewiki.net/images/f/f7/Key_to_the_Crucible_inventory_icon.png',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        slug = excluded.slug,
        description = excluded.description,
        icon_url = excluded.icon_url,
        is_active = excluded.is_active,
        updated_at = excluded.updated_at;
DELETE FROM boss_entry_components WHERE boss_id = 'shaper';
DELETE FROM boss_drops WHERE boss_id = 'shaper';
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-shaper-fragment-phoenix',
          'shaper',
          'fragment-phoenix',
          1,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-shaper-fragment-minotaur',
          'shaper',
          'fragment-minotaur',
          1,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-shaper-fragment-chimera',
          'shaper',
          'fragment-chimera',
          1,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-shaper-fragment-hydra',
          'shaper',
          'fragment-hydra',
          1,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-shaper-voidstorm-support',
          'shaper',
          'voidstorm-support',
          NULL,
          NULL,
          NULL,
          NULL,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-shaper-dying-sun',
          'shaper',
          'dying-sun',
          0.03,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Shaper',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-shaper-orb-dominance',
          'shaper',
          'orb-dominance',
          0.03,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Shaper',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-shaper-shapers-exalted-orb',
          'shaper',
          'shapers-exalted-orb',
          0.12,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Shaper',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-shaper-shapers-touch',
          'shaper',
          'shapers-touch',
          0.56,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Shaper',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-shaper-solstice-vigil',
          'shaper',
          'solstice-vigil',
          0.15,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Shaper',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-shaper-voidwalker',
          'shaper',
          'voidwalker',
          0.26,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Shaper',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-shaper-fragment-of-knowledge',
          'shaper',
          'fragment-of-knowledge',
          0.5,
          'uber-elder-fragment',
          'one_of',
          'Guaranteed one of Fragment of Knowledge or Fragment of Shape; source=data/curated/IMPORTANT.TXT',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-shaper-fragment-of-shape',
          'shaper',
          'fragment-of-shape',
          0.5,
          'uber-elder-fragment',
          'one_of',
          'Guaranteed one of Fragment of Knowledge or Fragment of Shape; source=data/curated/IMPORTANT.TXT',
          1782925058841,
          1782925058841
        );
INSERT INTO bosses (
        id, name, slug, description, icon_url, is_active, created_at, updated_at
      ) VALUES (
        'uber-shaper',
        'Uber Shaper',
        'uber-shaper',
        'The Uber Shaper encounter.',
        'https://web.poecdn.com/gen/image/WzI4LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9VYmVyQm9zc0tleVNoYXBlciIsInNjYWxlIjoxfV0/719e96a82a/UberBossKeyShaper.png',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        slug = excluded.slug,
        description = excluded.description,
        icon_url = excluded.icon_url,
        is_active = excluded.is_active,
        updated_at = excluded.updated_at;
DELETE FROM boss_entry_components WHERE boss_id = 'uber-shaper';
DELETE FROM boss_drops WHERE boss_id = 'uber-shaper';
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-uber-shaper-cosmic-fragment',
          'uber-shaper',
          'cosmic-fragment',
          4,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-shaper-voidstorm-support',
          'uber-shaper',
          'voidstorm-support',
          NULL,
          NULL,
          NULL,
          NULL,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-shaper-cosmic-reliquary-key',
          'uber-shaper',
          'cosmic-reliquary-key',
          0.01,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Shaper',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-shaper-echoes-of-creation',
          'uber-shaper',
          'echoes-of-creation',
          0.4,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Shaper',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-shaper-entropic-devastation',
          'uber-shaper',
          'entropic-devastation',
          0.36,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Shaper',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-shaper-orb-dominance',
          'uber-shaper',
          'orb-dominance',
          0.03,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Shaper',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-shaper-shapers-exalted-orb',
          'uber-shaper',
          'shapers-exalted-orb',
          0.12,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Shaper',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-shaper-starforge',
          'uber-shaper',
          'starforge',
          0.02,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Shaper',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-shaper-sublime-vision',
          'uber-shaper',
          'sublime-vision',
          0.02,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Shaper',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-shaper-the-tides-of-time',
          'uber-shaper',
          'the-tides-of-time',
          0.22,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Shaper',
          1782925058841,
          1782925058841
        );
INSERT INTO bosses (
        id, name, slug, description, icon_url, is_active, created_at, updated_at
      ) VALUES (
        'sirus',
        'Sirus',
        'sirus',
        'Sirus, Awakener of Worlds.',
        'https://www.poewiki.net/images/b/b6/Crest_of_the_Elderslayers_inventory_icon.png',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        slug = excluded.slug,
        description = excluded.description,
        icon_url = excluded.icon_url,
        is_active = excluded.is_active,
        updated_at = excluded.updated_at;
DELETE FROM boss_entry_components WHERE boss_id = 'sirus';
DELETE FROM boss_drops WHERE boss_id = 'sirus';
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-sirus-veritanias-crest',
          'sirus',
          'veritanias-crest',
          1,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-sirus-droxs-crest',
          'sirus',
          'droxs-crest',
          1,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-sirus-barans-crest',
          'sirus',
          'barans-crest',
          1,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-sirus-al-hezmin-crest',
          'sirus',
          'al-hezmin-crest',
          1,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-sirus-a-fate-worse-than-death',
          'sirus',
          'a-fate-worse-than-death',
          0.04,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/Sirus,_Awakener_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-sirus-annihilation-support',
          'sirus',
          'annihilation-support',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/Sirus,_Awakener_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-sirus-awakeners-orb',
          'sirus',
          'awakeners-orb',
          0.2,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/Sirus,_Awakener_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-sirus-crown-of-the-inward-eye',
          'sirus',
          'crown-of-the-inward-eye',
          0.35,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/Sirus,_Awakener_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-sirus-hands-of-the-high-templar',
          'sirus',
          'hands-of-the-high-templar',
          0.4,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/Sirus,_Awakener_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-sirus-orb-dominance',
          'sirus',
          'orb-dominance',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/Sirus,_Awakener_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-sirus-the-burden-of-truth',
          'sirus',
          'the-burden-of-truth',
          0.2,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/Sirus,_Awakener_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-sirus-thread-of-hope',
          'sirus',
          'thread-of-hope',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/Sirus,_Awakener_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO bosses (
        id, name, slug, description, icon_url, is_active, created_at, updated_at
      ) VALUES (
        'uber-sirus',
        'Uber Sirus',
        'uber-sirus',
        'Sirus, Awakener of Worlds.',
        'https://web.poecdn.com/gen/image/WzI4LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9VYmVyQm9zc0tleVNpcnVzIiwic2NhbGUiOjF9XQ/094681ee85/UberBossKeySirus.png',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        slug = excluded.slug,
        description = excluded.description,
        icon_url = excluded.icon_url,
        is_active = excluded.is_active,
        updated_at = excluded.updated_at;
DELETE FROM boss_entry_components WHERE boss_id = 'uber-sirus';
DELETE FROM boss_drops WHERE boss_id = 'uber-sirus';
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-uber-sirus-awakening-fragment',
          'uber-sirus',
          'awakening-fragment',
          4,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-sirus-a-fate-worse-than-death',
          'uber-sirus',
          'a-fate-worse-than-death',
          0.04,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/Sirus,_Awakener_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-sirus-annihilation-support',
          'uber-sirus',
          'annihilation-support',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/Sirus,_Awakener_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-sirus-awakeners-orb',
          'uber-sirus',
          'awakeners-orb',
          0.2,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/Sirus,_Awakener_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-sirus-orb-dominance',
          'uber-sirus',
          'orb-dominance',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/Sirus,_Awakener_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-sirus-oriaths-end',
          'uber-sirus',
          'oriaths-end',
          0.075,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/Sirus,_Awakener_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-sirus-oubliette-reliquary-key',
          'uber-sirus',
          'oubliette-reliquary-key',
          0.015,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/Sirus,_Awakener_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-sirus-the-saviour',
          'uber-sirus',
          'the-saviour',
          0.01,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/Sirus,_Awakener_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-sirus-the-tempest-rising',
          'uber-sirus',
          'the-tempest-rising',
          0.37,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/Sirus,_Awakener_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-sirus-thread-of-hope',
          'uber-sirus',
          'thread-of-hope',
          0.55,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/Sirus,_Awakener_of_Worlds',
          1782925058841,
          1782925058841
        );
INSERT INTO bosses (
        id, name, slug, description, icon_url, is_active, created_at, updated_at
      ) VALUES (
        'elder',
        'Elder',
        'elder',
        'The Elder encounter.',
        'https://www.poewiki.net/images/6/6a/Key_to_Decay_inventory_icon.png',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        slug = excluded.slug,
        description = excluded.description,
        icon_url = excluded.icon_url,
        is_active = excluded.is_active,
        updated_at = excluded.updated_at;
DELETE FROM boss_entry_components WHERE boss_id = 'elder';
DELETE FROM boss_drops WHERE boss_id = 'elder';
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-elder-fragment-of-purification',
          'elder',
          'fragment-of-purification',
          1,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-elder-fragment-of-constriction',
          'elder',
          'fragment-of-constriction',
          1,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-elder-fragment-of-enslavement',
          'elder',
          'fragment-of-enslavement',
          1,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-elder-fragment-of-eradication',
          'elder',
          'fragment-of-eradication',
          1,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-elder-elders-exalted-orb',
          'elder',
          'elders-exalted-orb',
          0.1,
          NULL,
          NULL,
          NULL,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-elder-impresence-chaos',
          'elder',
          'impresence-chaos',
          0.02,
          'elder-guaranteed-unique',
          'one_of',
          'Part of guaranteed Elder unique pool; source=data/curated/IMPORTANT.TXT',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-elder-impresence-physical',
          'elder',
          'impresence-physical',
          0.02,
          'elder-guaranteed-unique',
          'one_of',
          'Part of guaranteed Elder unique pool; source=data/curated/IMPORTANT.TXT',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-elder-impresence-cold',
          'elder',
          'impresence-cold',
          0.02,
          'elder-guaranteed-unique',
          'one_of',
          'Part of guaranteed Elder unique pool; source=data/curated/IMPORTANT.TXT',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-elder-impresence-lightning',
          'elder',
          'impresence-lightning',
          0.02,
          'elder-guaranteed-unique',
          'one_of',
          'Part of guaranteed Elder unique pool; source=data/curated/IMPORTANT.TXT',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-elder-impresence-fire',
          'elder',
          'impresence-fire',
          0.02,
          'elder-guaranteed-unique',
          'one_of',
          'Part of guaranteed Elder unique pool; source=data/curated/IMPORTANT.TXT',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-elder-cyclopean-coil',
          'elder',
          'cyclopean-coil',
          0.3,
          'elder-guaranteed-unique',
          'one_of',
          'Part of guaranteed Elder unique pool; source=data/curated/IMPORTANT.TXT',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-elder-blasphemers-grasp',
          'elder',
          'blasphemers-grasp',
          0.3,
          'elder-guaranteed-unique',
          'one_of',
          'Part of guaranteed Elder unique pool; source=data/curated/IMPORTANT.TXT',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-elder-nebuloch',
          'elder',
          'nebuloch',
          0.1,
          'elder-guaranteed-unique',
          'one_of',
          'Part of guaranteed Elder unique pool; source=data/curated/IMPORTANT.TXT',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-elder-hopeshredder',
          'elder',
          'hopeshredder',
          0.1,
          'elder-guaranteed-unique',
          'one_of',
          'Part of guaranteed Elder unique pool; source=data/curated/IMPORTANT.TXT',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-elder-shimmeron',
          'elder',
          'shimmeron',
          0.1,
          'elder-guaranteed-unique',
          'one_of',
          'Part of guaranteed Elder unique pool; source=data/curated/IMPORTANT.TXT',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-elder-orb-dominance',
          'elder',
          'orb-dominance',
          0.02,
          NULL,
          NULL,
          NULL,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-elder-watchers-eye-unidentified-ilvl-85',
          'elder',
          'watchers-eye-unidentified-ilvl-85',
          0.4,
          NULL,
          NULL,
          NULL,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-elder-eldritch-blasphemy-support',
          'elder',
          'eldritch-blasphemy-support',
          NULL,
          NULL,
          NULL,
          NULL,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-elder-void-of-the-elements',
          'elder',
          'void-of-the-elements',
          NULL,
          NULL,
          NULL,
          NULL,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-elder-fragment-of-terror',
          'elder',
          'fragment-of-terror',
          0.5,
          'uber-elder-fragment',
          'one_of',
          'Guaranteed one of Fragment of Terror or Fragment of Emptiness; source=data/curated/IMPORTANT.TXT',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-elder-fragment-of-emptiness',
          'elder',
          'fragment-of-emptiness',
          0.5,
          'uber-elder-fragment',
          'one_of',
          'Guaranteed one of Fragment of Terror or Fragment of Emptiness; source=data/curated/IMPORTANT.TXT',
          1782925058841,
          1782925058841
        );
INSERT INTO bosses (
        id, name, slug, description, icon_url, is_active, created_at, updated_at
      ) VALUES (
        'uber-elder',
        'Uber Elder',
        'uber-elder',
        'The combined Elder and Shaper encounter.',
        'https://www.poewiki.net/images/b/b0/Maddening_Object_inventory_icon.png',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        slug = excluded.slug,
        description = excluded.description,
        icon_url = excluded.icon_url,
        is_active = excluded.is_active,
        updated_at = excluded.updated_at;
DELETE FROM boss_entry_components WHERE boss_id = 'uber-elder';
DELETE FROM boss_drops WHERE boss_id = 'uber-elder';
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-uber-elder-fragment-of-knowledge',
          'uber-elder',
          'fragment-of-knowledge',
          1,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-uber-elder-fragment-of-shape',
          'uber-elder',
          'fragment-of-shape',
          1,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-uber-elder-fragment-of-terror',
          'uber-elder',
          'fragment-of-terror',
          1,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-uber-elder-fragment-of-emptiness',
          'uber-elder',
          'fragment-of-emptiness',
          1,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-elder-void-shockwave-support',
          'uber-elder',
          'void-shockwave-support',
          NULL,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-elder-cooldown-recovery-support',
          'uber-elder',
          'cooldown-recovery-support',
          NULL,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-elder-auspicious-ambitions',
          'uber-elder',
          'auspicious-ambitions',
          0.01,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-elder-disintegrator',
          'uber-elder',
          'disintegrator',
          0.03,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-elder-elders-exalted-orb',
          'uber-elder',
          'elders-exalted-orb',
          0.1,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-elder-indigon',
          'uber-elder',
          'indigon',
          0.12,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-elder-mark-of-the-elder',
          'uber-elder',
          'mark-of-the-elder',
          0.35,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-elder-mark-of-the-shaper',
          'uber-elder',
          'mark-of-the-shaper',
          0.35,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-elder-orb-dominance',
          'uber-elder',
          'orb-dominance',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-elder-shapers-exalted-orb',
          'uber-elder',
          'shapers-exalted-orb',
          0.15,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-elder-void-of-the-elements',
          'uber-elder',
          'void-of-the-elements',
          0.01,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-elder-voidfletcher',
          'uber-elder',
          'voidfletcher',
          0.15,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-elder-watchers-eye-unidentified-ilvl-86-plus',
          'uber-elder',
          'watchers-eye-unidentified-ilvl-86-plus',
          0.3,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO bosses (
        id, name, slug, description, icon_url, is_active, created_at, updated_at
      ) VALUES (
        'uber-uber-elder',
        'Uber Uber Elder',
        'uber-uber-elder',
        'The combined Elder and Shaper encounter (uber).',
        'https://web.poecdn.com/gen/image/WzI4LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9VYmVyQm9zc0tleUVsZGVyIiwic2NhbGUiOjF9XQ/42d1e96e4e/UberBossKeyElder.png',
        1,
        1782925058841,
        1782925058841
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        slug = excluded.slug,
        description = excluded.description,
        icon_url = excluded.icon_url,
        is_active = excluded.is_active,
        updated_at = excluded.updated_at;
DELETE FROM boss_entry_components WHERE boss_id = 'uber-uber-elder';
DELETE FROM boss_drops WHERE boss_id = 'uber-uber-elder';
INSERT INTO boss_entry_components (
          id, boss_id, item_id, quantity, created_at, updated_at
        ) VALUES (
          'curated-entry-uber-uber-elder-decaying-fragment',
          'uber-uber-elder',
          'decaying-fragment',
          4,
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-uber-elder-void-shockwave-support',
          'uber-uber-elder',
          'void-shockwave-support',
          NULL,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-uber-elder-cooldown-recovery-support',
          'uber-uber-elder',
          'cooldown-recovery-support',
          NULL,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-uber-elder-auspicious-ambitions',
          'uber-uber-elder',
          'auspicious-ambitions',
          0.01,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-uber-elder-call-of-the-void',
          'uber-uber-elder',
          'call-of-the-void',
          0.4,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-uber-elder-curio-of-decay',
          'uber-uber-elder',
          'curio-of-decay',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-uber-elder-decaying-reliquary-key',
          'uber-uber-elder',
          'decaying-reliquary-key',
          0.015,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-uber-elder-elders-exalted-orb',
          'uber-uber-elder',
          'elders-exalted-orb',
          0.1,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-uber-elder-impresence-chaos',
          'uber-uber-elder',
          'impresence-chaos',
          0.02,
          'uber-uber-elder-impresence',
          'one_of',
          'Split Impresence variants from estimated total 10% drop rate; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-uber-elder-impresence-physical',
          'uber-uber-elder',
          'impresence-physical',
          0.02,
          'uber-uber-elder-impresence',
          'one_of',
          'Split Impresence variants from estimated total 10% drop rate; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-uber-elder-impresence-cold',
          'uber-uber-elder',
          'impresence-cold',
          0.02,
          'uber-uber-elder-impresence',
          'one_of',
          'Split Impresence variants from estimated total 10% drop rate; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-uber-elder-impresence-lightning',
          'uber-uber-elder',
          'impresence-lightning',
          0.02,
          'uber-uber-elder-impresence',
          'one_of',
          'Split Impresence variants from estimated total 10% drop rate; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-uber-elder-impresence-fire',
          'uber-uber-elder',
          'impresence-fire',
          0.02,
          'uber-uber-elder-impresence',
          'one_of',
          'Split Impresence variants from estimated total 10% drop rate; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-uber-elder-orb-dominance',
          'uber-uber-elder',
          'orb-dominance',
          0.05,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-uber-elder-shapers-exalted-orb',
          'uber-uber-elder',
          'shapers-exalted-orb',
          0.15,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-uber-elder-soul-ascension',
          'uber-uber-elder',
          'soul-ascension',
          0.1,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-uber-elder-sublime-vision',
          'uber-uber-elder',
          'sublime-vision',
          0.01,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-uber-elder-the-devourer-of-minds',
          'uber-uber-elder',
          'the-devourer-of-minds',
          0.3,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-uber-elder-the-eternity-shroud',
          'uber-uber-elder',
          'the-eternity-shroud',
          0.06,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-uber-elder-void-of-the-elements',
          'uber-uber-elder',
          'void-of-the-elements',
          0.01,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-uber-elder-voidforge',
          'uber-uber-elder',
          'voidforge',
          0.04,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
INSERT INTO boss_drops (
          id, boss_id, item_id, drop_rate, drop_group_id, drop_group_type, notes, created_at, updated_at
        ) VALUES (
          'curated-drop-uber-uber-elder-watchers-eye-unidentified-ilvl-86-plus',
          'uber-uber-elder',
          'watchers-eye-unidentified-ilvl-86-plus',
          0.3,
          NULL,
          NULL,
          'Estimated drop rate from PoE Wiki; source=https://www.poewiki.net/wiki/The_Elder_(The_Shaper%27s_Realm)',
          1782925058841,
          1782925058841
        );
