
"use client";

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { ProductCard } from '@/components/ProductCard';
import { products as allProducts } from '@/lib/products';
import { AddToCartDialog } from '@/components/AddToCartDialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';


const FABRICS = [...new Set(allProducts.map(p => p.fabric))];
const SIZES = [...new Set(allProducts.flatMap(p => p.sizes))];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const [filters, setFilters] = useState({
    category: initialCategory ? [initialCategory] : [],
    size: [] as string[],
    fabric: [] as string[],
    price: [0, 20000],
  });

  const handleFilterChange = (type: 'category' | 'size' | 'fabric', value: string) => {
    setFilters(prev => {
      const currentValues = prev[type] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [type]: newValues };
    });
  };

  const handlePriceChange = (newPrice: number[]) => {
    setFilters(prev => ({ ...prev, price: newPrice }));
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      const { category, size, fabric, price } = filters;
      if (category.length > 0 && !category.includes(product.category)) return false;
      if (size.length > 0 && !product.sizes.some(s => size.includes(s))) return false;
      if (fabric.length > 0 && !fabric.includes(product.fabric)) return false;
      if (product.price < price[0] || product.price > price[1]) return false;
      return true;
    });

    switch (sortOrder) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'bestselling':
        filtered.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
        break;
    }

    return filtered;
  }, [filters, sortOrder]);

  const FilterAccordion = () => (
     <Accordion type="multiple" defaultValue={['category', 'price']} className="w-full">
      <AccordionItem value="category">
        <AccordionTrigger>Category</AccordionTrigger>
        <AccordionContent className="space-y-2">
          {['suits', 'sarees', 'kurtis', 'dresses'].map(cat => (
            <div key={cat} className="flex items-center space-x-2">
              <Checkbox id={`cat-${cat}`} onCheckedChange={() => handleFilterChange('category', cat)} checked={filters.category.includes(cat)} />
              <Label htmlFor={`cat-${cat}`} className="font-normal capitalize">{cat}</Label>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="price">
        <AccordionTrigger>Price</AccordionTrigger>
        <AccordionContent className="px-1 pt-2">
          <Slider
            min={0}
            max={20000}
            step={500}
            value={filters.price}
            onValueChange={handlePriceChange}
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>₹{filters.price[0]}</span>
            <span>₹{filters.price[1]}</span>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="size">
        <AccordionTrigger>Size</AccordionTrigger>
        <AccordionContent className="space-y-2">
          {SIZES.map(s => (
            <div key={s} className="flex items-center space-x-2">
              <Checkbox id={`size-${s}`} onCheckedChange={() => handleFilterChange('size', s)} checked={filters.size.includes(s)} />
              <Label htmlFor={`size-${s}`} className="font-normal">{s}</Label>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="fabric">
        <AccordionTrigger>Fabric</AccordionTrigger>
        <AccordionContent className="space-y-2">
          {FABRICS.map(f => (
            <div key={f} className="flex items-center space-x-2">
              <Checkbox id={`fabric-${f}`} onCheckedChange={() => handleFilterChange('fabric', f)} checked={filters.fabric.includes(f)} />
              <Label htmlFor={`fabric-${f}`} className="font-normal">{f}</Label>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <div className="py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-headline">Our Collection</h1>
        <p className="mt-2 text-muted-foreground">Browse our handpicked selection of the finest ethnic wear.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 lg:w-72 md:sticky top-20 h-fit">
          <div className='hidden md:block'>
            <h2 className="text-xl font-headline mb-4">Filters</h2>
            <FilterAccordion />
          </div>
        </aside>

        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="md:hidden">
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                       <span className="sr-only">Filters</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full max-w-sm">
                    <SheetHeader className="px-6 pt-6">
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="p-6">
                      <FilterAccordion />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <p className="text-sm text-muted-foreground">{filteredAndSortedProducts.length} products</p>
            </div>
            
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-auto md:w-[180px] gap-1">
                <span className="hidden md:inline">Sort by:</span>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="bestselling">Best Selling</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <AddToCartDialog>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={() => {}}/>
                ))}
              </div>
          </AddToCartDialog>
        </main>
      </div>
    </div>
  );
}
