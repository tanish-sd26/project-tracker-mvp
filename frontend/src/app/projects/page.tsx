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
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Projects</h1>
            <p className="mt-3 text-base text-gray-600">Manage all client projects from one place.</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex h-11 items-center gap-2 justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-700"
            >
              + New Project
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-10 rounded-xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
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
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mb-3 text-2xl" aria-hidden="true">▦</div>
            <p className="text-base font-medium text-gray-900">No projects yet</p>
            <p className="mt-1 text-sm text-gray-500">Create your first project to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="flex flex-col h-full rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-gray-300">
                <div className="p-10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100">
                      <svg className="h-7 w-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                      <p className="mt-2 text-base font-medium text-gray-500">{project.client?.name || 'No client'}</p>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-2 text-base text-gray-600">{project.description || 'No description'}</p>
                </div>

                <div className="border-t border-gray-200 bg-gray-50/50 px-10 py-6">
                  <div className="mb-6 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          project.status === 'Completed'
                            ? 'bg-green-500'
                            : project.status === 'In Progress'
                              ? 'bg-blue-500'
                              : 'bg-gray-400'
                        }`}
                      />
                      <span
                        className={`text-sm font-semibold ${
                          project.status === 'Completed'
                            ? 'text-green-700'
                            : project.status === 'In Progress'
                              ? 'text-blue-700'
                              : 'text-gray-700'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-gray-500">{project.tasks?.length || 0} task{(project.tasks?.length || 0) !== 1 ? 's' : ''}</span>
                  </div>

                  <div className="flex gap-4">
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex-1 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="flex-1 inline-flex h-11 items-center justify-center gap-2 rounded-lg border-2 border-red-200 bg-white px-5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
