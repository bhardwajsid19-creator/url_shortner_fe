import { api } from "./api";

function buildUrl(path) {
  return `${import.meta.env.VITE_BE_DOMAIN_NAME}/${path}`;
}

/**
 * @param {{
 *   url: string,
 *   short_code?: string,
 *   expiry_seconds?: number | null,
 * }} payload
 * @returns {Promise<{ shortUrl: string }>}
 */
export async function shortenUrl(payload) {
  return api.post(buildUrl(import.meta.env.VITE_URL_SHORTENER), payload);
}

/**
 * @param {string} slug
 * @param {Record<string, string>} queryParams
 * @returns {Promise<{ destination_url: string }>}
 */
export async function resolveUrl(slug) {
  return api.get(buildUrl(`${import.meta.env.VITE_URL_RESOLVER}/${slug}`));
}

/**
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<{ token: string }>}
 */
export async function loginUrl(payload) {
  return api.post(buildUrl(import.meta.env.VITE_LOGIN_URL), payload);
}

/**
 * @param {{ name: string, email: string, password: string }} payload
 * @returns {Promise<any>}
 */
export async function registerUrl(payload) {
  return api.post(buildUrl(import.meta.env.VITE_SIGNUP_URL), payload);
}

/**
 * @returns {Promise<void>}
 */
export async function logoutUrl() {
  return api.post(
    buildUrl(import.meta.env.VITE_SIGNOUT_URL),
    {},
    { withCredentials: true },
  );
}

/**
 * @returns {Promise<boolean>}
 */
export async function isAuthenticatedUrl() {
  const data = await api.get(
    buildUrl(import.meta.env.VITE_IS_AUTHENTICATED_URL),
    {},
    { withCredentials: true },
  );
  console.log("isAuthenticated response:", data);
  return data.authenticated;
}
