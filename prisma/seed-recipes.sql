-- =============================================================
-- Nutri-Guide: Seed Data for Recipes Table
-- Format ID: RCPE-001, RCPE-002, ...
-- ingredients & steps stored as JSON arrays
-- =============================================================

DELETE FROM recipes;

INSERT INTO recipes (recipe_id, food_id, prep_time_min, ingredients, steps) VALUES

-- ═══════════════════════════════════════
-- HIGH PROTEIN
-- ═══════════════════════════════════════

-- FOOD-001: Grilled Chicken Breast
('RCPE-001', 'FOOD-001', 20,
 '["200g dada ayam fillet", "1 sdm minyak zaitun", "1 sdt lada hitam", "1/2 sdt garam", "1 siung bawang putih cincang", "Perasan 1/2 jeruk nipis"]',
 '["Cuci bersih dada ayam, keringkan dengan tisu dapur.", "Lumuri ayam dengan minyak zaitun, bawang putih, garam, dan lada hitam secara merata.", "Panaskan grill pan atau teflon dengan api sedang-tinggi.", "Panggang ayam 6-7 menit per sisi hingga matang sempurna dan ada garis panggang.", "Angkat, diamkan 3 menit, beri perasan jeruk nipis, lalu iris dan sajikan."]'),

-- FOOD-002: Pan-Seared Salmon
('RCPE-002', 'FOOD-002', 15,
 '["200g fillet salmon (dengan kulit)", "1 sdm mentega", "Garam dan lada secukupnya", "2 siung bawang putih geprek", "1 tangkai rosemary segar", "Perasan lemon"]',
 '["Keringkan permukaan salmon dengan tisu dapur, taburi garam dan lada di kedua sisi.", "Panaskan teflon anti lengket dengan api sedang-tinggi, tambahkan mentega.", "Letakkan salmon dengan sisi kulit menghadap bawah, masak 4 menit tanpa digeser.", "Balik salmon, tambahkan bawang putih dan rosemary ke teflon, masak 3 menit lagi.", "Angkat salmon, siram dengan mentega dari teflon, beri perasan lemon."]'),

-- FOOD-003: Beef Stir-Fry
('RCPE-003', 'FOOD-003', 20,
 '["200g daging sapi iris tipis", "1 sdm kecap asin", "1 sdm saus tiram", "1 sdm minyak wijen", "1 buah paprika iris", "100g brokoli kecil-kecil", "2 siung bawang putih cincang", "1 sdm minyak goreng"]',
 '["Marinasi daging sapi dengan kecap asin dan minyak wijen selama 10 menit.", "Panaskan minyak goreng di wajan dengan api besar.", "Tumis bawang putih hingga harum (30 detik).", "Masukkan daging sapi, aduk cepat hingga berubah warna (2 menit).", "Tambahkan paprika dan brokoli, aduk rata, masak 3 menit.", "Tuang saus tiram, aduk rata, angkat dan sajikan segera."]'),

-- FOOD-004: Grilled Chicken Salad
('RCPE-004', 'FOOD-004', 25,
 '["200g dada ayam panggang (iris)", "100g selada romaine", "50g tomat ceri belah dua", "30g keju parmesan serut", "1/4 buah alpukat iris", "2 sdm dressing Caesar", "Crouton secukupnya"]',
 '["Panggang dada ayam dengan garam dan lada hingga matang, iris tipis.", "Cuci bersih selada romaine, sobek-sobek ke dalam mangkuk besar.", "Tambahkan tomat ceri, alpukat, dan keju parmesan.", "Tata irisan ayam panggang di atas salad.", "Siram dengan dressing Caesar, taburi crouton, dan sajikan segera."]'),

-- FOOD-005: Tuna Poke Bowl
('RCPE-005', 'FOOD-005', 15,
 '["150g tuna segar (sashimi grade) potong dadu", "150g nasi putih hangat", "1/2 buah alpukat iris", "50g edamame rebus", "1 sdm kecap asin", "1 sdt minyak wijen", "1 sdt biji wijen", "Nori iris tipis"]',
 '["Potong tuna segar menjadi dadu 2 cm, marinasi dengan kecap asin dan minyak wijen.", "Siapkan mangkuk, letakkan nasi putih hangat sebagai dasar.", "Tata tuna yang sudah dimarinasi, alpukat, dan edamame di atas nasi.", "Taburi dengan biji wijen dan irisan nori.", "Sajikan segera selagi tuna masih segar."]'),

