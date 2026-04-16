import { build } from "vite";
import { api } from "./api";

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
