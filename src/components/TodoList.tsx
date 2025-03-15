import { useState, useEffect, useRef } from 'react';
import { Todo } from './todo';
import type { TodoItem } from '../types/todo';
import { SignIn } from './SignIn';
import { useUser } from '../contexts/UserContext';
import { 
    collection, 
    query, 
    where, 
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    orderBy,
    Firestore,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const TODOS_COLLECTION = 'todos';

// Helper function to set up the listener
const setupTodosListener = (
    db: Firestore,
    userId: string,
    onData: (todos: TodoItem[]) => void,
    onError: (error: Error) => void
) => {
    const todosRef = collection(db, TODOS_COLLECTION);
    const q = query(
        todosRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );

    return onSnapshot(
        q,
        (snapshot) => {
            try {
                const todos = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        text: data.text,
                        completed: data.completed,
                        createdAt: data.createdAt
                    };
                });

                // Only log the final state
                console.log('Current todos:', todos.map(t => `${t.text} (${t.createdAt?.seconds || 'pending'})`));
                onData(todos);
            } catch (err) {
                console.error('Error processing todos:', err);
                onError(err instanceof Error ? err : new Error('Unknown error processing todos'));
            }
        },
        (err) => {
            console.error('Firestore listener error:', err);
            onError(err);
        }
    );
};

export const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const [shouldScroll, setShouldScroll] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const todosContainerRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useUser();

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        if (user) {
            try {
                unsubscribe = setupTodosListener(
                    db,
                    user.uid,
                    (newTodos) => {
                        setTodos(newTodos);
                        setError(null);
                    },
                    (error) => {
                        console.error('Firestore error:', error);
                        setError(error.message);
                    }
                );
            } catch (err) {
                console.error('Error setting up listener:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
        } else {
            setTodos([]);
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user]);

    useEffect(() => {
        if (shouldScroll && todosContainerRef.current) {
            setTimeout(() => {
                if (todosContainerRef.current) {
                    todosContainerRef.current.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
                setShouldScroll(false);
            }, 100);
        }
    }, [todos, shouldScroll]);

    const addTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newTodo.trim() && user) {
            try {
                const newTodoData = {
                    text: newTodo.trim(),
                    completed: false,
                    userId: user.uid,
                    createdAt: serverTimestamp()
                };
                
                const todosRef = collection(db, TODOS_COLLECTION);
                await addDoc(todosRef, newTodoData);
                setNewTodo('');
                setShouldScroll(true);
            } catch (error) {
                console.error('Error adding todo:', error);
                setError(error instanceof Error ? error.message : 'Error adding todo');
            }
        }
    };

    const toggleTodo = async (id: string) => {
        const todoRef = doc(db, 'todos', id);
        const todo = todos.find(t => t.id === id);
        if (todo) {
            await updateDoc(todoRef, {
                completed: !todo.completed
            });
        }
    };

    const deleteTodo = async (id: string) => {
        await deleteDoc(doc(db, 'todos', id));
    };

    const editTodo = async (id: string, newText: string) => {
        const todoRef = doc(db, 'todos', id);
        await updateDoc(todoRef, {
            text: newText
        });
    };

    if (!user) {
        return <SignIn />;
    }

    return (
        <div className="app-container">
            <div className="user-info">
                <p>Welcome, {user.email}</p>
                <button onClick={logout}>Logout</button>
            </div>
            <div className="todo-list">
                <h1>Todo List</h1>
                {error && <div className="error">{error}</div>}
                <form onSubmit={addTodo}>
                    <input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Add a new todo"
                    />
                    <button type="submit">Add</button>
                </form>
                <div className="todo-list-header">
                    <div className="done-label">Done</div>
                    <div style={{ flex: 1 }}></div>
                </div>
                <div className="todos" ref={todosContainerRef}>
                    {todos.map((todo) => (
                        <Todo
                            key={todo.id}
                            todo={todo}
                            onToggle={toggleTodo}
                            onDelete={deleteTodo}
                            onEdit={editTodo}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};


