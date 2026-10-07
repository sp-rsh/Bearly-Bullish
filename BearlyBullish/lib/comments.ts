import { getDb } from '@/lib/db';

export interface Comment {
  id: number;
  articleSlug: string;
  name: string;
  body: string;
  parentCommentId: number | null;
  createdAt: string;
}

export function validateComment(input: { name?: unknown; body?: unknown; parentCommentId?: unknown }) {
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const body = typeof input.body === 'string' ? input.body.trim() : '';
  const parentCommentId = typeof input.parentCommentId === 'number' && Number.isSafeInteger(input.parentCommentId)
    ? input.parentCommentId
    : null;

  if (!name || name.length > 80) return { error: 'Please enter a name of up to 80 characters.' };
  if (!body || body.length > 2000) return { error: 'Comments must be between 1 and 2,000 characters.' };
  return { name, body, parentCommentId };
}

export async function approvedComments(articleSlug: string): Promise<Comment[]> {
  const db = await getDb();
  if (!db) throw new Error('Comments unavailable');

  const result = await db.query(
    'SELECT id, article_slug, display_name, body, parent_comment_id, created_at FROM comments WHERE article_slug = $1 AND status = $2 ORDER BY created_at ASC',
    [articleSlug, 'approved']
  );

  return result.rows.map(row => ({
    id: Number(row.id),
    articleSlug: row.article_slug,
    name: row.display_name,
    body: row.body,
    parentCommentId: row.parent_comment_id === null ? null : Number(row.parent_comment_id),
    createdAt: new Date(row.created_at).toISOString(),
  }));
}

export async function addPendingComment(articleSlug: string, input: { name: string; body: string; parentCommentId: number | null }) {
  const db = await getDb();
  if (!db) throw new Error('Comments unavailable');

  if (input.parentCommentId !== null) {
    const parent = await db.query(
      'SELECT id FROM comments WHERE id = $1 AND article_slug = $2 AND status = $3',
      [input.parentCommentId, articleSlug, 'approved']
    );
    if (!parent.rowCount) throw new Error('Invalid reply');
  }

  await db.query(
    'INSERT INTO comments (article_slug, display_name, body, parent_comment_id, status) VALUES ($1, $2, $3, $4, $5)',
    [articleSlug, input.name, input.body, input.parentCommentId, 'pending']
  );
}
