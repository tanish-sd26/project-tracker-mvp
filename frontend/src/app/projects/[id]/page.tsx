'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProjectForm } from '@/components/ProjectForm';
import { TaskForm } from '@/components/TaskForm';
import { projectsAPI, tasksAPI } from '@/lib/api';
import { Project, Task, TeamMember } from '@/lib/types';

export default function ProjectDetailPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const projectRes = await projectsAPI.getOne(id);
      setProject(projectRes.data);
      setTasks(projectRes.data.tasks || []);
    } catch (error) {
      console.error('Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    // Fetch team members
    // This is a simplified approach - in real app, you'd have a separate endpoint
  }, [id]);

  const handleDeleteTask = async (taskId: number) => {
    if (confirm('Are you sure?')) {
      try {
        await tasksAPI.delete(taskId);
        fetchProject();
      } catch (error) {
        alert('Failed to delete task');
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!project) return <div>Project not found</div>;

  const incompleteTasksCount = tasks.filter((t) => t.status !== 'Done').length;
  const canMarkCompleted = incompleteTasksCount === 0;

  return (
    <div>
      <Link href="/projects" className="text-blue-600 hover:text-blue-700 mb-4">
        ← Back to Projects
      </Link>

      <div className="bg-white p-8 rounded-lg shadow mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
            <p className="text-gray-600 mb-2">{project.client?.name}</p>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded">
              {project.status}
            </div>
          </div>
          {!showEditForm && (
            <button
              onClick={() => setShowEditForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Edit
            </button>
          )}
        </div>

        {showEditForm && (
          <div className="mt-6">
            <ProjectForm
              initialData={project}
              onSuccess={() => {
                setShowEditForm(false);
                fetchProject();
              }}
              onCancel={() => setShowEditForm(false)}
            />
          </div>
        )}

        {project.status !== 'Completed' && incompleteTasksCount > 0 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded text-yellow-800">
            ⚠️ {incompleteTasksCount} task(s) still pending. Complete all tasks before marking project as done.
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tasks ({tasks.length})</h2>
        {!showTaskForm && (
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            + New Task
          </button>
        )}
      </div>

      {showTaskForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <TaskForm
            initialData={{ projectId: project.id }}
            teamMembers={teamMembers}
            onSuccess={() => {
              setShowTaskForm(false);
              fetchProject();
            }}
            onCancel={() => setShowTaskForm(false)}
          />
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-gray-500">No tasks for this project yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">{task.title}</h3>
                  {task.description && (
                    <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                  )}
                  <div className="flex gap-2 mb-2">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        task.status === 'Done'
                          ? 'bg-green-100 text-green-800'
                          : task.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {task.status}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        task.priority === 'High'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                  </div>
                  {task.dueDate && (
                    <p className="text-sm text-gray-600">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                  {task.assignee && (
                    <p className="text-sm text-gray-600">
                      Assigned to: {task.assignee.name}
                    </p>
                  )}
                </div>
                <Link
                  href={`/tasks/${task.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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