import { Pool } from 'pg';

let pool: Pool | undefined;
let schemaReady: Promise<void> | undefined;

function ensureCommentSchema(db:Pool){
  schemaReady ??= (async()=>{
    await db.query(`CREATE TABLE IF NOT EXISTS comments (
      id BIGSERIAL PRIMARY KEY,
      article_slug VARCHAR(160) NOT NULL,
      display_name VARCHAR(80) NOT NULL,
      body VARCHAR(2000) NOT NULL,
      parent_comment_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
      status VARCHAR(16) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
    await db.query('CREATE INDEX IF NOT EXISTS comments_article_status_created_idx ON comments (article_slug, status, created_at DESC)');
  })();
  return schemaReady;
}

export async function getDb(){
  if(!process.env.DATABASE_URL) return null;
  pool ??= new Pool({connectionString:process.env.DATABASE_URL, max:2});
  await ensureCommentSchema(pool);
  return pool;
}
