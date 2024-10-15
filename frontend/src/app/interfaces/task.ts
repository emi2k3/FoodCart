export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  usuarios: string[];
  id_usuario: number;
}
