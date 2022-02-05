import { resolveRouteWithRedirect } from "../utils";

import type { AutoLink } from "../../shared";

/**
 * Resolve AutoLink props from string
 *
 * @example
 * - Input: '/README.md'
 * - Output: { text: 'Home', link: '/' }
 */
export const useAutoLink = (item: string): AutoLink => {
  const resolved = resolveRouteWithRedirect(item);

  return {
    icon: resolved.meta.icon,
    text: resolved.meta.title || item,
    link: resolved.name === "404" ? item : resolved.fullPath,
  };
};
