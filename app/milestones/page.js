"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

// ✅ Helper to safely extract array from API response
function extractArray(response) {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;
  return [];
}

export default function MilestonesPage() {
  const [milestones, setMilestones] = useState([]);
  const [projects, setProjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Delete handler
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this milestone? This will also delete all associated tasks.')) {
      try {
        await api.delete(`/milestones/${id}`);
        setMilestones(milestones.filter(m => m.id !== id));
      } catch (err) {
        alert('Failed to delete milestone: ' + err.message);
      }
    }
  };

  useEffect(() => {
    // Fetch milestones and projects
    Promise.all([
      api.get('/milestones'),
      api.get('/projects').catch(() => ({ data: [] }))
    ])
      .then(([milestonesRes, projectsRes]) => {
        // ✅ Safely extract arrays
        const milestonesArray = extractArray(milestonesRes);
        const projectsArray = extractArray(projectsRes);

        // Create map for project names
        const projectMap = {};
        projectsArray.forEach(project => {
          if (project && project.id) {
            projectMap[project.id] = project.name || 'Untitled Project';
          }
        });
        setProjects(projectMap);

        // Normalize milestones data
        const normalizedMilestones = milestonesArray.map(milestone => ({
          id: milestone.id,
          title: milestone.title || 'Untitled Milestone',
          description: milestone.description || '',
          status: milestone.status || 'pending',
          due_date: milestone.due_date || milestone.target_date,
          project_id: milestone.project_id,
          created_at: milestone.created_at,
          updated_at: milestone.updated_at
        }));
        
        setMilestones(normalizedMilestones);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching milestones:', err);
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

  // Filter milestones based on status
  const filteredMilestones = filter === 'all' 
    ? milestones 
    : milestones.filter(milestone => milestone.status === filter);

  const getStatusCount = (status) => {
    if (status === 'all') return milestones.length;
    return milestones.filter(milestone => milestone.status === status).length;
  };

  if (loading) return <div className="p-8">Loading milestones...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Milestones</h1>
        <Link 
          href="/milestones/new" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + New Milestone
        </Link>
      </div>
      <p className="text-gray-600 mb-6">View and manage milestone listings with project information</p>
      
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

      {filteredMilestones.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No {filter !== 'all' ? filter : ''} milestones found. Click &quot;New Milestone&quot; to create one.
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
                  <th className="p-2 text-left">Due Date</th>
                  <th className="p-2 text-left">Project</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMilestones.map(milestone => {
                  const isOverdue = milestone.due_date && 
                    new Date(milestone.due_date) < new Date() && 
                    milestone.status !== 'completed';
                  
                  return (
                    <tr key={milestone.id} className="border-t hover:bg-gray-50">
                      <td className="p-2">
                        <Link href={`/milestones/${milestone.id}`} className="text-blue-600 hover:underline">
                          {milestone.title}
                        </Link>
                      </td>
                      <td className="p-2">{milestone.description?.substring(0, 60)}...</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(milestone.status)}`}>
                          {milestone.status}
                        </span>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-1">
                          {milestone.due_date?.split('T')[0] || 'N/A'}
                          {isOverdue && (
                            <span className="text-red-500 text-xs" title="Overdue">⚠️</span>
                          )}
                        </div>
                      </td>
                      <td className="p-2">
                        <Link href={`/projects/${milestone.project_id}`} className="text-blue-600 hover:underline">
                          {projects[milestone.project_id] || milestone.project_id || 'N/A'}
                        </Link>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Link 
                            href={`/milestones/${milestone.id}/edit`}
                            className="text-blue-500 hover:text-blue-700 text-sm"
                          >
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleDelete(milestone.id)}
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
              Showing {filteredMilestones.length} of {milestones.length} milestones
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