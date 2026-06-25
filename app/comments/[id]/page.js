import Link from "next/link";
import { notFound } from "next/navigation";
import api from "@/lib/api";

async function getComment(id) {
  try {
    const res = await api.get(`/comments/${id}`);
    return res.data.data || res.data;
  } catch (error) {
    if (error.response?.status === 404) {
      notFound();
    }
    throw error;
  }
}

async function getTask(id) {
  try {
    const res = await api.get(`/tasks/${id}`);
    return res.data.data || res.data;
  } catch (error) {
    return null;
  }
}

async function getUser(id) {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data.data || res.data;
  } catch (error) {
    return null;
  }
}

export default async function CommentDetail({ params }) {
  const { id } = await params;
  const comment = await getComment(id);
  const task = comment.task_id ? await getTask(comment.task_id) : null;
  const user = comment.user_id ? await getUser(comment.user_id) : null;
  
  const createdAt = comment.created?.human || comment.created_at;

  return (
    <section className="section-stack py-6">
      <div className="space-y-3">
        <p className="eyebrow">Comments</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          Comment Details
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          Review the selected comment.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Link
          href="/comments"
          className="button-secondary hover:border-slate-400 hover:bg-white"
        >
          &larr; Back to Comments
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/comments/${comment.id}/edit`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Edit Comment
          </Link>
        </div>
      </div>

      <article className="surface-card rounded-[1rem] p-6 md:p-8">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                Comment
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded border border-gray-200 mt-2">
                {comment.content}
              </p>
            </div>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Comment ID
            </dt>
            <dd className="mt-2 font-mono text-sm text-slate-950">
              {comment.id}
            </dd>
          </div>

          {task && (
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Associated Task
              </dt>
              <dd className="mt-2 text-sm text-slate-950">
                <Link href={`/tasks/${task.id}`} className="text-blue-600 hover:underline">
                  {task.title}
                </Link>
              </dd>
            </div>
          )}

          {user && (
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Posted By
              </dt>
              <dd className="mt-2 text-sm text-slate-950">{user.name}</dd>
            </div>
          )}

          {createdAt && (
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Posted On
              </dt>
              <dd className="mt-2 text-sm text-slate-950">{createdAt}</dd>
            </div>
          )}

          {comment.updated_at && comment.updated_at !== comment.created_at && (
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Last Updated
              </dt>
              <dd className="mt-2 text-sm text-slate-950">
                {new Date(comment.updated_at).toLocaleString()}
              </dd>
            </div>
          )}
        </dl>
      </article>
    </section>
  );
}

// Generate static paths for detail view
export async function generateStaticParams() {
  // ADD ALL YOUR COMMENT IDs HERE
  const allCommentIds = [
    '01krwdzpbv8xz4v9qbaakjwdb4',    // Your comment ID
    // Add ALL your comment IDs here
  ];
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${baseUrl}/comments`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      const data = await response.json();
      const comments = data.data || data || [];
      
      if (comments && Array.isArray(comments) && comments.length > 0) {
        const apiParams = comments.map((comment) => ({
          id: comment.id.toString(),
        }));
        
        const allParams = [...allCommentIds.map(id => ({ id }))];
        apiParams.forEach(param => {
          if (!allParams.some(p => p.id === param.id)) {
            allParams.push(param);
          }
        });
        
        console.log(`Generated ${allParams.length} comment detail paths`);
        return allParams;
      }
    }
  } catch (error) {
    console.error('Failed to fetch comments:', error);
  }
  
  console.log(`Generated ${allCommentIds.length} comment detail paths (UUIDs only)`);
  return allCommentIds.map(id => ({ id }));
}