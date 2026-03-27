/**
 * Stable query keys — use factories so lists/invalidation stay consistent.
 * @see https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
 */
export const productKeys = {
  all: ['products'] as const,
  catalog: () => [...productKeys.all, 'catalog'] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
};
