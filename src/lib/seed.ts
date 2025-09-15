
import 'dotenv/config';
import { getDb } from './firebase-admin';
import reviewsData from '../data/reviews.json';
import type { Product } from './types';
import type { Review } from './types';

const productsData = [
    {
        "id": "1",
        "name": "Emerald Green Handwork Suit Set",
        "price": 3299,
        "description": "Exquisite emerald green suit set with intricate handwork, perfect for festive occasions. Made from premium fabric for a comfortable fit.",
        "images": [
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/27H93_1.jpg",
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/27H93_2.jpg"
        ],
        "category": "suits",
        "sizes": ["38", "40", "42", "44", "46"],
        "fabric": "Chinnon",
        "code": "27H93",
        "creationDate": "2024-05-20T10:00:00Z",
        "bestseller": true
    },
    {
        "id": "2",
        "name": "Royal Blue Embellished Saree",
        "price": 2899,
        "description": "A stunning royal blue saree with delicate embellishments, crafted to make you stand out. Comes with a matching blouse piece.",
        "images": [
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/27H81_1.jpg",
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/27H81_2.jpg"
        ],
        "category": "sarees",
        "sizes": ["Free Size"],
        "fabric": "Georgette",
        "code": "27H81",
        "creationDate": "2024-05-19T11:00:00Z",
        "bestseller": false
    },
    {
        "id": "3",
        "name": "Pastel Pink Mirror Work Kaftan",
        "price": 1899,
        "description": "Chic and comfortable pastel pink kaftan featuring elegant mirror work. Perfect for a relaxed yet stylish look. Made from pure crepe.",
        "images": [
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/25H56_1.jpg",
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/25H56_2.jpg"
        ],
        "category": "kaftans",
        "sizes": ["Free Size"],
        "fabric": "Pure Crepe",
        "code": "25H56",
        "creationDate": "2024-05-18T12:00:00Z",
        "bestseller": true
    },
    {
        "id": "4",
        "name": "Mustard Yellow Printed Kurti",
        "price": 1299,
        "description": "A vibrant mustard yellow kurti with beautiful traditional prints. Ideal for daily wear, offering both style and comfort.",
        "images": [
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/25H57_1.jpg",
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/25H57_2.jpg"
        ],
        "category": "kurtis",
        "sizes": ["38", "40", "42", "44"],
        "fabric": "Cotton",
        "code": "25H57",
        "creationDate": "2024-05-17T13:00:00Z",
        "bestseller": false
    },
    {
        "id": "5",
        "name": "Wine Red Anarkali Set with Organza Dupatta",
        "price": 3499,
        "description": "A breathtaking wine red anarkali set, complete with a delicate organza dupatta. The perfect ensemble for weddings and grand celebrations.",
        "images": [
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/27H86_1.jpg",
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/27H86_2.jpg"
        ],
        "category": "anarkali",
        "sizes": ["38", "40", "42"],
        "fabric": "Silk Blend",
        "code": "27H86",
        "creationDate": "2024-05-16T14:00:00Z",
        "bestseller": true
    },
    {
        "id": "6",
        "name": "Elegant Black & Gold Gown",
        "price": 2999,
        "description": "A sophisticated black gown with intricate gold detailing, designed for evening parties and formal events.",
        "images": [
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/27H88_1.jpg",
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/27H88_2.jpg"
        ],
        "category": "dresses",
        "sizes": ["38", "40", "42", "44"],
        "fabric": "Velvet",
        "code": "27H88",
        "creationDate": "2024-05-15T15:00:00Z",
        "bestseller": false
    },
    {
        "id": "7",
        "name": "Ivory White Sharara Suit",
        "price": 3199,
        "description": "A graceful ivory white sharara suit, perfect for daytime events. Features subtle embroidery for a touch of elegance.",
        "images": [
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/27H90_1.jpg",
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/27H90_2.jpg"
        ],
        "category": "suits",
        "sizes": ["38", "40", "42", "44", "46"],
        "fabric": "Georgette",
        "code": "27H90",
        "creationDate": "2024-05-14T16:00:00Z",
        "bestseller": false
    },
    {
        "id": "8",
        "name": "Teal Blue Bandhani Saree",
        "price": 2599,
        "description": "A beautiful teal blue saree featuring traditional Bandhani print. Lightweight and easy to drape for any occasion.",
        "images": [
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/27H91_1.jpg",
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/27H91_2.jpg"
        ],
        "category": "sarees",
        "sizes": ["Free Size"],
        "fabric": "Art Silk",
        "code": "27H91",
        "creationDate": "2024-05-13T17:00:00Z",
        "bestseller": false
    },
    {
        "id": "9",
        "name": "Chic Grey Indo-Western Dress",
        "price": 2799,
        "description": "A modern grey indo-western dress that blends contemporary style with ethnic motifs. Perfect for the fashion-forward woman.",
        "images": [
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/27H92_1.jpg",
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/27H92_2.jpg"
        ],
        "category": "indo-western",
        "sizes": ["38", "40", "42"],
        "fabric": "Rayon",
        "code": "27H92",
        "creationDate": "2024-05-12T18:00:00Z",
        "bestseller": true
    },
    {
        "id": "10",
        "name": "Navy Blue Floral Print Suit",
        "price": 2299,
        "description": "A lovely navy blue suit with a charming floral print, suitable for both casual and semi-formal events.",
        "images": [
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/27H94_1.jpg",
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/27H94_2.jpg"
        ],
        "category": "suits",
        "sizes": ["38", "40", "42", "44", "46"],
        "fabric": "Crepe",
        "code": "27H94",
        "creationDate": "2024-05-11T19:00:00Z",
        "bestseller": false
    },
    {
        "id": "21",
        "name": "Maroon Velvet Suit",
        "price": 1800,
        "description": "very beautiful suit",
        "images": [
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/26H35_1.jpg",
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/26H35_2.jpg"
        ],
        "category": "suits",
        "sizes": ["38", "40", "42", "44", "46"],
        "fabric": "Velvet",
        "code": "26H35",
        "creationDate": "2025-09-06T10:51:30.930Z",
        "bestseller": false
    },
    {
        "id": "22",
        "name": "White Chikankari Coord Set",
        "price": 2599,
        "description": "An elegant white coord set with beautiful Chikankari embroidery. Perfect for a sophisticated and breezy summer look.",
        "images": [
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/28H15_1.jpg",
            "https://res.cloudinary.com/di2f6s7a7/image/upload/v1/naari-eshop/28H15_2.jpg"
        ],
        "category": "coord-sets",
        "sizes": ["38", "40", "42"],
        "fabric": "Cotton",
        "code": "28H15",
        "creationDate": "2024-05-21T09:00:00Z",
        "bestseller": true
    }
];

