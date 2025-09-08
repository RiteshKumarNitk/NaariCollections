
import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import type { Product } from '@/lib/types';

const productsFilePath = path.join(process.cwd(), 'src/data/products.json');

// This is a utility function to read the JSON data file.
async function getProducts(): Promise<Product[]> {
  try {
    const data = await fs.readFile(productsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, we can return an empty array or handle it as needed.
    console.error("Could not read products file:", error);
    return [];
  }
}

// This is a utility function to write to the JSON data file.
async function saveProducts(products: Product[]) {
  try {
    const data = JSON.stringify(products, null, 2); // Pretty-print JSON
    await fs.writeFile(productsFilePath, data, 'utf-8');
  } catch (error) {
    console.error("Could not write to products file:", error);
    throw new Error("Failed to save product data.");
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  
  if (!productId) {
    return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
  }

  try {
    const updatedData = await request.json();
    const allProducts = await getProducts();
    
    let productFound = false;
    const updatedProducts = allProducts.map(product => {
      if (product.id === productId) {
        productFound = true;
        // Merge the existing product data with the new data from the form.
        return { ...product, ...updatedData, images: updatedData.images.filter((img: string) => img && img.trim() !== '') };
      }
      return product;
    });

    if (!productFound) {
      return NextResponse.json({ message: `Product with ID ${productId} not found` }, { status: 404 });
    }

    await saveProducts(updatedProducts);

    const updatedProduct = updatedProducts.find(p => p.id === productId);

    return NextResponse.json(updatedProduct, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof Error) {
        return NextResponse.json({ message: 'Failed to update product', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = params.id;

  if (!productId) {
    return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
  }

  try {
    const allProducts = await getProducts();
    const updatedProducts = allProducts.filter(p => p.id !== productId);

    if (allProducts.length === updatedProducts.length) {
      return NextResponse.json({ message: `Product with ID ${productId} not found` }, { status: 404 });
    }

    await saveProducts(updatedProducts);

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('API DELETE Error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Failed to delete product', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
  }
}
