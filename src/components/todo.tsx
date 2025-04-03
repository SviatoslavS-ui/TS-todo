import React, { useState, useRef, useEffect } from "react";
import type { TodoProps } from "../types/todo";
import { getTimeOfDay, formatDate } from "../utils/time";
import "./Todo.css";

export const Todo: React.FC<TodoProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
}) => {
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
    if (editText.trim() !== "") {
      onEdit(todo.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
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
          className={todo.completed ? "completed" : ""}
        >
          {todo.text}
        </span>
      )}
      <div className="todo-time-container">
        <div className="todo-time">
          <span>
            {todo.createdAt ? formatDate(todo.createdAt.toDate()) : ""}
          </span>
          <span>
            {todo.createdAt
              ? getTimeOfDay(todo.createdAt.toDate().getHours())
              : ""}
          </span>
        </div>
        <button onClick={() => onDelete(todo.id)}>Delete</button>
      </div>
    </div>
  );
};
