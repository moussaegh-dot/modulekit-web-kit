// src/modules/auth/authState.js
let user = null;
let listeners = [];

export const AuthState = {
  getUser: () => user,

  setUser: (newUser) => {
    user = newUser;
    listeners.forEach((l) => l(user));
  },

  subscribe: (cb) => {
    listeners.push(cb);

    return () => {
      listeners = listeners.filter((l) => l !== cb);
    };
  },
};