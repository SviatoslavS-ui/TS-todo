import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoList } from '../TodoList';

describe('TodoList Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('adds a new todo when form is submitted', () => {
    render(<TodoList />);
    
    const input = screen.getByPlaceholderText('Add a new todo');
    const button = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'New todo item' } });
    fireEvent.click(button);

    expect(screen.getByText('New todo item')).toBeInTheDocument();
  });

  it('toggles todo completion when checkbox is clicked', () => {
    render(<TodoList />);
    
    // Add a todo first
    const input = screen.getByPlaceholderText('Add a new todo');
    fireEvent.change(input, { target: { value: 'Test todo' } });
    fireEvent.click(screen.getByText('Add'));

    // Find and click the checkbox
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Check if the todo text has line-through style
    const todoText = screen.getByText('Test todo');
    expect(todoText).toHaveStyle({ textDecoration: 'line-through' });
  });

  it('deletes todo when delete button is clicked', () => {
    render(<TodoList />);
    
    // Add a todo
    const input = screen.getByPlaceholderText('Add a new todo');
    fireEvent.change(input, { target: { value: 'Todo to delete' } });
    fireEvent.click(screen.getByText('Add'));

    // Verify todo is added
    expect(screen.getByText('Todo to delete')).toBeInTheDocument();

    // Delete the todo
    fireEvent.click(screen.getByText('Delete'));

    // Verify todo is removed
    expect(screen.queryByText('Todo to delete')).not.toBeInTheDocument();
  });

  it('loads todos from localStorage on mount', () => {
    const testTodos = [
      { id: 1, text: 'Test todo', completed: false }
    ];
    localStorage.setItem('todos', JSON.stringify(testTodos));

    render(<TodoList />);
    
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });
}); 