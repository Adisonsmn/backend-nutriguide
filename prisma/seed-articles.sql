-- =============================================================
-- Nutri-Guide: Seed Data for Articles Table
-- Format ID: ARTC-001, ARTC-002, ...
-- Categories: Nutrition, Exercise, Habits, Recipes, Wellness
-- =============================================================

DELETE FROM articles;

INSERT INTO articles (article_id, title, content, category, image_url, published_at) VALUES


-- ═══════════════════════════════════════
-- NUTRITION (ARTC-001 to ARTC-004)
-- ═══════════════════════════════════════
('ARTC-001',
 'Understanding Macronutrients: Protein, Carbs, and Fat',
 'Macronutrients are the three main categories of nutrients that provide energy to your body. Protein is essential for building and repairing muscle tissue — aim for 0.8 to 1.2 grams per kilogram of body weight daily. Carbohydrates are your body''s primary fuel source, especially for high-intensity activities. Choose complex carbs like whole grains, oats, and sweet potatoes over refined sugars. Fats are crucial for hormone production and nutrient absorption — focus on healthy sources like avocados, nuts, olive oil, and fatty fish. A balanced diet typically consists of 30% protein, 40% carbohydrates, and 30% fats, though this ratio can be adjusted based on your specific fitness goals. Remember, no single macronutrient is "bad" — the key is finding the right balance for your body and lifestyle.',
 'Nutrition',
 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
 '2026-05-01T08:00:00Z'),

('ARTC-002',
 'The Importance of Hydration for Overall Health',
 'Water makes up about 60% of your body weight and is involved in virtually every bodily function. Proper hydration improves cognitive function, physical performance, digestion, and even skin health. The general recommendation is to drink at least 8 glasses (about 2 liters) of water per day, but your actual needs depend on factors like body size, activity level, climate, and diet. Signs of dehydration include dark urine, fatigue, headaches, and dry mouth. To stay hydrated, carry a reusable water bottle, eat water-rich foods like cucumbers, watermelon, and oranges, and drink a glass of water before each meal. Avoid excessive caffeine and alcohol, as they can have diuretic effects. If you exercise regularly, increase your intake by 500ml to 1 liter per hour of intense activity.',
 'Nutrition',
 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=400',
 '2026-05-02T09:00:00Z'),

('ARTC-003',
 'Meal Timing: Does It Really Matter When You Eat?',
 'The debate around meal timing has been ongoing in the nutrition world. While the total number of calories you consume matters most for weight management, research suggests that when you eat can influence energy levels, metabolism, and even sleep quality. Eating a protein-rich breakfast can help stabilize blood sugar and reduce cravings throughout the day. Having your largest meal at lunch aligns with your body''s natural circadian rhythm, when metabolism tends to be highest. Eating too close to bedtime (within 2-3 hours) may disrupt sleep quality and digestion. For athletes, nutrient timing around workouts — consuming protein and carbs within 30-60 minutes post-exercise — can enhance recovery and muscle growth. The bottom line: listen to your body, maintain consistent eating patterns, and focus on nutrient quality over strict timing rules.',
 'Nutrition',
 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
 '2026-05-03T10:00:00Z'),

('ARTC-004',
 'Micronutrients: The Hidden Heroes of Your Diet',
 'While macronutrients get most of the attention, micronutrients — vitamins and minerals — play equally critical roles in your health. Vitamin D supports bone health and immune function; most people are deficient, especially those living in tropical climates who spend most time indoors. Iron is essential for oxygen transport in the blood — good sources include red meat, spinach, and lentils. Vitamin C boosts immunity and enhances iron absorption — pair iron-rich foods with citrus fruits for maximum benefit. Zinc supports wound healing and immune function, found in nuts, seeds, and whole grains. Magnesium helps with muscle relaxation and sleep quality — try adding dark chocolate, almonds, or bananas to your diet. The best approach is to eat a diverse, colorful diet rather than relying solely on supplements.',
 'Nutrition',
 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
 '2026-05-04T08:30:00Z'),

