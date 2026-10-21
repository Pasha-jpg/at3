import Link from "next/link";
import { notFound } from "next/navigation";
import api from "@/lib/api";
import { KNOWN_IDS, generateParams } from '@/lib/knownIds';

async function getMilestone(id) {
  if (!id || id === 'undefined' || id === 'null') notFound();
  
  try {
    const res = await api.get(`/milestones/${id}`);
    return res.data.data || res.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 404) {
      notFound();
    }
    throw error;
  }
}

async function getProject(id) {
  if (!id || id === 'undefined') return null;
  try {
    const res = await api.get(`/projects/${id}`);
    return res.data.data || res.data;
  } catch (error) {
    return null;
  }
}

async function getMilestoneTasks(milestoneId) {
  if (!milestoneId || milestoneId === 'undefined') return [];
  try {
    const res = await api.get(`/tasks?milestone_id=${milestoneId}`);
    const tasks = res.data.data || res.data || [];
    return Array.isArray(tasks) ? tasks : [];
  } catch (error) {
    return [];
  }
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  };
  return colors[status] || 'bg-gray-100';
};

export default async function MilestoneDetail({ params }) {
  const { id } = await params;
  
  if (!id || id === 'undefined' || id === 'null') notFound();
  
  const milestone = await getMilestone(id);
  
  const projectId = typeof milestone.project_id === 'object' ? milestone.project_id?.id : milestone.project_id;
  const project = projectId ? await getProject(projectId) : null;
  
  const tasks = await getMilestoneTasks(id);
  const createdAt = milestone.created?.human || milestone.created_at;

  return (
    <section className="section-stack py-6">
      <div className="space-y-3">
        <p className="eyebrow">Milestones</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          Milestone Details
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          Review the selected milestone record and its associated tasks.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <a href="/milestones" className="button-secondary hover:border-slate-400 hover:bg-white">
          &larr; Back to Milestones
        </a>
        <div className="flex gap-2">
          <a href={`/milestones/${milestone.id}/edit`} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
            Edit Milestone
          </a>
        </div>
      </div>

      <article className="surface-card rounded-[1rem] p-6 md:p-8">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                {milestone.title || milestone.name || 'Untitled Milestone'}
              </h2>
              <p className="text-sm leading-7 text-slate-600 mt-1">
                {milestone.description || "No description"}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(milestone.status)}`}>
              {milestone.status || 'pending'}
            </span>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Milestone ID</dt>
            <dd className="mt-2 font-mono text-sm text-slate-950">{milestone.id}</dd>
          </div>

          {project && (
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Project</dt>
              <dd className="mt-2 text-sm text-slate-950">
                <a href={`/projects/${project.id}`} className="text-blue-600 hover:underline">
                  {project.name || project.title || 'Project'}
                </a>
              </dd>
            </div>
          )}

          {milestone.due_date && (
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Due Date</dt>
              <dd className="mt-2 text-sm text-slate-950">
                {new Date(milestone.due_date).toLocaleDateString()}
                {new Date(milestone.due_date) < new Date() && milestone.status !== 'completed' && (
                  <span className="ml-2 text-red-500 text-xs">⚠️ Overdue</span>
                )}
              </dd>
            </div>
          )}

          {createdAt && (
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Created</dt>
              <dd className="mt-2 text-sm text-slate-950">{createdAt}</dd>
            </div>
          )}
        </dl>

        {tasks && tasks.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-slate-950 mb-4">Associated Tasks ({tasks.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Title</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => (
                    <tr key={task.id} className="border-t hover:bg-gray-50">
                      <td className="p-2">
                        <a href={`/tasks/${task.id}`} className="text-blue-600 hover:underline">
                          {task.name || task.title || 'Untitled Task'}
                        </a>
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="p-2">
                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}

// ✅ FIXED: Uses knownIds.js to guarantee all paths are generated
export async function generateStaticParams() {
  const params = generateParams(KNOWN_IDS.milestones);
  console.log(`✅ Generated ${params.length} milestone detail paths from knownIds.js`);
  return params;
}