
import { Suspense } from 'react';
import { ShopPageClient } from '@/components/ShopPageClient';
import ShopPageSkeleton from './loading';
import { AddToCartDialog } from '@/components/AddToCartDialog';

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopPageSkeleton />}>
      <AddToCartDialog>
        <ShopPageClient />
      </AddToCartDialog>
    </Suspense>
  );
}