const homepageData = {
    "headline": "Elegance in Bloom",
    "subheadline": "Discover our new collection where timeless tradition meets contemporary design. Handcrafted with passion, designed for the modern woman.",
    "heroProductIds": ["27H93", "27H81", "27H86", "27H92", "28H15"]
};

async function seedProducts() {
   const db = await getDb();
  const productsCollection = db.collection('products');
  console.log('Seeding products...');
  for (const product of productsData) {
    const { id, ...productData } = product as (Product & { id?: string });
    // Use the product 'code' as the document ID for consistency
    const docId = product.code;
    await productsCollection.doc(docId).set({ ...productData, id: docId });
    console.log(`- Added product ${product.name} with ID: ${docId}`);
  }
  console.log('Products seeded successfully!');
}

async function seedReviews() {
   const db = await getDb();
  const reviewsCollection = db.collection('reviews');
  console.log('Seeding reviews...');
  for (const review of reviewsData) {
     const { id, ...reviewData } = review as (Review & { id?: string });
     if (id && typeof id === 'string') {
        await reviewsCollection.doc(id).set(reviewData);
        console.log(`- Added review by ${review.name} with explicit ID: ${id}`);
     } else {
        const docRef = await reviewsCollection.add(reviewData);
        console.log(`- Added review by ${review.name} with auto-generated ID: ${docRef.id}`);
     }
  }
  console.log('Reviews seeded successfully!');
}

async function seedHomepage() {
   const db = await getDb();
    console.log('Seeding homepage content...');
    await db.collection('content').doc('homepage').set(homepageData);
    console.log('Homepage content seeded successfully!');
}


async function main() {
  try {
    await seedProducts();
    await seedReviews();
    await seedHomepage();
    console.log('\nDatabase seeding completed!');
    // process.exit(0) is removed to prevent the dev server from stopping
  } catch (error) {
    console.error('Error seeding database:', error);
    // process.exit(1) is removed to prevent the dev server from stopping
  }
}

// Check if the script is being run directly
if (process.argv[1] && (process.argv[1].endsWith('seed.ts') || process.argv[1].endsWith('seed'))) {
  main();
}
