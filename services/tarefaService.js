import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://aos-2025-2-withrender.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTarefas = async () => {
  const response = await apiClient.get("/tarefas");
  return response.data;
};

export const addTarefa = async (tarefa) => {
  const response = await apiClient.post("/tarefas", tarefa);
  return response.data;
};

export const updateTarefa = async (tarefa) => {
  const { id, ...data } = tarefa;
  const response = await apiClient.put(`/tarefas/${id}`, data);
  return response.data;
};

export const deleteTarefa = async (tarefa) => {
  const response = await apiClient.delete(`/tarefas/${tarefa.id}`);
  return response.data;
};