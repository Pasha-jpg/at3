"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState({}); // For user/owner name mapping
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to determine project status
  const getProjectStatus = (startDate, dueDate) => {
    const now = new Date();
    const start = startDate ? new Date(startDate) : null;
    const due = dueDate ? new Date(dueDate) : null;
    
    if (due && due < now) return 'overdue';
    if (start && start > now) return 'not-started';
    if (start && start <= now && (!due || due >= now)) return 'in-progress';
    return 'planning';
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this project? This will also delete all associated tasks and milestones.')) {
      try {
        await api.delete(`/projects/${id}`);
        setProjects(projects.filter(p => p.id !== id));
      } catch (err) {
        alert('Failed to delete project: ' + err.message);
      }
    }
  };

  useEffect(() => {
    // Fetch projects and users only
    Promise.all([
      api.get('/projects'),
      api.get('/users').catch(() => ({ data: [] }))
    ])
      .then(([projectsRes, usersRes]) => {
        // Create map for user names
        const userMap = {};
        (usersRes.data || []).forEach(user => {
          userMap[user.id] = user.name;
        });
        setUsers(userMap);

        // Normalize projects data
        const normalizedProjects = (projectsRes.data || []).map(project => ({
          id: project.id,
          name: project.name,
          description: project.description,
          start_date: project.start_date,
          due_date: project.due_date,
          user_id: project.user_id, 
          created_at: project.created_at,
          updated_at: project.updated_at,
          status: getProjectStatus(project.start_date, project.due_date)
        }));
        
        setProjects(normalizedProjects);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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

  if (loading) return <div className="p-8">Loading projects...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link 
          href="/projects/new" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + New Project
        </Link>
      </div>
      <p className="text-gray-600 mb-6">View and manage project listings with owner information</p>
      
      {projects.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No projects found. Click &quot;New Project&quot; to create one.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">Status</th> 
                  <th className="p-2 text-left">Start Date</th>
                  <th className="p-2 text-left">Due Date</th>
                  <th className="p-2 text-left">Owner</th> 
                  <th className="p-2 text-left">Actions</th> 
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr key={project.id} className="border-t hover:bg-gray-50">
                    <td className="p-2">
                      <Link href={`/projects/${project.id}`} className="text-blue-600 hover:underline">
                        {project.name}
                      </Link>
                    </td>
                    <td className="p-2">{project.description?.substring(0, 60)}...</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </span>
                    </td>
                    <td className="p-2">{project.start_date?.split('T')[0] || 'N/A'}</td>
                    <td className="p-2">
                      {project.due_date?.split('T')[0] || 'N/A'}
                      {project.status === 'overdue' && (
                        <span className="ml-2 text-red-500 text-xs">⚠️</span>
                      )}
                    </td>
                    <td className="p-2">{users[project.user_id] || project.user_id || 'Unassigned'}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Link 
                          href={`/projects/${project.id}/edit`}
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(project.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-between items-center text-gray-500">
            <div>
              Total projects: {projects.length}
            </div>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-100 rounded"></span> In Progress
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-100 rounded"></span> Overdue
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-gray-100 rounded"></span> Not Started
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}