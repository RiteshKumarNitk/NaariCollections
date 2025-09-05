import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function AboutUsPage() {
  return (
    <div className="bg-background">
      <div className="container py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">
              Our Story
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Founded on the principles of celebrating heritage and empowering the modern woman, Naari is more than just a clothing brand—it&apos;s a movement.
            </p>
            <p className="mb-4">
              Our journey began with a simple idea: to create beautiful, high-quality ethnic wear that blends timeless traditions with contemporary style. We believe that every woman deserves to feel confident, graceful, and connected to her roots.
            </p>
            <p className="mb-4">
              Each piece in our collection is thoughtfully designed and crafted with passion. We work with skilled artisans across the country, using age-old techniques and the finest materials to bring you garments that are not just clothes, but stories woven in thread.
            </p>
            <p className="mb-8">
              From the bustling markets of Jaipur to the serene ghats of Varanasi, our inspiration comes from the rich tapestry of Indian culture. We invite you to be a part of our story and discover the elegance of Naari.
            </p>
            <Button asChild size="lg">
              <Link href="/shop">Explore Our Collection</Link>
            </Button>
          </div>
          <div className="order-1 md:order-2">
            <div className="aspect-[3/4] relative overflow-hidden rounded-lg shadow-lg">
              <Image
                src="https://picsum.photos/id/1011/800/1200"
                alt="Founder of Naari"
                fill
                className="object-cover"
                data-ai-hint="elegant woman portrait"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
