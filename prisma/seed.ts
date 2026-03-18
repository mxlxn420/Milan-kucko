const { Pool } = require("pg");

const pool = new Pool({
  host:     "aws-1-eu-west-2.pooler.supabase.com",
  port:     5432,
  database: "postgres",
  user:     "postgres.vofoqouomsbcnmqcecpp",
  password: "Ds4tt8JXkWyMSTln",
  ssl:      { rejectUnauthorized: false },
});

async function main() {
  console.log("🌱 Árazási szabályok feltöltése...");

  const client = await pool.connect();

  try {
    // Töröljük a meglévőket
    await client.query('DELETE FROM "PricingRule"');

    // Alap ár
    await client.query(`
      INSERT INTO "PricingRule" 
      (id, name, "pricePerNight", "dateFrom", "dateTo", "minNights", "extraGuestFee", "extraGuestFrom", "isActive", priority, "createdAt", "updatedAt")
      VALUES 
      (gen_random_uuid()::text, 'Alap ár (Tél)', 45000, NULL, NULL, 2, 3000, 3, true, 0, NOW(), NOW())
    `);

    // Tavaszi szezon
    await client.query(`
      INSERT INTO "PricingRule" 
      (id, name, "pricePerNight", "dateFrom", "dateTo", "minNights", "extraGuestFee", "extraGuestFrom", "isActive", priority, "createdAt", "updatedAt")
      VALUES 
      (gen_random_uuid()::text, 'Tavaszi szezon (Már–Jún)', 52000, '2025-03-01', '2025-06-30', 2, 3000, 3, true, 5, NOW(), NOW())
    `);

    // Főszezon
    await client.query(`
      INSERT INTO "PricingRule" 
      (id, name, "pricePerNight", "dateFrom", "dateTo", "minNights", "extraGuestFee", "extraGuestFrom", "isActive", priority, "createdAt", "updatedAt")
      VALUES 
      (gen_random_uuid()::text, 'Főszezon (Júl–Aug)', 65000, '2025-07-01', '2025-08-31', 3, 4000, 3, true, 10, NOW(), NOW())
    `);

    // Őszi szezon
    await client.query(`
      INSERT INTO "PricingRule" 
      (id, name, "pricePerNight", "dateFrom", "dateTo", "minNights", "extraGuestFee", "extraGuestFrom", "isActive", priority, "createdAt", "updatedAt")
      VALUES 
      (gen_random_uuid()::text, 'Őszi szezon (Szept–Nov)', 50000, '2025-09-01', '2025-11-30', 2, 3000, 3, true, 5, NOW(), NOW())
    `);

    // Ünnepi időszak
    await client.query(`
      INSERT INTO "PricingRule" 
      (id, name, "pricePerNight", "dateFrom", "dateTo", "minNights", "extraGuestFee", "extraGuestFrom", "isActive", priority, "createdAt", "updatedAt")
      VALUES 
      (gen_random_uuid()::text, 'Ünnepi időszak (Dec 24–Jan 2)', 70000, '2025-12-24', '2026-01-02', 3, 4000, 3, true, 20, NOW(), NOW())
    `);

    console.log("✅ Kész! 5 árazási szabály létrehozva.");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error("❌ Hiba:", e);
  process.exit(1);
});