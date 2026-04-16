import { api } from "./api";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

function buildUrl(path) {
  return `${import.meta.env.VITE_BE_DOMAIN_NAME}/${path}`;
}

export async function login(email, password) {
  const data = await api.post(buildUrl(import.meta.env.VITE_LOGIN_URL), {
    email,
    password,
  });
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user ?? { email }));
  return data;
}

export async function register(name, email, password) {
  const data = await api.post(
    buildUrl(import.meta.env.VITE_REGISTER_URL ?? "users/register"),
    { name, email, password },
  );
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user ?? { name, email }));
  return data;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}