-- ═══════════════════════════════════════
-- EXERCISE (ARTC-005 to ARTC-008)
-- ═══════════════════════════════════════
('ARTC-005',
 'Building a Sustainable Workout Routine for Beginners',
 'Starting a fitness journey can feel overwhelming, but the key is to begin with manageable goals and build consistency. Start with 3 days per week of 30-minute sessions combining both cardio and strength training. For cardio, walking, cycling, or swimming are excellent low-impact options. For strength training, focus on compound movements like squats, push-ups, lunges, and planks that work multiple muscle groups simultaneously. Rest days are just as important as training days — your muscles grow and repair during recovery. Track your progress weekly rather than daily to see meaningful changes. Common mistakes to avoid include doing too much too soon, skipping warm-ups, and neglecting stretching. Remember, the best workout plan is one you can stick to consistently. Even 15 minutes of movement is better than no movement at all.',
 'Exercise',
 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
 '2026-05-05T07:00:00Z'),

('ARTC-006',
 'The Science Behind HIIT: High-Intensity Interval Training',
 'High-Intensity Interval Training (HIIT) has become one of the most popular and time-efficient workout methods. HIIT alternates between short bursts of intense exercise (20-40 seconds) and brief recovery periods (10-30 seconds), typically lasting 15-30 minutes total. Research shows HIIT can burn up to 30% more calories than traditional steady-state cardio in the same time frame. It also creates an "afterburn effect" (EPOC) where your body continues to burn calories at an elevated rate for hours post-workout. A simple HIIT routine might include exercises like burpees, mountain climbers, jump squats, and high knees. However, HIIT is demanding on your body — limit sessions to 2-3 times per week and ensure adequate recovery between sessions. Beginners should start with longer rest intervals and gradually increase intensity over time.',
 'Exercise',
 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400',
 '2026-05-06T07:30:00Z'),

('ARTC-007',
 'Yoga for Flexibility and Mental Clarity',
 'Yoga is more than just stretching — it is a holistic practice that improves flexibility, strength, balance, and mental well-being. Regular yoga practice has been shown to reduce cortisol levels (the stress hormone), lower blood pressure, and improve sleep quality. For beginners, start with basic poses like Downward Dog, Warrior I and II, Tree Pose, and Child''s Pose. Hold each pose for 5-8 breaths, focusing on deep, controlled breathing. Consistency matters more than complexity — even 10-15 minutes of daily yoga can yield significant benefits within a few weeks. Yoga is also an excellent complement to more intense exercise routines, helping to prevent injuries by improving mobility and reducing muscle tension. Many free resources are available online for guided sessions tailored to all skill levels.',
 'Exercise',
 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
 '2026-05-07T08:00:00Z'),

('ARTC-008',
 'Walking: The Most Underrated Form of Exercise',
 'Walking is often overlooked as a legitimate form of exercise, but it is one of the most accessible and effective ways to improve your health. A brisk 30-minute walk daily can reduce the risk of heart disease by 30-40%, improve mood through endorphin release, aid digestion, and support weight management. For those aiming for weight loss, a 60-minute walk can burn 200-400 calories depending on pace and body weight. To make walks more effective, maintain a pace where you can talk but not sing comfortably, swing your arms naturally, and engage your core. Walking after meals has been shown to significantly improve blood sugar regulation. Try incorporating walking into your daily routine — walk to work, take the stairs, or have walking meetings. Aim for 7,000-10,000 steps per day as a general health target.',
 'Exercise',
 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400',
 '2026-05-08T06:30:00Z'),

-- ═══════════════════════════════════════
-- HABITS (ARTC-009 to ARTC-011)
-- ═══════════════════════════════════════
('ARTC-009',
 '5 Daily Habits That Transform Your Health',
 'Small, consistent habits can create dramatic improvements in your overall health. First, start each morning with a glass of warm lemon water to kickstart digestion and hydration. Second, practice the 80/20 eating rule — eat until you are 80% full rather than completely stuffed, which helps prevent overeating and improves digestion. Third, take a 10-minute walk after each meal to regulate blood sugar levels and aid digestion. Fourth, prioritize 7-8 hours of quality sleep by maintaining a consistent sleep schedule and avoiding screens 30 minutes before bed. Fifth, practice gratitude by writing down three things you are thankful for each evening — this simple habit has been shown to reduce stress, improve sleep, and boost overall happiness. Remember, it takes approximately 21 days to form a new habit and 66 days to make it automatic.',
 'Habits',
 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
 '2026-05-09T09:00:00Z'),

