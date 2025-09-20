
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { getDb } from '@/lib/firebase-admin';

interface AboutUsContent {
  headline: string;
  intro: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  imageUrl: string;
}

async function getAboutUsContent(): Promise<AboutUsContent> {
  const fallback: AboutUsContent = {
    headline: 'Our Story',
    intro: "Founded on the principles of celebrating heritage and empowering the modern woman, Naari is more than just a clothing brand—it's a movement.",
    paragraph1: 'Our journey began with a simple idea: to create beautiful, high-quality ethnic wear that blends timeless traditions with contemporary style. We believe that every woman deserves to feel confident, graceful, and connected to her roots.',
    paragraph2: 'Each piece in our collection is thoughtfully designed and crafted with passion. We work with skilled artisans across the country, using age-old techniques and the finest materials to bring you garments that are not just clothes, but stories woven in thread.',
    paragraph3: 'From the bustling markets of Jaipur to the serene ghats of Varanasi, our inspiration comes from the rich tapestry of Indian culture. We invite you to be a part of our story and discover the elegance of Naari.',
    imageUrl: 'https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/about_us_founder.jpg'
  };

  try {
    const db = await getDb();
    if (!db) {
      console.error("Firestore not available, returning fallback content for about-us.");
      return fallback;
    }
    const doc = await db.collection('content').doc('about-us').get();
    if (!doc.exists) {
      return fallback;
    }
    return { ...fallback, ...doc.data() };
  } catch (error) {
    console.error("Failed to fetch 'about-us' content, returning fallback:", error);
    return fallback;
  }
}

export default async function AboutUsPage() {
  const content = await getAboutUsContent();

  return (
    <div className="container mx-auto bg-background py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">
            {content.headline}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            {content.intro}
          </p>
          <p className="mb-4">
            {content.paragraph1}
          </p>
          <p className="mb-4">
            {content.paragraph2}
          </p>
          <p className="mb-8">
            {content.paragraph3}
          </p>
          <Button asChild size="lg">
            <Link href="/shop">Explore Our Collection</Link>
          </Button>
        </div>
        <div className="order-1 md:order-2">
          <div className="aspect-[3/4] relative overflow-hidden rounded-lg shadow-lg">
            <Image
              src={content.imageUrl}
              alt="Founder of Naari"
              fill
              className="object-cover"
              data-ai-hint="elegant woman portrait"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
