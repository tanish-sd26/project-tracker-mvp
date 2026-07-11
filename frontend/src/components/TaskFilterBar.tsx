'use client';

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
    <section className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end">
      <div className="min-w-48 flex-1">
        <label className="mb-2 block text-sm font-medium text-gray-700">Filter by Status</label>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">All Statuses</option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div className="min-w-48 flex-1">
        <label className="mb-2 block text-sm font-medium text-gray-700">Filter by Priority</label>
        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
    </section>
  );
}
