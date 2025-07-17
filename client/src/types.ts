export type TodoCategory = 'Я должен' | 'Мне должны' | 'Miscellaneous';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: TodoCategory;
  createdAt: string;
}