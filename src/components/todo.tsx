import React, { useState, useRef, useEffect } from 'react';
import type { TodoProps } from '../types/todo';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const TIME_PERIODS = {
  MORNING: { start: 6, end: 12, label: 'morning' },
  DAY: { start: 12, end: 17, label: 'day' },
  EVENING: { start: 17, end: 22, label: 'evening' },
  NIGHT: { start: 22, end: 6, label: 'night' }
} as const;

const getTimeOfDay = (hours: number): string => {
  switch (true) {
    case hours >= TIME_PERIODS.MORNING.start && hours < TIME_PERIODS.MORNING.end:
      return TIME_PERIODS.MORNING.label;
    case hours >= TIME_PERIODS.DAY.start && hours < TIME_PERIODS.DAY.end:
      return TIME_PERIODS.DAY.label;
    case hours >= TIME_PERIODS.EVENING.start && hours < TIME_PERIODS.EVENING.end:
      return TIME_PERIODS.EVENING.label;
    default:
      return TIME_PERIODS.NIGHT.label;
  }
};

const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  return `${day} ${month}`;
};

export const Todo: React.FC<TodoProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (!todo.completed) {
      setIsEditing(true);
    }
  };

  const handleSubmit = () => {
    if (editText.trim() !== '') {
      onEdit(todo.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          className="edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          onDoubleClick={handleDoubleClick}
          style={{ 
            textDecoration: todo.completed ? 'line-through' : 'none',
            textDecorationThickness: todo.completed ? '1px' : '0',
            textDecorationColor: todo.completed ? '#666' : 'transparent',
          }}
        >
          {todo.text}
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: '#3c59e8',
          fontFamily: 'system-ui',
          cursor: 'default',
          lineHeight: '0.6'
        }}>
          <span>{todo.createdAt ? formatDate(todo.createdAt.toDate()) : ''}</span>
          <span style={{ fontSize: '1.2rem' }}>{todo.createdAt ? getTimeOfDay(todo.createdAt.toDate().getHours()) : ''}</span>
        </div>
        <button onClick={() => onDelete(todo.id)}>Delete</button>
      </div>
    </div>
  );
};
