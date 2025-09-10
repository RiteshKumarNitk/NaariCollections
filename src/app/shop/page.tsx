
import { Suspense } from 'react';
import { ShopPageClient } from '@/components/ShopPageClient';
import ShopPageSkeleton from './loading';
import { AddToCartDialog } from '@/components/AddToCartDialog';
import { getProducts } from '@/lib/data';

export default async function ShopPage() {
  const allProducts = await getProducts();

  return (
    <div className="container mx-auto">
      <Suspense fallback={<ShopPageSkeleton />}>
        <AddToCartDialog>
          <ShopPageClient allProducts={allProducts} />
        </AddToCartDialog>
      </Suspense>
    </div>
  );
}
