import Image from 'next/image';

const galleryImages = [
  { id: 1, src: 'https://picsum.photos/id/1011/500/500', alt: 'Woman in a beautiful saree', hint: 'woman saree' },
  { id: 2, src: 'https://picsum.photos/id/1012/500/500', alt: 'Close up of an ethnic dress fabric', hint: 'dress fabric' },
  { id: 3, src: 'https://picsum.photos/id/1013/500/500', alt: 'Woman posing in a designer kurti', hint: 'designer kurti' },
  { id: 4, src: 'https://picsum.photos/id/1015/500/500', alt: 'Elegant suit for a special occasion', hint: 'elegant suit' },
  { id: 5, src: 'https://picsum.photos/id/1025/500/500', alt: 'Model showcasing a new dress', hint: 'model dress' },
  { id: 6, src: 'https://picsum.photos/id/1035/500/500', alt: 'Vibrant colors of a traditional outfit', hint: 'traditional outfit' },
  { id: 7, src: 'https://picsum.photos/id/1045/500/500', alt: 'A happy customer in our clothing', hint: 'happy customer' },
  { id: 8, src: 'https://picsum.photos/id/1055/500/500', alt: 'Detailed embroidery on a blouse', hint: 'embroidery blouse' },
  { id: 9, src: 'https://picsum.photos/id/1065/500/500', alt: 'Summer collection dress', hint: 'summer dress' },
  { id: 10, src: 'https://picsum.photos/id/1075/500/500', alt: 'Woman looking elegant', hint: 'elegant woman' },
  { id: 11, src: 'https://picsum.photos/id/1080/500/500', alt: 'Fashion shoot with ethnic wear', hint: 'fashion shoot' },
  { id: 12, src: 'https://picsum.photos/id/133/500/500', alt: 'Lifestyle shot with our product', hint: 'lifestyle product' },
];

export default function GalleryPage() {
  return (
    <div className="container py-12">
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
