
import { Suspense } from 'react';
import { ShopPageClient } from '@/components/ShopPageClient';
import ShopPageSkeleton from './loading';

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopPageSkeleton />}>
      <ShopPageClient />
    </Suspense>
  );
}
