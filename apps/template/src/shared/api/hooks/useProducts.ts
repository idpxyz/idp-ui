import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { ProductCatalogEntry } from '../../../mocks/types';
import { productKeys } from '../keys';
import { fetchProductById, listProductCatalog } from '../products';

export function useProductCatalogQuery() {
  return useQuery({
    queryKey: productKeys.catalog(),
    queryFn: listProductCatalog,
  });
}

export function useProductDetailQuery(productId: string | undefined) {
  const qc = useQueryClient();
  return useQuery({
    queryKey: productKeys.detail(productId ?? '__none__'),
    queryFn: () => fetchProductById(productId!),
    enabled: Boolean(productId),
    initialData: () => {
      if (!productId) return undefined;
      const fromCatalog = qc.getQueryData<ProductCatalogEntry[]>(productKeys.catalog());
      return fromCatalog?.find((e) => e.product.id === productId);
    },
  });
}
