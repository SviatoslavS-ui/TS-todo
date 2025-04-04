import { useState, useEffect, useRef } from "react";
import { Todo } from "./todo";
import type { TodoItem } from "../types/todo";
import { SignIn } from "./SignIn";
import { useUser } from "../contexts/UserContext";
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
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const TODOS_COLLECTION = "todos";

// Helper function to set up the listener
const setupTodosListener = (
  db: Firestore,
  userId: string,
  onData: (todos: TodoItem[]) => void,
  onError: (error: Error) => void,
) => {
  const todosRef = collection(db, TODOS_COLLECTION);
  const q = query(
    todosRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      try {
        const todos = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            text: data.text,
            completed: data.completed,
            createdAt: data.createdAt,
            urgent: data.urgent || false,
          };
        });

        // Only log the final state
        console.log(
          "Current todos:",
          todos.map((t) => `${t.text} (${t.createdAt?.seconds || "pending"})`),
        );
        onData(todos);
      } catch (err) {
        console.error("Error processing todos:", err);
        onError(
          err instanceof Error
            ? err
            : new Error("Unknown error processing todos"),
        );
      }
    },
    (err) => {
      console.error("Firestore listener error:", err);
      onError(err);
    },
  );
};

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [shouldScroll, setShouldScroll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const todosContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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
            console.error("Firestore error:", error);
            setError(error.message);
          },
        );
      } catch (err) {
        console.error("Error setting up listener:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
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
            behavior: "smooth",
          });
        }
        setShouldScroll(false);
      }, 50);
    }
  }, [todos, shouldScroll]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() && user) {
      try {
        const newTodoData = {
          text: newTodo.trim(),
          completed: false,
          userId: user.uid,
          createdAt: serverTimestamp(),
          urgent: false,
        };

        const todosRef = collection(db, TODOS_COLLECTION);
        await addDoc(todosRef, newTodoData);
        setNewTodo("");
        setShouldScroll(true);
        inputRef.current?.focus();
      } catch (error) {
        console.error("Error adding todo:", error);
        setError(error instanceof Error ? error.message : "Error adding todo");
      }
    }
  };

  const toggleTodo = async (id: string) => {
    const todoRef = doc(db, "todos", id);
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      await updateDoc(todoRef, {
        completed: !todo.completed,
      });
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  };

  const toggleUrgent = async (id: string) => {
    const todoRef = doc(db, "todos", id);
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      await updateDoc(todoRef, {
        urgent: !todo.urgent,
      });
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  };

  const deleteTodo = async (id: string) => {
    await deleteDoc(doc(db, "todos", id));
  };

  const editTodo = async (id: string, newText: string) => {
    const todoRef = doc(db, "todos", id);
    await updateDoc(todoRef, {
      text: newText,
    });
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  };

  if (!user) {
    return <SignIn />;
  }

  return (
    <div className="todo-list">
      <div className="header">
        <h1>Wish List</h1>
        <div className="user-info">
          <span>Welcome, {user.email}</span>
          <button onClick={logout}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10v1m-4 5H3"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      <form onSubmit={addTodo}>
        <input
          ref={inputRef}
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new wish"
        />
        <button type="submit">Add</button>
      </form>
      <div className="todo-list-header">
        <div className="header-label done-label">Done</div>
        <div style={{ flex: 1 }}></div>
        <div className="header-label created-label">
          Created
        </div>
      </div>
      <div className="todos" ref={todosContainerRef}>
        {todos.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
            onUrgent={toggleUrgent}
          />
        ))}
      </div>
    </div>
  );
};
