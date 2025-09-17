
import Image from 'next/image';

const galleryImages = [
  { id: 1, src: 'https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/gallery_1.jpg', alt: 'Woman in a beautiful saree', hint: 'woman saree' },
  { id: 2, src: 'https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/gallery_2.jpg', alt: 'Close up of an ethnic dress fabric', hint: 'dress fabric' },
  { id: 3, src: 'https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/gallery_3.jpg', alt: 'Woman posing in a designer kurti', hint: 'designer kurti' },
  { id: 4, src: 'https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/gallery_4.jpg', alt: 'Elegant suit for a special occasion', hint: 'elegant suit' },
  { id: 5, src: 'https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/gallery_5.jpg', alt: 'Model showcasing a new dress', hint: 'model dress' },
  { id: 6, src: 'https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/gallery_6.jpg', alt: 'Vibrant colors of a traditional outfit', hint: 'traditional outfit' },
  { id: 7, src: 'https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/gallery_7.jpg', alt: 'A happy customer in our clothing', hint: 'happy customer' },
  { id: 8, src: 'https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/gallery_8.jpg', alt: 'Detailed embroidery on a blouse', hint: 'embroidery blouse' },
  { id: 9, src: 'https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/gallery_9.jpg', alt: 'Summer collection dress', hint: 'summer dress' },
  { id: 10, src: 'https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/gallery_10.jpg', alt: 'Woman looking elegant', hint: 'elegant woman' },
  { id: 11, src: 'https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/gallery_11.jpg', alt: 'Fashion shoot with ethnic wear', hint: 'fashion shoot' },
  { id: 12, src: 'https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/gallery_12.jpg', alt: 'Lifestyle shot with our product', hint: 'lifestyle product' },
];

export default function GalleryPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-headline font-bold">Our Gallery</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          A glimpse into the world of Naari.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {galleryImages.map((image) => (
          <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              data-ai-hint={image.hint}
            />
             <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

    