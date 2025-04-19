export const isAuthenticated = () => {
  return localStorage.getItem('auth') === 'true' && localStorage.getItem('userId');
};

export const loginUser = (userId, username) => {
  localStorage.setItem('auth', 'true');
  localStorage.setItem('userId', userId);
  localStorage.setItem('username', username);
};

export const logoutUser = () => {
  localStorage.clear();
};