('ARTC-010',
 'How to Break Free from Emotional Eating',
 'Emotional eating is using food to cope with feelings rather than to satisfy physical hunger. Recognizing the difference between emotional and physical hunger is the first step. Physical hunger builds gradually and can be satisfied by any food, while emotional hunger is sudden, craves specific comfort foods, and often leads to guilt afterward. To combat emotional eating, practice the HALT method — before reaching for food, ask yourself: am I Hungry, Angry, Lonely, or Tired? If it is not true hunger, find alternative coping strategies like taking a walk, calling a friend, journaling, or practicing deep breathing. Keep a food-mood diary to identify patterns and triggers. Stock your kitchen with nutritious options so that even emotional eating episodes are less damaging. Seek professional support if emotional eating feels uncontrollable.',
 'Habits',
 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400',
 '2026-05-10T08:00:00Z'),

('ARTC-011',
 'The Power of Meal Prepping: Save Time and Eat Better',
 'Meal prepping is the practice of planning and preparing meals in advance, typically for the week ahead. This habit can save you 3-5 hours per week, reduce food waste, save money, and make healthy eating effortless even on busy days. Start simple: choose one day per week (Sunday works well) to prep. Pick 2-3 protein sources, 2-3 complex carbs, and plenty of vegetables. Cook in bulk and store in portioned containers. Invest in quality glass containers that are microwave-safe and leak-proof. Prep foods that store well: grilled chicken, roasted sweet potatoes, steamed rice, hard-boiled eggs, and washed salad greens. Keep pre-cut vegetables and fruits for quick snacks. Label containers with the date to ensure freshness. Most prepped meals last 4-5 days in the refrigerator. As you get comfortable, experiment with new recipes to keep your meals exciting.',
 'Habits',
 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400',
 '2026-05-11T10:00:00Z'),

-- ═══════════════════════════════════════
-- RECIPES (ARTC-012 to ARTC-014)
-- ═══════════════════════════════════════
('ARTC-012',
 'Quick and Healthy Breakfast Ideas Under 10 Minutes',
 'Mornings are often rushed, but skipping breakfast can lead to low energy, poor concentration, and overeating later in the day. Here are five fast, nutritious breakfast ideas. Overnight Oats: combine rolled oats, Greek yogurt, milk, chia seeds, and your favorite fruits in a jar the night before — grab and go in the morning. Smoothie Bowl: blend frozen bananas, berries, spinach, and protein powder, then top with granola and nuts. Avocado Toast: mash half an avocado on whole grain toast, add a fried or poached egg, and sprinkle with chili flakes and sea salt. Greek Yogurt Parfait: layer yogurt, honey, granola, and mixed berries for a protein-rich meal. Egg Muffins: beat eggs with vegetables and cheese, pour into muffin tins, and bake — reheat throughout the week. Each of these options provides a balanced mix of protein, healthy fats, and complex carbohydrates to fuel your morning.',
 'Recipes',
 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400',
 '2026-05-12T07:00:00Z'),

('ARTC-013',
 'Budget-Friendly Indonesian Meals for Students',
 'Eating healthy on a student budget is absolutely possible with Indonesian staple foods. Tempe and tahu are incredible protein sources that cost only Rp 3,000-5,000 per serving. Pair tempe goreng with nasi merah (brown rice) and sayur bayam for a complete, balanced meal under Rp 10,000. Gado-gado is another budget champion — packed with vegetables, tofu, tempeh, and peanut sauce, it provides protein, fiber, and healthy fats for under Rp 12,000. Bubur ayam (chicken porridge) makes an excellent recovery meal post-workout. For meal prep, cook large batches of nasi goreng with extra vegetables and eggs — portion into containers for the week. Sayur sop with extra vegetables and a protein source is an easy, nutrient-dense meal. Shop at local traditional markets (pasar) for the freshest produce at the best prices, and buy seasonal fruits and vegetables for maximum nutrition at minimum cost.',
 'Recipes',
 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400',
 '2026-05-13T08:00:00Z'),

