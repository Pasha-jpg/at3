"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState({}); // For project name mapping
  const [users, setUsers] = useState({}); // For user/assignee name mapping
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // For status filtering

  // Delete handler
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        setTasks(tasks.filter(t => t.id !== id));
      } catch (err) {
        alert('Failed to delete task: ' + err.message);
      }
    }
  };

  useEffect(() => {
    // Fetch tasks and related data
    Promise.all([
      api.get('/tasks'),
      api.get('/projects').catch(() => ({ data: [] })),
      api.get('/users').catch(() => ({ data: [] }))
    ])
      .then(([tasksRes, projectsRes, usersRes]) => {
        // Create maps for project and user names
        const projectMap = {};
        (projectsRes.data || []).forEach(project => {
          projectMap[project.id] = project.name;
        });
        setProjects(projectMap);

        const userMap = {};
        (usersRes.data || []).forEach(user => {
          userMap[user.id] = user.name;
        });
        setUsers(userMap);

        // Normalize tasks data with all fields from diagram
        const normalizedTasks = (tasksRes.data || []).map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          due_date: task.due_date,
          assigned_to: task.assigned_to,
          project_id: task.project_id, 
          created_at: task.created_at,
          updated_at: task.updated_at,
          priority: task.priority || 'medium'
        }));
        
        setTasks(normalizedTasks);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
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

  // Filter tasks based on status
  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  const getStatusCount = (status) => {
    if (status === 'all') return tasks.length;
    return tasks.filter(task => task.status === status).length;
  };

  if (loading) return <div className="p-8">Loading tasks...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Tasks</h1>
        {/* Add New Task Button */}
        <Link 
          href="/tasks/new" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + New Task
        </Link>
      </div>
      <p className="text-gray-600 mb-6">View and manage task listings with project and assignment information</p>
      
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 border-b">
        {['all', 'pending', 'in-progress', 'completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 capitalize ${
              filter === status 
                ? 'border-b-2 border-blue-500 text-blue-600 font-semibold' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {status === 'all' ? 'All' : status}
            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
              {getStatusCount(status)}
            </span>
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No {filter !== 'all' ? filter : ''} tasks found. Click &quot;New Task&quot; to create one.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Priority</th> 
                  <th className="p-2 text-left">Due Date</th>
                  <th className="p-2 text-left">Project</th> 
                  <th className="p-2 text-left">Assigned To</th>
                  <th className="p-2 text-left">Actions</th> 
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => {
                  const isOverdue = task.due_date && 
                    new Date(task.due_date) < new Date() && 
                    task.status !== 'completed';
                  
                  return (
                    <tr key={task.id} className="border-t hover:bg-gray-50">
                      <td className="p-2">
                        <Link href={`/tasks/${task.id}`} className="text-blue-600 hover:underline">
                          {task.title}
                        </Link>
                      </td>
                      <td className="p-2">{task.description?.substring(0, 60)}...</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                       </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                       </td>
                      <td className="p-2">
                        <div className="flex items-center gap-1">
                          {task.due_date?.split('T')[0] || 'N/A'}
                          {isOverdue && (
                            <span className="text-red-500 text-xs" title="Overdue">⚠️</span>
                          )}
                        </div>
                       </td>
                      <td className="p-2">
                        <Link href={`/projects/${task.project_id}`} className="text-blue-600 hover:underline">
                          {projects[task.project_id] || task.project_id || 'N/A'}
                        </Link>
                       </td>
                      <td className="p-2">
                        {users[task.assigned_to] || task.assigned_to || 'Unassigned'}
                       </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Link 
                            href={`/tasks/${task.id}/edit`}
                            className="text-blue-500 hover:text-blue-700 text-sm"
                          >
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleDelete(task.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                       </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Footer with stats */}
          <div className="mt-4 flex justify-between items-center text-gray-500">
            <div>
              Showing {filteredTasks.length} of {tasks.length} tasks
            </div>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-yellow-100 rounded"></span> Pending
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-100 rounded"></span> In Progress
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-100 rounded"></span> Completed
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}