import {
  loginUrl,
  registerUrl,
  logoutUrl,
  isAuthenticatedUrl,
} from "./urlService";

export async function login(email, password) {
  return await loginUrl({ email, password });
}

export async function register(name, email, password) {
  return await registerUrl({ name, email, password });
}

export async function logout() {
  return await logoutUrl();
}

export async function isAuthenticated() {
  return await isAuthenticatedUrl();
}
