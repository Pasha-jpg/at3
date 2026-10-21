import { notFound } from "next/navigation";
import api from "@/lib/api";

// ✅ Render at request time — prevents build-time API calls (fixes 429)
export const dynamic = 'force-dynamic';

async function getComment(id) {
  if (!id || id === 'undefined' || id === 'null') notFound();
  try {
    const res = await api.get(`/comments/${id}`);
    return res.data.data || res.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 404) notFound();
    throw error;
  }
}

async function getTask(id) {
  if (!id || id === 'undefined') return null;
  try {
    const res = await api.get(`/tasks/${id}`);
    return res.data.data || res.data;
  } catch (error) { return null; }
}

async function getUser(id) {
  if (!id || id === 'undefined') return null;
  try {
    const res = await api.get(`/users/${id}`);
    return res.data.data || res.data;
  } catch (error) { return null; }
}

export default async function CommentDetail({ params }) {
  const { id } = await params;
  if (!id || id === 'undefined' || id === 'null') notFound();

  const comment = await getComment(id);

  const taskId = comment.commentable_id || comment.task_id;
  const task = taskId ? await getTask(taskId) : null;

  const userId = typeof comment.user_id === 'object' ? comment.user_id?.id : comment.user_id;
  const user = userId ? await getUser(userId) : null;

  const createdAt = comment.created?.human || comment.created_at;

  return (
    <section className="section-stack py-6">
      <div className="space-y-3">
        <p className="eyebrow">Comments</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">Comment Details</h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">Review the selected comment.</p>
      </div>

      <div className="flex justify-between items-center">
        <a href="/comments" className="button-secondary hover:border-slate-400 hover:bg-white">
          &larr; Back to Comments
        </a>
        <div className="flex gap-2">
          <a href={`/comments/${comment.id}/edit`} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
            Edit Comment
          </a>
        </div>
      </div>

      <article className="surface-card rounded-[1rem] p-6 md:p-8">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">Comment</h2>
              <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded border border-gray-200 mt-2">
                {comment.content || 'No content provided.'}
              </p>
            </div>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Comment ID</dt>
            <dd className="mt-2 font-mono text-sm text-slate-950">{comment.id}</dd>
          </div>

          {task && (
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Associated Task</dt>
              <dd className="mt-2 text-sm text-slate-950">
                <a href={`/tasks/${task.id}`} className="text-blue-600 hover:underline">
                  {task.title || task.name || 'Untitled Task'}
                </a>
              </dd>
            </div>
          )}

          {user && (
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Posted By</dt>
              <dd className="mt-2 text-sm text-slate-950">{user.name || 'Unknown User'}</dd>
            </div>
          )}

          {createdAt && (
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Posted On</dt>
              <dd className="mt-2 text-sm text-slate-950">{createdAt}</dd>
            </div>
          )}
        </dl>
      </article>
    </section>
  );
}

// ✅ Removed generateStaticParams — with force-dynamic, pages render on demand