-- FOOD-006: Egg White Omelette
('RCPE-006', 'FOOD-006', 10,
 '["4 butir putih telur", "30g bayam segar", "20g paprika merah potong dadu", "20g jamur champignon iris", "Garam dan lada secukupnya", "1 sdt minyak zaitun"]',
 '["Kocok putih telur dengan garam dan lada hingga sedikit berbusa.", "Panaskan minyak zaitun di teflon anti lengket dengan api sedang.", "Tumis jamur dan paprika 2 menit, tambahkan bayam, aduk sebentar, angkat dan sisihkan.", "Tuang putih telur ke teflon, masak tanpa diaduk hingga bagian bawah set (2 menit).", "Letakkan isian tumisan di satu sisi, lipat omelette, masak 1 menit lagi, sajikan."]'),

-- ═══════════════════════════════════════
-- VEGETARIAN
-- ═══════════════════════════════════════

-- FOOD-007: Quinoa Buddha Bowl
('RCPE-007', 'FOOD-007', 30,
 '["100g quinoa (dimasak)", "100g ubi jalar panggang potong dadu", "50g kale segar", "50g chickpea kalengan (tiriskan)", "1/4 buah alpukat iris", "2 sdm tahini dressing", "1 sdm biji bunga matahari"]',
 '["Masak quinoa sesuai petunjuk kemasan, sisihkan.", "Panggang ubi jalar yang sudah dipotong dadu di oven 200°C selama 20 menit.", "Pijat kale dengan sedikit minyak zaitun dan garam agar lebih lembut.", "Susun quinoa, ubi panggang, kale, chickpea, dan alpukat di mangkuk.", "Siram dengan tahini dressing, taburi biji bunga matahari."]'),

-- FOOD-008: Greek Yogurt Parfait
('RCPE-008', 'FOOD-008', 5,
 '["200g Greek yogurt plain", "50g granola", "Madu secukupnya", "50g campuran buah berry (strawberry, blueberry)", "1 sdm biji chia"]',
 '["Siapkan gelas atau mangkuk kecil.", "Tuang separuh Greek yogurt sebagai lapisan pertama.", "Tambahkan separuh granola dan buah berry.", "Tuang sisa yogurt, lalu tambahkan sisa granola dan berry di atasnya.", "Teteskan madu dan taburi biji chia, sajikan segera."]'),

-- FOOD-009: Avocado Toast with Eggs
('RCPE-009', 'FOOD-009', 10,
 '["2 lembar roti sourdough", "1 buah alpukat matang", "2 butir telur", "Garam laut dan lada hitam", "Cabai bubuk (chili flakes) secukupnya", "Perasan jeruk nipis"]',
 '["Panggang roti sourdough hingga kecoklatan dan renyah.", "Hancurkan alpukat dengan garpu, beri garam, lada, dan perasan jeruk nipis.", "Goreng atau poach telur sesuai selera (setengah matang disarankan).", "Oleskan alpukat hancur di atas roti panggang secara merata.", "Letakkan telur di atas, taburi chili flakes dan garam laut."]'),

-- FOOD-010: Vegetable Stir-Fry
('RCPE-010', 'FOOD-010', 15,
 '["100g brokoli potong kecil", "1 buah wortel iris serong", "100g jamur champignon iris", "1 buah paprika merah iris", "2 siung bawang putih cincang", "2 sdm kecap asin", "1 sdm saus tiram", "1 sdm minyak goreng"]',
 '["Siapkan semua sayuran, potong sesuai ukuran yang sama agar matang merata.", "Panaskan minyak di wajan dengan api besar.", "Tumis bawang putih hingga harum (30 detik).", "Masukkan wortel dan brokoli terlebih dahulu (sayuran keras), masak 2 menit.", "Tambahkan paprika dan jamur, aduk 2 menit lagi.", "Tuang kecap asin dan saus tiram, aduk rata, angkat dan sajikan."]'),

