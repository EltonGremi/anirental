require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateCategories() {
  console.log("Starting DB migration for vehicle categories...");

  // Mapping vecchie categorie -> nuove (slug/id)
  const categoryMap = {
    'familje': 'gruppo-auto',
    'suv': 'gruppo-auto',
    'moto': 'gruppo-auto',
    'furgon-i-vogel': 'gruppo-trasporto',
    'furgon-i-madh': 'gruppo-trasporto',
    'kamion': 'gruppo-speciali',
    'kamper': 'gruppo-speciali',
    'pajisje': 'gruppo-speciali'
  };

  for (const [oldCat, newCat] of Object.entries(categoryMap)) {
    console.log(`Migrating '${oldCat}' to '${newCat}'...`);
    const { data, error } = await supabase
      .from('vehicles')
      .update({ category: newCat })
      .eq('category', oldCat);
      
    if (error) {
      console.error(`Error migrating ${oldCat}:`, error.message);
    } else {
      console.log(`Migrated successfully.`);
    }
  }

  console.log("Migration complete!");
}

migrateCategories();
