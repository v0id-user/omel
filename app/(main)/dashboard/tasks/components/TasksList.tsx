'use client';

import { Check, MoreVert } from 'iconoir-react';
import { TaskWithClient } from '../types/tasks';

interface TasksListProps {
  tasks: TaskWithClient[];
  onTaskToggle?: (taskId: string) => void;
  onTaskClick?: (task: TaskWithClient) => void;
}

const formatDueDateArabic = (date: Date | null) => {
  if (!date) return null;

  const arabicMonths = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ];

  const day = date.getDate();
  const month = arabicMonths[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

const isToday = (date: Date | null) => {
  if (!date) return false;
  const today = new Date();
  const targetDate = new Date(date);

  return today.toDateString() === targetDate.toDateString();
};

const isOverdue = (date: Date | null, status: string) => {
  if (!date || status === 'completed') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(date);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today;
};

function TaskRow({
  task,
  onToggle,
  onClick,
}: {
  task: TaskWithClient;
  onToggle?: (taskId: string) => void;
  onClick?: (task: TaskWithClient) => void;
}) {
  const isCompleted = task.status === 'completed';

  // Simple text color logic
  const getDueDateStyle = () => {
    if (!task.dueDate || isCompleted) return 'text-gray-500';
    if (isToday(task.dueDate)) return 'text-amber-600';
    if (isOverdue(task.dueDate, task.status)) return 'text-red-600';
    return 'text-gray-700';
  };

  // Extract title and description from the full description
  const getTaskContent = () => {
    if (!task.description) return { title: 'مهمة بدون وصف', subtitle: null };

    // If description contains a dash, split it into title and subtitle
    const dashIndex = task.description.indexOf(' - ');
    if (dashIndex > 0 && dashIndex < 60) {
      // Only if dash is within reasonable title length
      return {
        title: task.description.substring(0, dashIndex),
        subtitle: task.description.substring(dashIndex + 3),
      };
    }

    // Otherwise, use first 50 chars as title and rest as subtitle
    if (task.description.length > 50) {
      const spaceIndex = task.description.indexOf(' ', 45);
      const splitIndex = spaceIndex > 0 ? spaceIndex : 50;
      return {
        title: task.description.substring(0, splitIndex),
        subtitle: task.description.substring(splitIndex + 1),
      };
    }

    return { title: task.description, subtitle: null };
  };

  const { title, subtitle } = getTaskContent();

  return (
    <div
      className={`w-full grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 py-2 px-3 border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer transition-colors duration-150 group ${
        isCompleted ? 'opacity-60' : ''
      }`}
      onClick={() => onClick?.(task)}
    >
      {/* Task Content with Checkbox */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={e => {
            e.stopPropagation();
            onToggle?.(task.id);
          }}
          className={`relative w-4 h-4 rounded-full border-2 transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
            isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          {isCompleted && <Check className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />}
        </button>
        <div className="flex flex-col justify-center min-w-0">
          <p
            className={`text-sm font-medium leading-5 truncate ${
              isCompleted ? 'line-through text-gray-400' : 'text-gray-900'
            }`}
          >
            {title}
          </p>
          {subtitle && !isCompleted && (
            <p className="text-xs text-gray-500 mt-0.5 truncate leading-4">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Due Date */}
      <div className="flex items-center justify-center">
        {task.dueDate ? (
          <span className={`text-sm ${getDueDateStyle()}`}>
            {isToday(task.dueDate) ? 'اليوم' : formatDueDateArabic(task.dueDate)}
          </span>
        ) : (
          <span className="text-sm text-gray-400">لا يوجد تاريخ</span>
        )}
      </div>

      {/* Client */}
      <div className="flex items-center justify-center">
        {task.clientName ? (
          <span className="text-sm text-gray-700 truncate">{task.clientName}</span>
        ) : (
          <span className="text-sm text-gray-400">لا يوجد عميل</span>
        )}
      </div>

      {/* Assignee */}
      <div className="flex items-center justify-center">
        {task.assignedToName ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></span>
            {task.assignedToName.split(' ')[0]}
          </span>
        ) : (
          <span className="text-sm text-gray-400">غير مُعيّن</span>
        )}
      </div>

      {/* Options Menu */}
      <div className="flex items-center justify-center">
        <button
          onClick={e => {
            e.stopPropagation();
          }}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        >
          <MoreVert className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function SectionDivider({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center gap-2 py-1.5 px-3 bg-gray-50 border-b border-gray-200">
      <h3 className="text-sm font-normal text-[#5C5E63]">{title}</h3>
      <span
        className="flex items-center justify-center font-medium"
        style={{
          letterSpacing: '-0.02em',
          fontWeight: 500,
          lineHeight: '14px',
          fontSize: '10px',
          color: 'rgb(80, 81, 84)',
          backgroundColor: 'rgb(244, 245, 246)',
          boxShadow: 'rgb(238, 239, 241) 0px 0px 0px 1px inset',
          height: '14px',
          borderRadius: '4px',
          minWidth: '16px',
          padding: '0 4px',
        }}
      >
        {count}
      </span>
    </div>
  );
}

export function TasksList({ tasks, onTaskToggle, onTaskClick }: TasksListProps) {
  // Group tasks by sections
  const todayTasks = tasks.filter(
    task => task.dueDate && isToday(task.dueDate) && task.status !== 'completed'
  );

  const overdueTasks = tasks.filter(task => task.dueDate && isOverdue(task.dueDate, task.status));

  const upcomingTasks = tasks.filter(
    task =>
      task.status !== 'completed' &&
      (!task.dueDate || (!isToday(task.dueDate) && !isOverdue(task.dueDate, task.status)))
  );

  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="space-y-0" dir="rtl">
      {/* Single Header at Top */}
      <div className="bg-white">
        <div className="w-full grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 py-2.5 px-3 border-b border-gray-200">
          <div className="text-xs font-medium text-[#75777C] uppercase tracking-wider">المهمة</div>
          <div className="text-xs font-medium text-[#75777C] uppercase tracking-wider text-center">
            تاريخ الانتهاء
          </div>
          <div className="text-xs font-medium text-[#75777C] uppercase tracking-wider text-center">
            العميل
          </div>
          <div className="text-xs font-medium text-[#75777C] uppercase tracking-wider text-center">
            مُعيّن إلى
          </div>
          <div></div>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="bg-white border-x border-gray-200">
        {/* Today Tasks */}
        {todayTasks.length > 0 && (
          <>
            <SectionDivider title="اليوم" count={todayTasks.length} />
            {todayTasks.map(task => (
              <TaskRow key={task.id} task={task} onToggle={onTaskToggle} onClick={onTaskClick} />
            ))}
          </>
        )}

        {/* Overdue Tasks */}
        {overdueTasks.length > 0 && (
          <>
            <SectionDivider title="متأخرة" count={overdueTasks.length} />
            {overdueTasks.map(task => (
              <TaskRow key={task.id} task={task} onToggle={onTaskToggle} onClick={onTaskClick} />
            ))}
          </>
        )}

        {/* Upcoming Tasks */}
        {upcomingTasks.length > 0 && (
          <>
            <SectionDivider title="قادمة" count={upcomingTasks.length} />
            {upcomingTasks.map(task => (
              <TaskRow key={task.id} task={task} onToggle={onTaskToggle} onClick={onTaskClick} />
            ))}
          </>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <>
            <SectionDivider title="مكتملة" count={completedTasks.length} />
            {completedTasks.map(task => (
              <TaskRow key={task.id} task={task} onToggle={onTaskToggle} onClick={onTaskClick} />
            ))}
          </>
        )}
      </div>

      {/* Bottom border */}
      <div className="bg-white rounded-b-lg border-x border-b border-gray-200 h-0"></div>
    </div>
  );
}