-- FOOD-011: Mushroom Risotto
('RCPE-011', 'FOOD-011', 35,
 '["200g beras arborio", "200g campuran jamur iris (shiitake, champignon)", "1 buah bawang bombay cincang", "2 siung bawang putih cincang", "500ml kaldu sayur hangat", "50ml white wine (opsional)", "30g keju parmesan parut", "2 sdm mentega"]',
 '["Panaskan 1 sdm mentega, tumis bawang bombay dan bawang putih hingga layu.", "Tambahkan jamur, masak hingga kecoklatan (5 menit).", "Masukkan beras arborio, aduk 1 menit hingga terasa panas.", "Tuang white wine (jika pakai), aduk hingga terserap.", "Tambahkan kaldu sedikit demi sedikit (1 sendok sayur) sambil terus diaduk, tunggu terserap sebelum menambah lagi (~20 menit).", "Setelah nasi creamy, angkat dari api, aduk masuk mentega dan parmesan."]'),

-- FOOD-012: Caprese Salad
('RCPE-012', 'FOOD-012', 5,
 '["200g tomat segar iris", "150g mozzarella segar iris", "Daun basil segar secukupnya", "2 sdm minyak zaitun extra virgin", "1 sdm balsamic glaze", "Garam laut dan lada hitam"]',
 '["Iris tomat dan mozzarella dengan ketebalan yang sama (~0.5 cm).", "Tata selang-seling di piring: tomat, mozzarella, daun basil.", "Taburi garam laut dan lada hitam secukupnya.", "Siram dengan minyak zaitun extra virgin.", "Teteskan balsamic glaze di atasnya, sajikan segera dalam suhu ruang."]'),

-- ═══════════════════════════════════════
-- LOW CARB
-- ═══════════════════════════════════════

-- FOOD-013: Salmon with Vegetables
('RCPE-013', 'FOOD-013', 25,
 '["200g fillet salmon", "100g asparagus", "100g brokoli", "1 buah zucchini iris", "2 sdm minyak zaitun", "2 siung bawang putih cincang", "Garam, lada, dan lemon"]',
 '["Panaskan oven hingga 200°C.", "Letakkan salmon dan sayuran di loyang, taburi minyak zaitun, bawang putih, garam, dan lada.", "Panggang di oven selama 18-20 menit hingga salmon matang.", "Peras lemon di atas salmon setelah diangkat.", "Tata di piring dan sajikan hangat."]'),

-- FOOD-014: Chicken Caesar Wrap (Lettuce)
('RCPE-014', 'FOOD-014', 10,
 '["200g dada ayam panggang iris", "4 lembar daun selada romaine besar", "30g keju parmesan serut", "2 sdm Caesar dressing", "Crouton secukupnya (opsional)"]',
 '["Panggang atau rebus dada ayam hingga matang, iris tipis.", "Cuci bersih dan keringkan daun selada romaine.", "Letakkan irisan ayam di tengah daun selada.", "Taburi keju parmesan dan crouton.", "Siram dengan Caesar dressing, gulung selada, dan sajikan."]'),

-- FOOD-015: Zucchini Noodles with Pesto
('RCPE-015', 'FOOD-015', 15,
 '["2 buah zucchini sedang", "3 sdm saus pesto basil", "30g keju parmesan parut", "10g pine nuts (kacang pinus)", "Garam dan lada secukupnya", "1 sdm minyak zaitun"]',
 '["Buat zucchini menjadi bentuk mie menggunakan spiralizer atau peeler.", "Panaskan minyak zaitun di teflon dengan api sedang.", "Masukkan zucchini noodles, masak 2-3 menit (jangan terlalu lama agar tidak lembek).", "Angkat dari api, campurkan saus pesto dan aduk rata.", "Sajikan dengan taburan parmesan dan pine nuts."]'),

