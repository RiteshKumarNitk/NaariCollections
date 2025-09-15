
"use client";

import Image from 'next/image';
import Link from 'next/link';

const adItems = [
  {
    title: 'Timeless Elegance',
    subtitle: 'Exquisite Sarees',
    price: 'Starting from ₹1299',
    href: '/shop?category=sarees',
    imageSrc: 'https://res.cloudinary.com/your_cloud_name/image/upload/v1/naari-eshop/ad_saree.jpg',
    aiHint: 'elegant saree'
  },
  {
    title: 'Festive Special',
    subtitle: 'Flat 20% Off',
    price: 'Use Code: FESTIVE20',
    href: '/shop',
    imageSrc: 'https://res.cloudinary.com/your_cloud_name/image/upload/v1/naari-eshop/ad_festive.jpg',
    aiHint: 'festive woman'
  },
  {
    title: 'Everyday Chic',
    subtitle: 'Designer Kurtis',
    price: 'From ₹799',
    href: '/shop?category=kurtis',
    imageSrc: 'https://res.cloudinary.com/your_cloud_name/image/upload/v1/naari-eshop/ad_kurti.jpg',
    aiHint: 'designer kurti'
  }
];

export function AdBanner() {
  return (
    <section className="py-8 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {adItems.map((item) => (
            <Link href={item.href} key={item.title} className="group block relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                <Image
                    src={item.imageSrc}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint={item.aiHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 md:p-6 text-white">
                    <h3 className="font-medium text-sm text-white/90">{item.title}</h3>
                    <p className="text-xl lg:text-2xl font-headline font-bold">{item.subtitle}</p>
                    <p className="text-md font-semibold mt-1">{item.price}</p>
                </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

    