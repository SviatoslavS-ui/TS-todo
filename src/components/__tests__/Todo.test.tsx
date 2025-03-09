import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Todo } from '../todo';

describe('Todo Component', () => {
  const mockTodo = {
    id: '1',
    text: 'Test todo',
    completed: false
  };

  it('renders todo text', () => {
    render(
      <Todo
        todo={mockTodo}
        onToggle={() => {}}
        onDelete={() => {}}
        onEdit={() => {}}
      />
    );
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('calls onToggle when checkbox is clicked', () => {
    const onToggle = vi.fn();
    render(
      <Todo
        todo={mockTodo}
        onToggle={onToggle}
        onDelete={() => {}}
        onEdit={() => {}}
      />
    );
    
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith('1');
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(
      <Todo
        todo={mockTodo}
        onToggle={() => {}}
        onDelete={onDelete}
        onEdit={() => {}}
      />
    );
    
    fireEvent.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('shows strike-through style when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(
      <Todo
        todo={completedTodo}
        onToggle={() => {}}
        onDelete={() => {}}
        onEdit={() => {}}
      />
    );
    
    const todoText = screen.getByText('Test todo');
    expect(todoText).toHaveStyle({ textDecoration: 'line-through' });
  });
}); 