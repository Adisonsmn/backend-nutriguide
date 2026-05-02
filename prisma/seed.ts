import prisma from '../src/models/prisma.js';

async function main() {
  console.log('Seeding data...');

  // === SEED FOODS ===
  const foods = [
    {
      name: 'Grilled Chicken Salad',
      calories: 380,
      protein_g: 35,
      carbs_g: 12,
      fat_g: 22,
      price_estimate: 12.99,
      category: 'High Protein',
      source: 'Restaurant',
      image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    },
    {
      name: 'Quinoa Buddha Bowl',
      calories: 425,
      protein_g: 18,
      carbs_g: 55,
      fat_g: 16,
      price_estimate: 10.50,
      category: 'Vegetarian',
      source: 'Homemade',
      image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    },
    {
      name: 'Salmon with Vegetables',
      calories: 510,
      protein_g: 40,
      carbs_g: 20,
      fat_g: 30,
      price_estimate: 18.99,
      category: 'High Protein',
      source: 'Restaurant',
      image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
    },
    {
      name: 'Greek Yogurt Parfait',
      calories: 220,
      protein_g: 15,
      carbs_g: 30,
      fat_g: 5,
      price_estimate: 6.50,
      category: 'Low Sugar',
      source: 'Homemade',
      image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    },
    {
      name: 'Avocado Toast',
      calories: 310,
      protein_g: 10,
      carbs_g: 35,
      fat_g: 18,
      price_estimate: 8.00,
      category: 'Low Carb',
      source: 'Homemade',
      image_url: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
    },
    {
      name: 'Chicken Stir Fry',
      calories: 450,
      protein_g: 30,
      carbs_g: 40,
      fat_g: 18,
      price_estimate: 11.00,
      category: 'High Protein',
      source: 'Homemade',
      image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    },
  ];

  for (const food of foods) {
    await prisma.food.upsert({
      where: { food_id: '00000000-0000-0000-0000-000000000000' }, // never matches
      update: {},
      create: food,
    });
  }
  console.log(`✅ Seeded ${foods.length} foods`);

  // === SEED ARTICLES ===
  const articles = [
    {
      title: '5 Ways to Boost Your Protein Intake',
      content: 'Protein is essential for muscle repair and growth. Here are five easy ways to increase your daily protein consumption: 1) Start your day with eggs or Greek yogurt, 2) Add lean meats like chicken breast to your lunches, 3) Snack on nuts and seeds throughout the day, 4) Include legumes like lentils and chickpeas in your dinners, 5) Consider a protein supplement if you are very active.',
      category: 'Nutrition',
      image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop',
    },
    {
      title: 'Understanding Micronutrients',
      content: 'Micronutrients — vitamins and minerals — are crucial for your body to function properly. Unlike macronutrients (carbs, protein, fat), they are needed in smaller amounts but are no less important. Key micronutrients include Vitamin D for bone health, Iron for oxygen transport, Zinc for immune function, and B-vitamins for energy metabolism. A balanced diet rich in fruits, vegetables, and whole grains typically covers most needs.',
      category: 'Education',
      image_url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=250&fit=crop',
    },
    {
      title: 'Meal Prep Tips for Busy Weeks',
      content: 'Meal prepping is the key to eating healthy even on your busiest days. Start by choosing 2-3 recipes for the week. Prep ingredients on Sunday: wash and chop vegetables, cook grains like rice or quinoa, and portion out proteins. Store meals in airtight containers in the fridge for up to 4 days, or freeze them for later. This saves time, reduces food waste, and helps you avoid unhealthy takeout options.',
      category: 'Habits',
      image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=250&fit=crop',
    },
  ];

  for (const article of articles) {
    await prisma.article.create({ data: article });
  }
  console.log(`✅ Seeded ${articles.length} articles`);

  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
