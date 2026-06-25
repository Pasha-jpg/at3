import Link from "next/link";
import { notFound } from "next/navigation";
import api from "@/lib/api";

async function getMilestone(id) {
  try {
    const res = await api.get(`/milestones/${id}`);
    return res.data.data || res.data;
  } catch (error) {
    if (error.response?.status === 404) {
      notFound();
    }
    throw error;
  }
}

async function getProject(id) {
  try {
    const res = await api.get(`/projects/${id}`);
    return res.data.data || res.data;
  } catch (error) {
    return null;
  }
}

async function getMilestoneTasks(milestoneId) {
  try {
    const res = await api.get(`/tasks?milestone_id=${milestoneId}`);
    return res.data.data || res.data || [];
  } catch (error) {
    console.error('Failed to fetch milestone tasks:', error);
    return [];
  }
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  };
  return colors[status] || 'bg-gray-100';
};

export default async function MilestoneDetail({ params }) {
  const { id } = await params;
  const milestone = await getMilestone(id);
  const project = milestone.project_id ? await getProject(milestone.project_id) : null;
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
        <Link
          href="/milestones"
          className="button-secondary hover:border-slate-400 hover:bg-white"
        >
          &larr; Back to Milestones
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/milestones/${milestone.id}/edit`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Edit Milestone
          </Link>
        </div>
      </div>

      <article className="surface-card rounded-[1rem] p-6 md:p-8">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                {milestone.title}
              </h2>
              <p className="text-sm leading-7 text-slate-600 mt-1">
                {milestone.description || "No description"}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(milestone.status)}`}>
              {milestone.status}
            </span>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Milestone ID
            </dt>
            <dd className="mt-2 font-mono text-sm text-slate-950">
              {milestone.id}
            </dd>
          </div>

          {project && (
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Project
              </dt>
              <dd className="mt-2 text-sm text-slate-950">
                <Link href={`/projects/${project.id}`} className="text-blue-600 hover:underline">
                  {project.name}
                </Link>
              </dd>
            </div>
          )}

          {milestone.due_date && (
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Due Date
              </dt>
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
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Created
              </dt>
              <dd className="mt-2 text-sm text-slate-950">{createdAt}</dd>
            </div>
          )}

          {milestone.updated_at && (
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Last Updated
              </dt>
              <dd className="mt-2 text-sm text-slate-950">
                {new Date(milestone.updated_at).toLocaleString()}
              </dd>
            </div>
          )}
        </dl>

        {tasks && tasks.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-slate-950 mb-4">
              Associated Tasks ({tasks.length})
            </h3>
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
                        <Link href={`/tasks/${task.id}`} className="text-blue-600 hover:underline">
                          {task.title}
                        </Link>
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

// Generate static paths for detail view
export async function generateStaticParams() {
  // ALWAYS return these UUIDs - this is the primary source
  const allMilestoneIds = [
    '01krwdznr0dpdgkk81gs3mgr0j',    // Your milestone ID
    // Add ALL your milestone IDs here
  ];
  
  // Also try to fetch from API
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${baseUrl}/milestones`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      const data = await response.json();
      const milestones = data.data || data || [];
      
      if (milestones && Array.isArray(milestones) && milestones.length > 0) {
        const apiParams = milestones.map((milestone) => ({
          id: milestone.id.toString(),
        }));
        
        // Merge with UUIDs, avoiding duplicates
        const allParams = [...allMilestoneIds.map(id => ({ id }))];
        apiParams.forEach(param => {
          if (!allParams.some(p => p.id === param.id)) {
            allParams.push(param);
          }
        });
        
        console.log(`Generated ${allParams.length} milestone detail paths (API + UUIDs)`);
        return allParams;
      }
    }
  } catch (error) {
    console.error('Failed to fetch milestones from API:', error);
  }
  
  // Return UUIDs as fallback
  console.log(`Generated ${allMilestoneIds.length} milestone detail paths (UUIDs only)`);
  return allMilestoneIds.map(id => ({ id }));
}