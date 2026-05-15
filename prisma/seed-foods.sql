-- =============================================================
-- Nutri-Guide: Seed Data for Foods Table
-- Format ID: FOOD-001, FOOD-002, ...
-- All image URLs are unique and representative of each food
-- =============================================================

-- Clear existing data
DELETE FROM rec_foods;
DELETE FROM food_history;
DELETE FROM recipes;
DELETE FROM foods;

INSERT INTO foods (food_id, name, calories, protein_g, carbs_g, fat_g, price_estimate, category, source, image_url) VALUES

-- ═══════════════════════════════════════
-- HIGH PROTEIN (FOOD-001 to FOOD-006)
-- ═══════════════════════════════════════
('FOOD-001', 'Grilled Chicken Breast',        165, 31.0,  0.0,  3.6, 25000, 'High Protein', 'USDA',   'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400'),
('FOOD-002', 'Pan-Seared Salmon',              208, 20.0,  0.0, 13.0, 45000, 'High Protein', 'USDA',   'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400'),
('FOOD-003', 'Beef Stir-Fry',                  250, 26.0, 10.0, 12.0, 35000, 'High Protein', 'USDA',   'https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?w=400'),
('FOOD-004', 'Grilled Chicken Salad',          380, 35.0, 15.0, 18.0, 30000, 'High Protein', 'Custom', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'),
('FOOD-005', 'Tuna Poke Bowl',                 320, 28.0, 30.0,  8.0, 40000, 'High Protein', 'Custom', 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=400'),
('FOOD-006', 'Egg White Omelette',             120, 20.0,  2.0,  3.0, 15000, 'High Protein', 'Custom', 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400'),

-- ═══════════════════════════════════════
-- VEGETARIAN (FOOD-007 to FOOD-012)
-- ═══════════════════════════════════════
('FOOD-007', 'Quinoa Buddha Bowl',             425, 14.0, 55.0, 16.0, 28000, 'Vegetarian', 'Custom', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'),
('FOOD-008', 'Greek Yogurt Parfait',           220, 15.0, 30.0,  5.0, 18000, 'Vegetarian', 'Custom', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'),
('FOOD-009', 'Avocado Toast with Eggs',        340, 14.0, 28.0, 20.0, 22000, 'Vegetarian', 'Custom', 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400'),
('FOOD-010', 'Vegetable Stir-Fry',             180,  8.0, 22.0,  7.0, 15000, 'Vegetarian', 'Custom', 'https://images.unsplash.com/photo-1543339308-d595c3a8384f?w=400'),
('FOOD-011', 'Mushroom Risotto',               350, 10.0, 50.0, 12.0, 25000, 'Vegetarian', 'Custom', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400'),
('FOOD-012', 'Caprese Salad',                  200, 10.0,  8.0, 14.0, 20000, 'Vegetarian', 'Custom', 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400'),

-- ═══════════════════════════════════════
-- LOW CARB (FOOD-013 to FOOD-016)
-- ═══════════════════════════════════════
('FOOD-013', 'Salmon with Vegetables',         510, 34.0, 12.0, 35.0, 50000, 'Low Carb', 'Custom', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400'),
('FOOD-014', 'Chicken Caesar Wrap (Lettuce)',   280, 30.0,  5.0, 15.0, 25000, 'Low Carb', 'Custom', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400'),
('FOOD-015', 'Zucchini Noodles with Pesto',    220,  8.0, 10.0, 16.0, 22000, 'Low Carb', 'Custom', 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=400'),
('FOOD-016', 'Grilled Shrimp Skewers',         150, 25.0,  3.0,  4.0, 35000, 'Low Carb', 'Custom', 'https://images.unsplash.com/photo-1565680018093-ebb6b9c8348b?w=400'),

-- ═══════════════════════════════════════
-- BUDGET FRIENDLY (FOOD-017 to FOOD-022)
-- ═══════════════════════════════════════
('FOOD-017', 'Nasi Goreng',                    350, 10.0, 50.0, 12.0, 12000, 'Budget Friendly', 'Local', 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400'),
('FOOD-018', 'Mie Ayam',                       400, 15.0, 55.0, 12.0, 10000, 'Budget Friendly', 'Local', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400'),
('FOOD-019', 'Tempe Goreng',                   190, 12.0, 10.0, 12.0,  5000, 'Budget Friendly', 'Local', 'https://images.unsplash.com/photo-1615485737651-5765cbb46be0?w=400'),
('FOOD-020', 'Tahu Telur',                     250, 14.0, 15.0, 15.0,  8000, 'Budget Friendly', 'Local', 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=400'),
('FOOD-021', 'Sayur Sop',                      120,  5.0, 15.0,  3.0,  7000, 'Budget Friendly', 'Local', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400'),
('FOOD-022', 'Gado-Gado',                      280, 10.0, 25.0, 16.0, 12000, 'Budget Friendly', 'Local', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400'),

-- ═══════════════════════════════════════
-- LOW SUGAR (FOOD-023 to FOOD-025)
-- ═══════════════════════════════════════
('FOOD-023', 'Steamed Broccoli with Garlic',    80,  5.0, 12.0,  1.5, 10000, 'Low Sugar', 'Custom', 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400'),
('FOOD-024', 'Grilled Turkey Burger (No Bun)',  200, 25.0,  3.0, 10.0, 28000, 'Low Sugar', 'Custom', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'),
('FOOD-025', 'Cucumber Tuna Bites',             140, 18.0,  4.0,  5.0, 20000, 'Low Sugar', 'Custom', 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400'),

-- ═══════════════════════════════════════
-- GLUTEN FREE (FOOD-026 to FOOD-030)
-- ═══════════════════════════════════════
('FOOD-026', 'Chicken Coconut Curry',           380, 28.0, 15.0, 22.0, 30000, 'Gluten Free', 'Custom', 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400'),
('FOOD-027', 'Sweet Potato Bowl',               300,  8.0, 45.0, 10.0, 18000, 'Gluten Free', 'Custom', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400'),
('FOOD-028', 'Rice Paper Rolls',                180, 10.0, 25.0,  4.0, 15000, 'Gluten Free', 'Custom', 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400'),
('FOOD-029', 'Grilled Fish Tacos (Corn)',       290, 22.0, 30.0, 10.0, 28000, 'Gluten Free', 'Custom', 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400'),
('FOOD-030', 'Banana Smoothie Bowl',            260,  6.0, 45.0,  8.0, 16000, 'Gluten Free', 'Custom', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400');
