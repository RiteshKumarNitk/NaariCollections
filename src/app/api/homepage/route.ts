
import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const homepageDataPath = path.join(process.cwd(), 'src/data/homepage.json');

async function getHomepageData() {
  try {
    const data = await fs.readFile(homepageDataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Could not read homepage data file:", error);
    // Return a default structure if the file doesn't exist or is empty
    return {
        headline: "",
        subheadline: "",
        heroProductIds: []
    };
  }
}

async function saveHomepageData(data: any) {
  try {
    const stringifiedData = JSON.stringify(data, null, 2); // Pretty-print JSON
    await fs.writeFile(homepageDataPath, stringifiedData, 'utf-8');
  } catch (error) {
    console.error("Could not write to homepage data file:", error);
    throw new Error("Failed to save homepage data.");
  }
}

export async function GET() {
  try {
    const data = await getHomepageData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API GET Error:', error);
    return NextResponse.json({ message: 'Failed to retrieve homepage data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const updatedData = await request.json();

    // Basic validation
    if (!updatedData.headline || !updatedData.subheadline || !Array.isArray(updatedData.heroProductIds)) {
        return NextResponse.json({ message: 'Invalid data format' }, { status: 400 });
    }

    await saveHomepageData(updatedData);
    
    return NextResponse.json(updatedData, { status: 200 });
  } catch (error) {
    console.error('API POST Error:', error);
    return NextResponse.json({ message: 'Failed to update homepage data' }, { status: 500 });
  }
}
