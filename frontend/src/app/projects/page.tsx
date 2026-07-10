'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProjectForm } from '@/components/ProjectForm';
import { projectsAPI } from '@/lib/api';
import { Project } from '@/lib/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        await projectsAPI.delete(id);
        fetchProjects();
      } catch (error) {
        alert('Failed to delete project');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  const statusColors = {
    'Not Started': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">📁 Projects</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            + New Project
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-8">
          <ProjectForm
            onSuccess={() => {
              setShowForm(false);
              fetchProjects();
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {projects.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg">No projects yet. Create your first project!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">{project.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{project.client?.name}</p>
              <p className="text-sm text-gray-600 mb-3">{project.description}</p>
              <div
                className={`inline-block px-3 py-1 text-xs rounded-full mb-4 ${
                  statusColors[project.status as keyof typeof statusColors] ||
                  'bg-gray-100'
                }`}
              >
                {project.status}
              </div>
              <div className="text-sm text-gray-500 mb-4">
                {project.tasks?.length || 0} tasks
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/projects/${project.id}`}
                  className="flex-1 bg-blue-600 text-white text-center px-3 py-2 rounded hover:bg-blue-700"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}