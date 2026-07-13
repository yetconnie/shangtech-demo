const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'shangtech_website',
});

async function main() {
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS insights (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      summary TEXT NOT NULL,
      category VARCHAR(20) DEFAULT 'technology' CHECK (category IN ('technology', 'industry', 'leadership')),
      status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'offline')),
      cover_image TEXT,
      author_name VARCHAR(100),
      author_role VARCHAR(100),
      author_avatar VARCHAR(10),
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_insights_status ON insights(status);
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_insights_category ON insights(category);
  `);

  await client.query(`
    DROP TRIGGER IF EXISTS update_insights_updated_at ON insights;
    CREATE TRIGGER update_insights_updated_at BEFORE UPDATE ON insights
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `);

  console.log('Insights table created successfully');
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
