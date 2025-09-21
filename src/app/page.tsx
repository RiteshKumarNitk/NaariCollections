

import Link from 'next/link';
import { ArrowRight, Leaf, HeartHandshake, Scissors, Ruler, Shirt } from 'lucide-react';

import { getProducts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ProductSliders } from '@/components/ProductSliders';
import { HeroSlider } from '@/components/HeroSlider';
import { DealsOfTheDay } from '@/components/DealsOfTheDay';
import { Testimonials } from '@/components/Testimonials';
import { getDb } from '@/lib/firebase-admin';
import { PromotionalGrid } from '@/components/PromotionalGrid';
import { AdBanner } from '@/components/AdBanner';
import { AddToCartDialog } from '@/components/AddToCartDialog';

interface HomepageContent {
  headline: string;
  subheadline: string;
  heroImageUrls: string[];
}

const ourPromise = [
    {
        icon: HeartHandshake,
        title: "Comfort Fit",
        description: "Designed for a perfect fit that feels custom-made, ensuring you look and feel your best all day long."
    },
    {
        icon: Leaf,
        title: "Skin Friendly",
        description: "Crafted from soft, breathable fabrics that are gentle on your skin, preventing any irritation."
    },
    {
        icon: Scissors,
        title: "Made to Last",
        description: "Expert craftsmanship and high-quality materials mean your favorite pieces will last for years to come."
    },
    {
        icon: Shirt,
        title: "Natural Fibers",
        description: "We prioritize natural fibers that are not only sustainable but also offer superior comfort and elegance."
    },
    {
        icon: Ruler,
        title: "Sizes upto 5XL",
        description: "Celebrating every body type with a wide range of sizes, so everyone can find their perfect Naari outfit."
    }
]

export async function getHomepageContent(): Promise<HomepageContent> {
  const fallbackContent: HomepageContent = {
    headline: "Elegance Redefined",
    subheadline:
      "Discover our curated collection of exquisite women's ethnic wear. Handcrafted with passion, designed for you.",
    heroImageUrls: [],
  };

  try {
    const db = await getDb(); // server-only Firestore instance
    if (!db) {
      console.error("Firestore is not initialized. Returning fallback content.");
      return fallbackContent;
    }

    const doc = await db.collection("content").doc("homepage").get();
    if (!doc.exists) {
      return fallbackContent;
    }
    
    const data = doc.data();
    // Merge with fallback to ensure all properties exist
    return { ...fallbackContent, ...data } as HomepageContent;

  } catch (error) {
    console.error("Failed to fetch homepage content from Firestore:", error);
    return fallbackContent;
  }
}

export default async function Home() {
  const allProducts = await getProducts();
  const content = await getHomepageContent();

  const heroImages = content.heroImageUrls || [];

  return (
    <AddToCartDialog>
      <HeroSlider images={heroImages.length > 0 ? heroImages : ['https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/hero_fallback.jpg']}>
         <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-md">
            {content.headline}
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-white/90">
            {content.subheadline}
          </p>
          <Button asChild size="lg" className="mt-8 group">
            <Link href="/shop">
              Shop Now{' '}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </HeroSlider>
      
      <AdBanner />

      {/* <PromotionalGrid /> */}

      <section className="py-12 md:py-20 container">
        <ProductSliders allProducts={allProducts} />
      </section>
      
      <section className="bg-muted/30 py-16 md:py-24 w-full overflow-hidden">
        <div className="container">
          <h2 className="text-3xl font-headline mb-6 text-center">Deals of the Day</h2>
          <p className="mt-3 mb-8 text-muted-foreground text-lg text-center">
              Don't miss out on these limited-time offers!
          </p>
        </div>
        <DealsOfTheDay allProducts={allProducts} />
      </section>

      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Promise</h2>
              <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">
                We are committed to delivering not just a product, but an experience rooted in quality, comfort, and timeless elegance.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-6">
                {ourPromise.map((promise) => (
                     <div key={promise.title} className="flex flex-col items-center text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-md">
                            <promise.icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{promise.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {promise.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
      </section>
      
      <Testimonials allProducts={allProducts} />
    </AddToCartDialog>
  );
}
