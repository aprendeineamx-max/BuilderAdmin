const { Client } = require('pg');

// Try password from secrets.md
const client = new Client({
    user: 'postgres',
    host: 'localhost', // Docker maps 5432 to localhost
    database: 'postgres',
    password: 'your-super-secret-and-long-postgres-password',
    port: 5432,
});

async function run() {
    console.log("Connecting...");
    try {
        await client.connect();
        console.log("Connected. Applying Policy...");
        await client.query(`
      ALTER TABLE IF EXISTS public.clases_generadas ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Public Read" ON public.clases_generadas;
      CREATE POLICY "Public Read" ON public.clases_generadas FOR SELECT USING (true);
    `);
        console.log("✅ Policy Applied Successfully!");
    } catch (e) {
        console.error("❌ Error:", e.message);
    } finally {
        await client.end();
    }
}
run();
