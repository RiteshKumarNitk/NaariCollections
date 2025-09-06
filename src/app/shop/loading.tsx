
import { Skeleton } from "@/components/ui/skeleton";

export default function ShopPageSkeleton() {
    return (
        <div className="container py-8">
            <div className="mb-8 text-center">
                <Skeleton className="h-10 w-1/3 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto mt-2" />
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-64 lg:w-72">
                     <div className='hidden md:block space-y-4'>
                        <Skeleton className="h-8 w-1/3" />
                        <div className="space-y-2">
                           <Skeleton className="h-8 w-full" />
                           <Skeleton className="h-20 w-full" />
                        </div>
                         <div className="space-y-2">
                           <Skeleton className="h-8 w-full" />
                           <Skeleton className="h-16 w-full" />
                        </div>
                     </div>
                </aside>

                <main className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-10 w-44" />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                           <div key={i} className="space-y-2">
                              <Skeleton className="aspect-[3/4] w-full" />
                              <Skeleton className="h-5 w-3/4" />
                              <Skeleton className="h-5 w-1/2" />
                           </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
