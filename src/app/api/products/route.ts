
import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import type { Product } from '@/lib/types';

const productsFilePath = path.join(process.cwd(), 'src/data/products.json');

async function getProducts(): Promise<Product[]> {
  try {
    const data = await fs.readFile(productsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Could not read products file:", error);
    return [];
  }
}

async function saveProducts(products: Product[]) {
  try {
    const data = JSON.stringify(products, null, 2);
    await fs.writeFile(productsFilePath, data, 'utf-8');
  } catch (error) {
    console.error("Could not write to products file:", error);
    throw new Error("Failed to save product data.");
  }
}

export async function POST(request: Request) {
  try {
    const newProductData = await request.json();
    const allProducts = await getProducts();

    // Generate a unique ID and creation date for the new product
    const newProduct: Product = {
      ...newProductData,
      id: String(allProducts.length + 1 + Math.random()), // A simple way to generate a somewhat unique ID
      creationDate: new Date().toISOString(),
    };

    const updatedProducts = [...allProducts, newProduct];
    await saveProducts(updatedProducts);

    return NextResponse.json(newProduct, { status: 201 });

  } catch (error) {
    console.error('API POST Error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Failed to create product', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
  }
}
