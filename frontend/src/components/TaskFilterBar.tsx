'use client';

import { useCallback } from 'react';

interface TaskFilterBarProps {
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
  selectedStatus: string;
  selectedPriority: string;
}

export function TaskFilterBar({
  onStatusChange,
  onPriorityChange,
  selectedStatus,
  selectedPriority,
}: TaskFilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">Filter by Status</label>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Statuses</option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Filter by Priority</label>
        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
    </div>
  );
}