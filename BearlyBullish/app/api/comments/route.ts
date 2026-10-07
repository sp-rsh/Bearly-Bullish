import { NextRequest, NextResponse } from 'next/server';
import { addPendingComment, approvedComments, validateComment } from '@/lib/comments';
import { getArticle } from '@/content/articles';

const recentSubmissions = new Map<string, number>();

export async function GET(request: NextRequest) {
  const articleSlug = request.nextUrl.searchParams.get('article');
  if (!articleSlug || articleSlug.length > 160 || !getArticle(articleSlug)) {
    return NextResponse.json({ error: 'Comments temporarily unavailable.' }, { status: 400 });
  }

  try {
    return NextResponse.json({ comments: await approvedComments(articleSlug) });
  } catch {
    return NextResponse.json({ error: 'Comments temporarily unavailable.' }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  let payload: { articleSlug?: unknown; name?: unknown; body?: unknown; parentCommentId?: unknown; website?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Please send a valid comment.' }, { status: 400 });
  }

  const articleSlug = typeof payload.articleSlug === 'string' ? payload.articleSlug.trim() : '';
  if (!articleSlug || articleSlug.length > 160 || !getArticle(articleSlug) || payload.website) {
    return NextResponse.json({ error: 'Your comment could not be posted. Please try again.' }, { status: 400 });
  }

  const key = request.headers.get('x-forwarded-for') ?? 'local';
  const now = Date.now();
  if ((recentSubmissions.get(key) ?? 0) > now - 15_000) {
    return NextResponse.json({ error: 'Please wait a moment before posting again.' }, { status: 429 });
  }

  const valid = validateComment(payload);
  if ('error' in valid) return NextResponse.json({ error: valid.error }, { status: 400 });

  try {
    await addPendingComment(articleSlug, valid);
    recentSubmissions.set(key, now);
    return NextResponse.json({ message: 'Your comment has been submitted and is awaiting moderation.' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Your comment could not be posted. Please try again.' }, { status: 503 });
  }
}
