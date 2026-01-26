import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const createUser = async(userData) => {
    const response = await api.post(`/users/`,userData);
    return response.data;
}

export const createProject = async(userId,projectData) =>{
    const response = await api.post(`/users/${userId}/projects/`,projectData);
    return response.data;
}

export const createLog = async(projectId,logData) => {
    const response = await api.post(`/projects/${projectId}/logs`,logData);
    return response.data;
}

export const getUser = async(userId) =>{
    const response = await api.get(`/users/${userId}`);
    return response.data;
}

export const getProject = async(userId) =>{
    const response = await api.get(`/users/${userId}/projects/`);
    return response.data;
}

export const getProjectLogs = async(projectId) =>{
    const response = await api.get(`/projects/${projectId}/logs`);
    return response.data;
}

export const updateUser = async(userId,userData) =>{
    const response = await api.put(`/users/${userId}`,userData);
    return response.data;
}

export const updateProject = async(projectId,projectData) =>{
    const response = await api.put(`/projects/${projectId}`,projectData);
    return response.data;
}

export const updateLog = async(logId,logData) =>{
    const response = await api.put(`/logs/${logId}`,logData);
    return response.data;
}

export const startProject = async(projectId) =>{
    const response = await api.put(`/projects/${projectId}/start`);
    return response.data;
}

export const completeProject = async(projectId) =>{
    const response = await api.put(`/projects/${projectId}/complete`);
    return response.data;
}

export const deleteUser = async(userId) =>{
    const response = await api.delete(`/users/${userId}`);
    return response.data;
}

export const deleteProject = async(projectId) =>{
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
}

export const deleteLog = async(logId) =>{
    const response = await api.delete(`/logs/${logId}`);
    return response.data; 
}

export default api;