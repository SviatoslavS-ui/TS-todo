import React, { useState, useRef, useEffect } from 'react';
import type { TodoProps } from '../types/todo';

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
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
};