-- FOOD-016: Grilled Shrimp Skewers
('RCPE-016', 'FOOD-016', 15,
 '["250g udang ukuran besar (kupas, sisakan ekor)", "2 sdm minyak zaitun", "2 siung bawang putih cincang", "1 sdm perasan lemon", "1/2 sdt paprika bubuk", "Garam dan lada secukupnya", "Tusuk sate kayu (rendam air 30 menit)"]',
 '["Marinasi udang dengan minyak zaitun, bawang putih, lemon, paprika, garam, dan lada selama 15 menit.", "Tusuk udang ke tusuk sate (4-5 udang per tusuk).", "Panaskan grill pan dengan api sedang-tinggi.", "Panggang udang 2-3 menit per sisi hingga berwarna pink dan sedikit hangus.", "Angkat, beri perasan lemon tambahan, sajikan segera."]'),

-- ═══════════════════════════════════════
-- BUDGET FRIENDLY
-- ═══════════════════════════════════════

-- FOOD-017: Nasi Goreng
('RCPE-017', 'FOOD-017', 15,
 '["300g nasi putih dingin (sisa semalam)", "2 butir telur", "2 siung bawang putih cincang", "3 buah bawang merah iris", "2 sdm kecap manis", "1 sdm kecap asin", "Cabai rawit sesuai selera", "2 sdm minyak goreng", "Acar mentimun dan kerupuk untuk pelengkap"]',
 '["Panaskan minyak, tumis bawang merah dan bawang putih hingga harum.", "Geser tumisan ke pinggir wajan, orak-arik telur di tengah.", "Masukkan nasi dingin, aduk rata dengan api besar.", "Tambahkan kecap manis, kecap asin, dan cabai, aduk hingga merata dan nasi sedikit kecoklatan.", "Sajikan dengan acar mentimun dan kerupuk."]'),

-- FOOD-018: Mie Ayam
('RCPE-018', 'FOOD-018', 20,
 '["200g mie telur (rebus, tiriskan)", "150g dada ayam rebus suwir", "2 sdm kecap asin", "1 sdm minyak wijen", "2 siung bawang putih cincang goreng", "Sawi hijau rebus", "Daun bawang iris", "Kaldu ayam untuk kuah"]',
 '["Rebus mie telur hingga al dente, tiriskan.", "Campur mie dengan kecap asin dan minyak wijen di mangkuk.", "Rebus dada ayam, suwir-suwir, tumis sebentar dengan bawang putih.", "Tata mie di mangkuk, tambahkan ayam suwir dan sawi rebus.", "Siram kaldu ayam panas di samping (terpisah), taburi bawang goreng dan daun bawang."]'),

-- FOOD-019: Tempe Goreng
('RCPE-019', 'FOOD-019', 15,
 '["200g tempe potong korek api atau segitiga", "3 siung bawang putih haluskan", "1 sdt ketumbar bubuk", "1/2 sdt kunyit bubuk", "Garam secukupnya", "Air secukupnya untuk melarutkan bumbu", "Minyak goreng secukupnya"]',
 '["Haluskan bawang putih, campurkan dengan ketumbar, kunyit, garam, dan sedikit air.", "Rendam potongan tempe dalam bumbu selama 10 menit.", "Panaskan minyak goreng (cukup banyak untuk menggoreng) dengan api sedang.", "Goreng tempe hingga kecoklatan dan renyah di kedua sisi (3-4 menit).", "Angkat, tiriskan di atas tisu dapur, sajikan dengan sambal."]'),

-- FOOD-020: Tahu Telur
('RCPE-020', 'FOOD-020', 15,
 '["200g tahu putih potong dadu kecil", "3 butir telur kocok", "2 siung bawang putih cincang", "1 batang daun bawang iris", "Garam dan lada secukupnya", "Minyak goreng secukupnya", "Saus kacang atau kecap manis untuk pelengkap"]',
 '["Goreng tahu yang sudah dipotong dadu hingga kecoklatan, angkat dan tiriskan.", "Kocok telur bersama bawang putih, daun bawang, garam, dan lada.", "Masukkan tahu goreng ke dalam kocokan telur, aduk rata.", "Panaskan sedikit minyak di teflon, tuang campuran tahu-telur.", "Masak dengan api kecil hingga kedua sisi matang kecoklatan, sajikan dengan saus kacang."]'),

