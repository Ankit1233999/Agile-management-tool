const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = 'GET', token, body } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data.message || 'Something went wrong. Please try again.', response.status);
  }
  return data;
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  me: (token) => request('/auth/me', { token }),

  getWorkspaces: (token) => request('/workspaces', { token }),
  getWorkspace: (workspaceId, token) => request(`/workspaces/${workspaceId}`, { token }),
  createWorkspace: (body, token) => request('/workspaces', { method: 'POST', token, body }),
  updateWorkspace: (workspaceId, body, token) => request(`/workspaces/${workspaceId}`, { method: 'PUT', token, body }),
  inviteMember: (workspaceId, body, token) => request(`/workspaces/${workspaceId}/invite`, { method: 'POST', token, body }),

  getWorkspaceBoards: (workspaceId, token) => request(`/boards/workspace/${workspaceId}`, { token }),
  getBoard: (boardId, token) => request(`/boards/${boardId}`, { token }),
  createBoard: (body, token) => request('/boards', { method: 'POST', token, body }),
  updateBoard: (boardId, body, token) => request(`/boards/${boardId}`, { method: 'PUT', token, body }),
  deleteBoard: (boardId, token) => request(`/boards/${boardId}`, { method: 'DELETE', token }),

  createList: (body, token) => request('/lists', { method: 'POST', token, body }),
  updateList: (listId, body, token) => request(`/lists/${listId}`, { method: 'PUT', token, body }),
  deleteList: (listId, token) => request(`/lists/${listId}`, { method: 'DELETE', token }),

  createCard: (body, token) => request('/cards', { method: 'POST', token, body }),
  updateCard: (cardId, body, token) => request(`/cards/${cardId}`, { method: 'PUT', token, body }),
  moveCard: (cardId, body, token) => request(`/cards/${cardId}/move`, { method: 'PUT', token, body }),
  deleteCard: (cardId, token) => request(`/cards/${cardId}`, { method: 'DELETE', token }),
  addComment: (cardId, body, token) => request(`/cards/${cardId}/comments`, { method: 'POST', token, body }),
  deleteComment: (cardId, commentId, token) => request(`/cards/${cardId}/comments/${commentId}`, { method: 'DELETE', token }),
};