('ARTC-014',
 'High-Protein Dinner Ideas for Muscle Recovery',
 'After a workout, your body needs protein to repair and build muscle tissue. Aim for 25-40 grams of protein in your post-workout dinner. Grilled chicken breast with roasted vegetables and quinoa provides approximately 45g of protein and is ready in 25 minutes. Pan-seared salmon with asparagus and sweet potato offers heart-healthy omega-3 fatty acids alongside 35g of protein. For a vegetarian option, try a chickpea and spinach curry served with brown rice — this combination delivers 30g of plant-based protein. Beef stir-fry with broccoli and bell peppers over jasmine rice gives you 40g of protein with iron for energy. A simple tuna and white bean salad with olive oil and lemon dressing is a no-cook option that provides 35g of protein in minutes. Remember to include a variety of protein sources throughout the week for the best amino acid profile.',
 'Recipes',
 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400',
 '2026-05-14T09:00:00Z'),

-- ═══════════════════════════════════════
-- WELLNESS (ARTC-015 to ARTC-017)
-- ═══════════════════════════════════════
('ARTC-015',
 'Sleep and Nutrition: How Your Diet Affects Sleep Quality',
 'The relationship between diet and sleep is bidirectional — what you eat affects how you sleep, and how you sleep affects what you eat. Foods rich in tryptophan (turkey, milk, bananas, oats) promote the production of serotonin and melatonin, hormones that regulate sleep. Magnesium-rich foods (dark chocolate, almonds, spinach) help relax muscles and calm the nervous system. Avoid caffeine after 2 PM — its half-life is 5-6 hours, meaning half the caffeine from your afternoon coffee is still in your system at bedtime. Limit alcohol before bed; while it may help you fall asleep faster, it disrupts REM sleep and reduces overall sleep quality. Eating a heavy meal close to bedtime forces your digestive system to work when it should be resting. Instead, have a light snack like a small handful of almonds or a banana if you are hungry before bed. Aim for consistent meal times to support your circadian rhythm.',
 'Wellness',
 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400',
 '2026-05-14T20:00:00Z'),

('ARTC-016',
 'Managing Stress Through Mindful Eating',
 'Mindful eating is the practice of paying full attention to the experience of eating — the colors, smells, textures, and flavors of your food. In our fast-paced world, many of us eat while distracted by phones, computers, or television, leading to overeating and reduced satisfaction. To practice mindful eating, start by sitting at a table without distractions. Take three deep breaths before your first bite. Chew each bite 20-30 times, noticing the flavors and textures. Put your utensils down between bites. This practice activates your parasympathetic nervous system (rest and digest mode), improving digestion and nutrient absorption. Studies show that mindful eating reduces cortisol levels, decreases binge eating episodes, and improves the overall relationship with food. Start with one mindful meal per day and gradually extend the practice.',
 'Wellness',
 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400',
 '2026-05-15T08:00:00Z'),

('ARTC-017',
 'The Gut-Brain Connection: How Food Affects Your Mood',
 'Your gut is often called the "second brain" because it produces about 95% of your body''s serotonin — the neurotransmitter responsible for mood regulation. The gut microbiome, consisting of trillions of bacteria, plays a crucial role in this connection. To support a healthy gut, eat prebiotic foods (garlic, onions, bananas, asparagus) that feed beneficial bacteria, and probiotic foods (yogurt, kimchi, tempeh, kefir) that introduce good bacteria. A diet high in processed foods, sugar, and artificial sweeteners can damage the gut microbiome, leading to inflammation that affects mental health. Research has linked poor gut health to increased rates of anxiety and depression. Fiber is essential — aim for 25-30 grams daily from vegetables, fruits, whole grains, and legumes. Fermented Indonesian foods like tempe and tape are excellent natural probiotics. Making small dietary changes to support your gut can have a noticeable impact on your mood within just a few weeks.',
 'Wellness',
 'https://images.unsplash.com/photo-1505576399279-0d754c0d8a04?w=400',
 '2026-05-15T10:00:00Z');