-- FOOD-021: Sayur Sop
('RCPE-021', 'FOOD-021', 20,
 '["1 buah wortel potong dadu", "100g kentang potong dadu", "100g kol iris kasar", "50g buncis potong 3 cm", "1 batang daun bawang iris", "2 siung bawang putih geprek", "3 butir bawang merah iris", "1 liter air atau kaldu ayam", "Garam, merica, dan pala secukupnya"]',
 '["Didihkan air atau kaldu ayam dalam panci.", "Tumis bawang merah dan bawang putih hingga harum, masukkan ke panci.", "Masukkan kentang dan wortel terlebih dahulu, masak 10 menit.", "Tambahkan buncis dan kol, masak 5 menit lagi.", "Bumbui dengan garam, merica, dan pala. Taburi daun bawang, sajikan hangat."]'),

-- FOOD-022: Gado-Gado
('RCPE-022', 'FOOD-022', 20,
 '["100g kacang panjang rebus potong 3 cm", "100g tauge rebus", "100g kangkung rebus", "1 buah mentimun iris", "100g tahu goreng potong", "100g tempe goreng potong", "2 butir telur rebus belah dua", "Lontong atau nasi secukupnya", "Bumbu kacang: 100g kacang tanah goreng, 3 siung bawang putih, cabai, gula merah, air asam, garam"]',
 '["Rebus semua sayuran (kacang panjang, tauge, kangkung) secara terpisah, tiriskan.", "Goreng tahu dan tempe hingga kecoklatan, potong-potong.", "Buat bumbu kacang: haluskan kacang tanah goreng, bawang putih, cabai, gula merah, dan garam. Encerkan dengan air asam.", "Tata semua sayuran, tahu, tempe, telur, dan mentimun di piring.", "Siram dengan bumbu kacang, sajikan dengan lontong dan kerupuk."]'),

-- ═══════════════════════════════════════
-- LOW SUGAR
-- ═══════════════════════════════════════

-- FOOD-023: Steamed Broccoli with Garlic
('RCPE-023', 'FOOD-023', 10,
 '["300g brokoli potong per kuntum", "3 siung bawang putih iris tipis", "1 sdm minyak zaitun", "1/2 sdt garam", "Lada hitam secukupnya", "Perasan lemon"]',
 '["Kukus brokoli selama 4-5 menit hingga empuk tapi masih renyah (al dente).", "Panaskan minyak zaitun di teflon, tumis bawang putih hingga keemasan.", "Masukkan brokoli kukus, aduk rata dengan bawang putih.", "Taburi garam dan lada hitam.", "Beri perasan lemon, sajikan sebagai side dish."]'),

-- FOOD-024: Grilled Turkey Burger (No Bun)
('RCPE-024', 'FOOD-024', 15,
 '["200g daging kalkun giling", "1 sdt bawang putih bubuk", "1 sdt bawang bombay bubuk", "Garam dan lada secukupnya", "Daun selada untuk alas", "Irisan tomat dan bawang bombay untuk topping", "1 sdm mustard atau saus favorit"]',
 '["Campurkan daging kalkun giling dengan bawang putih bubuk, bawang bombay bubuk, garam, dan lada.", "Bentuk menjadi patty bulat pipih (tebal ~1.5 cm).", "Panaskan grill pan dengan api sedang-tinggi.", "Panggang patty 4-5 menit per sisi hingga matang sempurna.", "Sajikan di atas daun selada dengan topping tomat, bawang, dan saus."]'),

-- FOOD-025: Cucumber Tuna Bites
('RCPE-025', 'FOOD-025', 10,
 '["1 kaleng tuna (dalam air, tiriskan)", "1 buah mentimun besar iris tebal 2 cm", "2 sdm Greek yogurt atau mayones", "1 sdt perasan lemon", "1 batang seledri cincang halus", "Garam dan lada secukupnya", "Paprika bubuk untuk garnish"]',
 '["Tiriskan tuna kaleng, pindahkan ke mangkuk.", "Campurkan tuna dengan Greek yogurt, perasan lemon, seledri, garam, dan lada.", "Iris mentimun menjadi potongan tebal (~2 cm).", "Sendokkan campuran tuna di atas setiap irisan mentimun.", "Taburi paprika bubuk sebagai garnish, sajikan dingin."]'),

