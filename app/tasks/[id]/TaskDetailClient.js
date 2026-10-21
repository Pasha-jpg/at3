"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function TaskDetailClient() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [project, setProject] = useState(null);
  const [assignee, setAssignee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        setLoading(true);
        const taskRes = await api.get(`/tasks/${params.id}`);
        const taskData = taskRes.data?.data || taskRes.data;
        
        if (!taskData || Object.keys(taskData).length === 0) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setTask(taskData);

        // ✅ FIX: Check if assigned_to is an object or just an ID string
        if (taskData.assigned_to) {
          if (typeof taskData.assigned_to === 'object') {
            // The API already sent the full user object!
            setAssignee(taskData.assigned_to);
          } else {
            // It's just an ID string, fetch the user
            try {
              const userRes = await api.get(`/users/${taskData.assigned_to}`);
              setAssignee(userRes.data?.data || userRes.data);
            } catch (err) {
              console.error('Failed to fetch assignee:', err);
            }
          }
        }

        // ✅ FIX: Check if project_id is an object or just an ID string
        if (taskData.project_id) {
          if (typeof taskData.project_id === 'object') {
            // The API already sent the full project object!
            setProject(taskData.project_id);
          } else {
            // It's just an ID string, fetch the project
            try {
              const projectRes = await api.get(`/projects/${taskData.project_id}`);
              setProject(projectRes.data?.data || projectRes.data);
            } catch (err) {
              console.error('Failed to fetch project:', err);
            }
          }
        }

        setLoading(false);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to fetch task');
        }
        setLoading(false);
      }
    };

    if (params.id) fetchTaskDetails();
  }, [params.id]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${params.id}`);
        router.push('/tasks');
      } catch (err) {
        alert('Failed to delete task: ' + err.message);
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-orange-100 text-orange-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) return <div className="p-8 text-center">Loading task...</div>;

  if (notFound) {
    return (
      <div className="p-8 text-center max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Task Not Found</h1>
          <p className="text-gray-600 mb-4">
            The task with ID &quot;{params.id}&quot; doesn&apos;t exist in the database.
          </p>
          <Link href="/tasks" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-block">
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!task) return <div className="p-8 text-center">Task not found</div>;

  // Safely extract the assignee name whether it came from a nested object or a separate fetch
  const assigneeName = assignee?.name || task?.assigned_to?.name || 'Unassigned';
  const projectName = project?.name || task?.project_id?.name || 'No project assigned';
  const projectId = project?.id || task?.project_id?.id;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link href="/tasks" className="text-gray-600 hover:text-gray-800 inline-flex items-center gap-1">
            ← Back to Tasks
          </Link>
          <h1 className="text-3xl font-bold mt-2">{task.name || task.title}</h1>
          <p className="text-sm text-gray-500 mt-1">Created: {formatDate(task.created_at)}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/tasks/${task.id}/edit`} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
            Edit
          </Link>
          <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors">
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Status</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Priority</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>

          {task.description && (
            <div className="col-span-2">
              <h2 className="text-lg font-semibold mb-2 text-gray-700">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded border border-gray-200">
                {task.description}
              </p>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Due Date</h2>
            <p className="text-gray-700">{formatDate(task.due_date)}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Project</h2>
            {projectId ? (
              <Link href={`/projects/${projectId}`} className="text-blue-600 hover:underline">
                {projectName}
              </Link>
            ) : (
              <p className="text-gray-500">{projectName}</p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Assigned To</h2>
            <p className="text-gray-700">{assigneeName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}