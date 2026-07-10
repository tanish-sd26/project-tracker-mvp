'use client';

import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { projectsAPI, tasksAPI } from '@/lib/api';
import { Project, Task } from '@/lib/types';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          projectsAPI.getAll(),
          tasksAPI.getAll(),
        ]);
        setProjects(projectsRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const activeProjects = projects.filter(
    (p) => p.status !== 'Completed'
  ).length;
  const pendingTasks = tasks.filter((t) => t.status !== 'Done').length;
  const overdueTasks = tasks.filter(
    (t) =>
      t.status !== 'Done' &&
      t.dueDate &&
      new Date(t.dueDate) < new Date()
  );
  const highPriorityTasks = tasks.filter(
    (t) => t.priority === 'High' && t.status !== 'Done'
  );

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">📊 Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-600 text-sm">Active Projects</div>
          <div className="text-3xl font-bold mt-2">{activeProjects}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-600 text-sm">Total Tasks</div>
          <div className="text-3xl font-bold mt-2">{tasks.length}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-600 text-sm">Pending Tasks</div>
          <div className="text-3xl font-bold mt-2 text-yellow-600">
            {pendingTasks}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-600 text-sm">Overdue Tasks</div>
          <div className="text-3xl font-bold mt-2 text-red-600">
            {overdueTasks.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">🔴 Overdue Tasks</h2>
          {overdueTasks.length === 0 ? (
            <p className="text-gray-500">No overdue tasks</p>
          ) : (
            <ul className="space-y-2">
              {overdueTasks.map((task) => (
                <li key={task.id} className="text-sm border-l-4 border-red-500 pl-3">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-gray-600">
                    {task.project?.name} • Due{' '}
                    {new Date(task.dueDate!).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">⚡ High Priority Tasks</h2>
          {highPriorityTasks.length === 0 ? (
            <p className="text-gray-500">No high priority tasks</p>
          ) : (
            <ul className="space-y-2">
              {highPriorityTasks.slice(0, 5).map((task) => (
                <li key={task.id} className="text-sm border-l-4 border-orange-500 pl-3">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-gray-600">
                    {task.project?.name} • {task.status}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}