-- ═══════════════════════════════════════
-- GLUTEN FREE
-- ═══════════════════════════════════════

-- FOOD-026: Chicken Coconut Curry
('RCPE-026', 'FOOD-026', 25,
 '["250g dada ayam potong dadu", "200ml santan kental", "2 sdm pasta kari kuning", "1 buah kentang potong dadu", "1 buah tomat potong", "Daun salam dan serai", "Garam dan gula secukupnya", "1 sdm minyak goreng"]',
 '["Panaskan minyak, tumis pasta kari, daun salam, dan serai hingga harum.", "Masukkan potongan ayam, aduk hingga berubah warna.", "Tuang santan, tambahkan kentang dan tomat.", "Masak dengan api kecil selama 15-20 menit hingga kentang empuk dan kuah mengental.", "Bumbui dengan garam dan gula, sajikan dengan nasi putih hangat."]'),

-- FOOD-027: Sweet Potato Bowl
('RCPE-027', 'FOOD-027', 25,
 '["1 buah ubi jalar besar (panggang/kukus)", "100g black beans kalengan (tiriskan)", "1/4 buah alpukat iris", "50g jagung manis", "2 sdm salsa atau saus tomat", "Daun ketumbar segar", "Perasan jeruk nipis"]',
 '["Panggang ubi jalar di oven 200°C selama 20-25 menit atau kukus hingga empuk.", "Belah ubi jalar di tengah, tekan sedikit untuk membuka.", "Isi dengan black beans, jagung manis, dan irisan alpukat.", "Tuang salsa di atasnya.", "Taburi daun ketumbar dan beri perasan jeruk nipis."]'),

-- FOOD-028: Rice Paper Rolls
('RCPE-028', 'FOOD-028', 20,
 '["8 lembar rice paper (kulit lumpia Vietnam)", "100g bihun beras (rebus, tiriskan)", "100g udang rebus belah dua", "1 buah wortel iris julienne", "1/2 buah mentimun iris julienne", "Daun selada dan mint segar", "Saus cocol: hoisin sauce + kacang tanah cincang"]',
 '["Rebus bihun dan udang secara terpisah, tiriskan dan dinginkan.", "Siapkan mangkuk berisi air hangat untuk merendam rice paper.", "Rendam 1 lembar rice paper 5-10 detik hingga lentur (jangan terlalu lama).", "Letakkan di atas talenan, tata selada, bihun, sayuran, mint, dan udang di sepertiga bawah.", "Lipat sisi kiri-kanan ke dalam, lalu gulung dari bawah ke atas dengan rapat. Ulangi untuk sisa bahan."]'),

-- FOOD-029: Grilled Fish Tacos (Corn)
('RCPE-029', 'FOOD-029', 20,
 '["200g fillet ikan putih (dory/kakap)", "4 lembar tortilla jagung kecil", "100g kol ungu iris tipis", "1/4 buah alpukat iris", "2 sdm sour cream atau Greek yogurt", "Perasan jeruk nipis", "1 sdt bubuk cabai (chili powder)", "Garam dan lada"]',
 '["Bumbi ikan dengan chili powder, garam, lada, dan perasan jeruk nipis.", "Panggang ikan di grill pan 3-4 menit per sisi hingga matang.", "Hangatkan tortilla jagung di teflon kering (30 detik per sisi).", "Hancurkan ikan menjadi potongan besar dengan garpu.", "Isi tortilla dengan ikan, kol ungu, alpukat, sour cream, dan perasan jeruk nipis."]'),

-- FOOD-030: Banana Smoothie Bowl
('RCPE-030', 'FOOD-030', 10,
 '["2 buah pisang beku (potong sebelum dibekukan)", "100ml susu almond atau susu biasa", "1 sdm selai kacang (peanut butter)", "Topping: granola, irisan pisang, biji chia, madu, irisan strawberry"]',
 '["Masukkan pisang beku, susu, dan selai kacang ke dalam blender.", "Blender hingga halus dan kental (konsistensi seperti es krim lembut). Jangan terlalu cair.", "Tuang ke mangkuk.", "Tata topping di atasnya: granola, irisan pisang, strawberry, biji chia.", "Teteskan madu, sajikan segera sebelum mencair."]');
