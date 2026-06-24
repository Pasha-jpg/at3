import Link from "next/link";
import { notFound } from "next/navigation";
import api from "@/lib/api";

async function getProject(id) {
  try {
    const res = await api.get(`/projects/${id}`);
    return res.data.data || res.data;
  } catch (error) {
    if (error.response?.status === 404) {
      notFound();
    }
    throw error;
  }
}

async function getProjectTasks(projectId) {
  try {
    const res = await api.get(`/tasks?project_id=${projectId}`);
    return res.data.data || res.data || [];
  } catch (error) {
    console.error('Failed to fetch project tasks:', error);
    return [];
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

const getProjectStatus = (startDate, dueDate) => {
  const now = new Date();
  const start = startDate ? new Date(startDate) : null;
  const due = dueDate ? new Date(dueDate) : null;
  
  if (due && due < now) return 'overdue';
  if (start && start > now) return 'not-started';
  if (start && start <= now && (!due || due >= now)) return 'in-progress';
  return 'planning';
};

const getStatusColor = (status) => {
  const colors = {
    'overdue': 'bg-red-100 text-red-800',
    'not-started': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'planning': 'bg-yellow-100 text-yellow-800'
  };
  return colors[status] || 'bg-gray-100';
};

const getStatusText = (status) => {
  const texts = {
    'overdue': 'Overdue',
    'not-started': 'Not Started',
    'in-progress': 'In Progress',
    'planning': 'Planning'
  };
  return texts[status] || status;
};

export default async function ProjectDetail({ params }) {
  const { id } = await params;
  const project = await getProject(id);
  const tasks = await getProjectTasks(id);
  const owner = project.user_id ? await getUser(project.user_id) : null;
  
  const status = getProjectStatus(project.start_date, project.due_date);
  const createdAt = project.created?.human || project.created_at;

  return (
    <section className="section-stack py-6">
      <div className="space-y-3">
        <p className="eyebrow">Projects</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          Project Details
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          Review the selected project record and its associated tasks.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Link
          href="/projects"
          className="button-secondary hover:border-slate-400 hover:bg-white"
        >
          &larr; Back to Projects
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/projects/${project.id}/edit`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Edit Project
          </Link>
        </div>
      </div>

      <article className="surface-card rounded-[1rem] p-6 md:p-8">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                {project.name}
              </h2>
              <p className="text-sm leading-7 text-slate-600 mt-1">
                {project.description || "No description"}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
              {getStatusText(status)}
            </span>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Project ID
            </dt>
            <dd className="mt-2 font-mono text-sm text-slate-950">
              {project.id}
            </dd>
          </div>

          {owner && (
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Owner
              </dt>
              <dd className="mt-2 text-sm text-slate-950">{owner.name}</dd>
            </div>
          )}

          {project.start_date && (
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Start Date
              </dt>
              <dd className="mt-2 text-sm text-slate-950">
                {new Date(project.start_date).toLocaleDateString()}
              </dd>
            </div>
          )}

          {project.due_date && (
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Due Date
              </dt>
              <dd className="mt-2 text-sm text-slate-950">
                {new Date(project.due_date).toLocaleDateString()}
                {status === 'overdue' && (
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

          {project.updated_at && (
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Last Updated
              </dt>
              <dd className="mt-2 text-sm text-slate-950">
                {new Date(project.updated_at).toLocaleString()}
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
  const allProjectIds = [
    '01krwdyb16xrcwcqz400ngrbxa',    // Project 1
    '01krwdyb188czjfa7c2pktqehg',    // Project 2
    // Add ALL your project IDs here
  ];
  
  // Also try to fetch from API
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${baseUrl}/projects`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      const data = await response.json();
      const projects = data.data || data || [];
      
      if (projects && Array.isArray(projects) && projects.length > 0) {
        const apiParams = projects.map((project) => ({
          id: project.id.toString(),
        }));
        
        // Merge with UUIDs, avoiding duplicates
        const allParams = [...allProjectIds.map(id => ({ id }))];
        apiParams.forEach(param => {
          if (!allParams.some(p => p.id === param.id)) {
            allParams.push(param);
          }
        });
        
        console.log(`Generated ${allParams.length} project detail paths (API + UUIDs)`);
        return allParams;
      }
    }
  } catch (error) {
    console.error('Failed to fetch projects from API:', error);
  }
  
  // Return UUIDs as fallback
  console.log(`Generated ${allProjectIds.length} project detail paths (UUIDs only)`);
  return allProjectIds.map(id => ({ id }));
}