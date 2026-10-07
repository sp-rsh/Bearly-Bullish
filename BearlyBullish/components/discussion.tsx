'use client';

import { FormEvent, useEffect, useState } from 'react';
import type { Comment } from '@/lib/comments';

export function Discussion({ articleSlug }: { articleSlug: string }) {
  const [comments, setComments] = useState<Comment[] | null | undefined>(undefined);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?article=${encodeURIComponent(articleSlug)}`)
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(data => setComments(data.comments))
      .catch(() => setComments(null));
  }, [articleSlug]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    if (!name.trim() || !body.trim()) {
      setMessage('Enter both your name and a comment.');
      return;
    }

    setPosting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleSlug,
          name,
          body,
          parentCommentId: replyTo,
          website: (event.currentTarget.elements.namedItem('website') as HTMLInputElement).value,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setBody('');
      setReplyTo(null);
      setMessage(data.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Your comment could not be posted. Please try again.');
    } finally {
      setPosting(false);
    }
  }

  const topLevel = (comments ?? []).filter(comment => comment.parentCommentId === null);
  const count = comments === undefined ? 'Loading discussion…'
    : comments === null ? 'Comments are temporarily unavailable.'
    : comments.length === 1 ? '1 comment'
    : `${comments.length} comments`;

  return <section className="mt-14 max-w-3xl border-t paper-rule pt-7">
    <p className="editorial-label">Comments</p>
    <h2 className="mt-2 font-editorial text-2xl font-bold">Join the discussion</h2>
    <p className="mt-2 text-sm text-stone-600">{count}</p>
    <form className="mt-6 border-y paper-rule py-5" onSubmit={submit}>
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600">
        Name
        <input maxLength={80} value={name} onChange={event => setName(event.target.value)} className="focus-ring mt-2 w-full rounded-md border border-stone-300 bg-transparent px-3 py-2 text-sm text-stone-900 outline-none" />
      </label>
      <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wider text-stone-600">
        {replyTo ? 'Reply' : 'Comment'}
        <textarea maxLength={2000} value={body} onChange={event => setBody(event.target.value)} className="focus-ring mt-2 min-h-28 w-full resize-y rounded-md border border-stone-300 bg-transparent px-3 py-2 text-sm leading-6 text-stone-900 outline-none" />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      <div className="mt-4 flex items-center gap-4">
        <button disabled={posting} className="focus-ring rounded-md bg-stone-900 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white disabled:cursor-not-allowed disabled:opacity-50">{posting ? 'Posting…' : 'Post comment'}</button>
        {replyTo && <button type="button" onClick={() => setReplyTo(null)} className="focus-ring rounded px-1 py-1 text-xs text-stone-600 underline underline-offset-4">Cancel reply</button>}
      </div>
      {message && <p className="mt-4 text-sm text-stone-600" role="status">{message}</p>}
    </form>
    {comments !== undefined && comments !== null && (topLevel.length === 0
      ? <p className="py-6 text-sm text-stone-600">Be the first to join the discussion.</p>
      : <div>{topLevel.map(comment => <CommentRow key={comment.id} comment={comment} replies={comments.filter(reply => reply.parentCommentId === comment.id)} onReply={setReplyTo} />)}</div>
    )}
  </section>;
}

function CommentRow({ comment, replies, onReply }: { comment: Comment; replies: Comment[]; onReply: (id: number) => void }) {
  return <article className="border-b paper-rule py-5">
    <p className="font-semibold text-sm text-stone-900">{comment.name}</p>
    <p className="mt-1 text-[11px] uppercase tracking-wider text-stone-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-stone-700">{comment.body}</p>
    <button type="button" onClick={() => onReply(comment.id)} className="focus-ring mt-3 rounded px-1 py-1 text-xs text-stone-600 underline underline-offset-4">Reply</button>
    {replies.map(reply => <div className="mt-5 border-l border-stone-300 pl-4" key={reply.id}>
      <p className="font-semibold text-sm text-stone-900">{reply.name}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-stone-700">{reply.body}</p>
    </div>)}
  </article>;
}
