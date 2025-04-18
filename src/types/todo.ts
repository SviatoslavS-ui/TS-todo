import { Timestamp } from "firebase/firestore";

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt?: Timestamp;
  urgent?: boolean;
}

export interface TodoProps {
  todo: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onUrgent: (id: string) => void;
}
