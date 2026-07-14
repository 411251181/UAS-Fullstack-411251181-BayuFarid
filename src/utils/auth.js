const TOKEN_KEY = 'eco-share-token';
const USER_KEY = 'eco-share-user';

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const getStoredUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const setAuthStorage = ({ token, user }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
