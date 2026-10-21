import Link from "next/link";
import { notFound } from "next/navigation";
import api from "@/lib/api";

// ✅ Render at request time — prevents build-time API calls (fixes 429)
export const dynamic = 'force-dynamic';

async function getChecklistItem(id) {
  if (!id || id === 'undefined' || id === 'null') notFound();
  try {
    const res = await api.get(`/checklist-items/${id}`);
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

export default async function ChecklistDetail({ params }) {
  const { id } = await params;
  if (!id || id === 'undefined' || id === 'null') notFound();

  const item = await getChecklistItem(id);

  const taskId = typeof item.task_id === 'object' ? item.task_id?.id : item.task_id;
  const task = taskId ? await getTask(taskId) : null;

  const createdAt = item.created?.human || item.created_at;

  return (
    <section className="section-stack py-6">
      <div className="space-y-3">
        <p className="eyebrow">Checklist Items</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          Checklist Item Details
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          Review the selected checklist item.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <a
          href="/checklist"
          className="button-secondary hover:border-slate-400 hover:bg-white"
        >
          &larr; Back to Checklist Items
        </a>
        <div className="flex gap-2">
          <a
            href={`/checklist/${item.id}/edit`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Edit Item
          </a>
        </div>
      </div>

      <article className="surface-card rounded-[1rem] p-6 md:p-8">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${item.is_completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                  {item.is_completed && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <h2 className={`text-2xl font-semibold tracking-tight text-slate-950 ${item.is_completed ? 'line-through text-gray-500' : ''}`}>
                  {item.name || 'Untitled Item'}
                </h2>
              </div>
              <span className={`ml-9 text-sm px-2 py-1 rounded ${item.is_completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {item.is_completed ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Item ID
            </dt>
            <dd className="mt-2 font-mono text-sm text-slate-950">
              {item.id}
            </dd>
          </div>

          {task && (
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Associated Task
              </dt>
              <dd className="mt-2 text-sm text-slate-950">
                <a href={`/tasks/${task.id}`} className="text-blue-600 hover:underline">
                  {task.title || task.name || 'Untitled Task'}
                </a>
              </dd>
            </div>
          )}

          {createdAt && (
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Created
              </dt>
              <dd className="mt-2 text-sm text-slate-950">{createdAt}</dd>
            </div>
          )}

          {item.updated_at && (
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Last Updated
              </dt>
              <dd className="mt-2 text-sm text-slate-950">
                {new Date(item.updated_at).toLocaleString()}
              </dd>
            </div>
          )}
        </dl>
      </article>
    </section>
  );
}

// ✅ No generateStaticParams — with force-dynamic, pages render on demand