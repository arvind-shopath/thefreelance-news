-- ==============================================================================
-- THE FREELANCE (TFL) - INITIAL SEED DATA FOR SUPABASE
-- Categories, Homepage Sections, Default Ad Slots
-- ==============================================================================

-- 1. Insert Standard Categories
INSERT INTO public."Category" ("id", "name", "slug", "color", "order", "isVisible")
VALUES
    (uuid_generate_v4(), 'देश', 'national', 'bg-red-600', 1, true),
    (uuid_generate_v4(), 'राज्य', 'states', 'bg-amber-500', 2, true),
    (uuid_generate_v4(), 'दुनिया', 'world', 'bg-blue-600', 3, true),
    (uuid_generate_v4(), 'राजनीति', 'politics', 'bg-rose-600', 4, true),
    (uuid_generate_v4(), 'कारोबार', 'business', 'bg-emerald-600', 5, true),
    (uuid_generate_v4(), 'खेल', 'sports', 'bg-orange-600', 6, true),
    (uuid_generate_v4(), 'मनोरंजन', 'entertainment', 'bg-pink-600', 7, true),
    (uuid_generate_v4(), 'टेक-ऑटो', 'tech-auto', 'bg-cyan-600', 8, true),
    (uuid_generate_v4(), 'लाइफस्टाइल', 'lifestyle', 'bg-teal-600', 9, true),
    (uuid_generate_v4(), 'धर्म', 'religion', 'bg-yellow-600', 10, true),
    (uuid_generate_v4(), 'शिक्षा', 'education', 'bg-indigo-600', 11, true),
    (uuid_generate_v4(), 'क्राइम', 'crime', 'bg-red-700', 12, true),
    (uuid_generate_v4(), 'नौकरी', 'jobs', 'bg-purple-600', 13, true),
    (uuid_generate_v4(), 'अंतर्राष्ट्रीय', 'international', 'bg-blue-700', 14, true)
ON CONFLICT ("slug") DO UPDATE SET
    "name" = EXCLUDED."name",
    "color" = EXCLUDED."color",
    "order" = EXCLUDED."order",
    "isVisible" = EXCLUDED."isVisible";

-- 2. Insert Standard Homepage Layout Sections
INSERT INTO public."HomepageSection" ("id", "order", "sectionType", "title", "categorySlug", "limit", "isActive")
VALUES
    (uuid_generate_v4(), 1, 'main-section', 'मुख्य समाचार', 'national', 10, true),
    (uuid_generate_v4(), 2, 'topic-based', 'आज का बड़ा मुद्दा', 'business', 8, true),
    (uuid_generate_v4(), 3, 'visual-stories', 'विजुअल स्टोरीज़', 'web-stories', 10, true),
    (uuid_generate_v4(), 4, 'category-grid', 'देश समाचार', 'national', 5, true),
    (uuid_generate_v4(), 5, 'category-grid', 'राज्य समाचार', 'states', 8, true),
    (uuid_generate_v4(), 6, 'category-grid', 'राजनीति हलचल', 'politics', 5, true),
    (uuid_generate_v4(), 7, 'sports-section', 'खेल जगत', 'sports', 6, true),
    (uuid_generate_v4(), 8, 'religion-section', 'धर्म व राशिफल', 'religion', 3, true),
    (uuid_generate_v4(), 9, 'photo-gallery', 'फोटो गैलरी', 'gallery', 3, true),
    (uuid_generate_v4(), 10, 'education-section', 'शिक्षा एवं रोजगार', 'jobs', 6, true)
ON CONFLICT ("order") DO UPDATE SET
    "sectionType" = EXCLUDED."sectionType",
    "title" = EXCLUDED."title",
    "categorySlug" = EXCLUDED."categorySlug",
    "limit" = EXCLUDED."limit",
    "isActive" = EXCLUDED."isActive";

-- 3. Insert Standard Ad Slots (Adsterra / Partner Network)
INSERT INTO public."AdPlacement" ("id", "slotName", "isActive")
VALUES
    (uuid_generate_v4(), 'top-banner', true),
    (uuid_generate_v4(), 'in-feed', true),
    (uuid_generate_v4(), 'in-article', true),
    (uuid_generate_v4(), 'sidebar-rect', true),
    (uuid_generate_v4(), 'mobile-sticky', true)
ON CONFLICT ("slotName") DO NOTHING;
